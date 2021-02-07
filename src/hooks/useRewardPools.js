import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config, { pools } from "../config";

const rewardPoolsAtom = atom({ pools, loaded: false });
export default rewardPoolsAtom;

export function useRewardPools(pool) {
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [rewardPool, setRewardPools] = useAtom(rewardPoolsAtom);

  useEffect(() => {
    if (!account || !ethersProvider || !pool) return;
    fetchRewardPoolsValues(
      account,
      ethersProvider,
      providerNetwork,
      setRewardPools
    );
  }, [account, ethersProvider, pool]);

  return [rewardPool, setRewardPools];
}

export async function fetchRewardPoolsValues(
  account,
  provider,
  providerNetwork,
  setRewardPools
) {
  if (account && provider && providerNetwork) {
    try {
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();

      const connectorFactoryContract = new Contract(
        config.connectorFactory,
        config.connectorFactoryABI
      );
      //Use temporary objects to set, otherwise the modification will not take effect
      let newPools = [];
      const promises = pools.map(async (pool, i) => {
        pool.sortIndex = i;
        const connectorAddressCall = connectorFactoryContract.connectors(
          account,
          pool.index
        );
        const [connectorAddress] = await ethcallProvider.all([
          connectorAddressCall,
        ]);
        pool.entryContractAddress = connectorAddress;

        const poolContract = new Contract(pool.poolAddress, pool.poolABI);
        const userInfoCall = poolContract.userInfo(
          pool.index,
          connectorAddress
        );
        const totalAllocPointCall = poolContract.totalAllocPoint();
        const poolInfoCall = poolContract.poolInfo(pool.index);
        let calls = [userInfoCall, totalAllocPointCall, poolInfoCall];
        if (connectorAddress !== AddressZero) {
          const connectorContract = new Contract(
            connectorAddress,
            pool.entryContractABI
          );
          const earnedCall = connectorContract.earned();
          calls.push(earnedCall);
        }

        const results = await ethcallProvider.all(calls);
        const [userInfo, totalAllocPoint, poolInfo] = results;
        let earned = "0";
        if (connectorAddress !== AddressZero) {
          earned = results[3];
        }

        pool.stakeAmount = formatUnits(userInfo.amount, pool.decimals);
        pool.rewardsAvailable = formatUnits(earned, pool.rewardToken.decimals);
        pool.allocPoint = poolInfo.allocPoint / totalAllocPoint;

        if (pool.type !== "seed") {
          const bptContract = new Contract(pool.address, pool.abi);
          const maxInCall = bptContract.MAX_IN_RATIO();
          const maxOutCall = bptContract.MAX_OUT_RATIO();
          const totalSupplyCall = bptContract.totalSupply();

          let extraCall = [];
          pool.supportTokens.map((v, i) => {
            extraCall.push(bptContract.getNormalizedWeight(v.address));
          });

          const results2 = await ethcallProvider.all([
            maxInCall,
            maxOutCall,
            totalSupplyCall,
            ...extraCall,
          ]);

          const [maxIn, maxOut, totalSupply] = results2;

          let weight = "";
          pool.supportTokens.map((v, i) => {
            weight += (
              parseFloat(formatUnits(results2[i + 3], pool.decimals)) * 100
            ).toFixed(0);
            if (i !== pool.supportTokens.length - 1) weight += ":";
          });

          pool.maxIn = formatUnits(maxIn, pool.decimals);
          pool.maxOut = formatUnits(maxOut, pool.decimals);
          pool.weight = weight;
          pool.totalSupply = formatUnits(totalSupply, pool.decimals);
        } else {
          const bptContract = new Contract(pool.address, pool.abi);
          const totalSupplyCall = bptContract.balanceOf(pool.poolAddress);
          const [totalSupply] = await ethcallProvider.all([totalSupplyCall]);
          pool.totalSupply = formatUnits(totalSupply, pool.decimals);
        }
        newPools.push(pool);
      });
      await Promise.all(promises);
      setRewardPools({
        pools: newPools.sort(function (a, b) {
          return a.sortIndex - b.sortIndex;
        }),
        loaded: true,
      });
    } catch (e) {
      setRewardPools({ pools, loaded: false });
      console.log("fetchRewardPoolsValues error");
      console.error(e);
      return;
    }
  }
}
