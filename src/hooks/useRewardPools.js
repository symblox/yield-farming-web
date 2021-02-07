import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config, { pools } from "../config";

const rewardPoolsAtom = atom(pools);
export default rewardPoolsAtom;

export function useRewardPools(pool) {
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [rewardPools, setRewardPools] = useAtom(rewardPoolsAtom);

  useEffect(() => {
    if (!account || !ethersProvider || !pool) return;
    fetchRewardPoolsValues(
      account,
      ethersProvider,
      providerNetwork,
      setRewardPools
    );
  }, [account, ethersProvider, pool]);

  return [rewardPools, setRewardPools];
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
      const promises = pools.map(async (pool) => {
        const connectorAddressCall = connectorFactoryContract.connectors(
          account,
          pool.index
        );
        const [connectorAddress] = await ethcallProvider.all([
          connectorAddressCall,
        ]);
        pool.entryContractAddress = connectorAddress;

        const poolContract = new Contract(pool.poolAddress, pool.poolABI);
        const connectorContract = new Contract(
          connectorAddress,
          pool.entryContractABI
        );

        const userInfoCall = poolContract.userInfo(
          pool.index,
          connectorAddress
        );
        const earnedCall = connectorContract.earned();
        const totalAllocPointCall = poolContract.totalAllocPoint();
        const poolInfoCall = poolContract.poolInfo(pool.index);

        const [
          userInfo,
          earned,
          totalAllocPoint,
          poolInfo,
        ] = await ethcallProvider.all([
          userInfoCall,
          earnedCall,
          totalAllocPointCall,
          poolInfoCall,
        ]);

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

          const results = await ethcallProvider.all([
            maxInCall,
            maxOutCall,
            totalSupplyCall,
            ...extraCall,
          ]);

          const [maxIn, maxOut, totalSupply] = results;

          let weight = "";
          pool.supportTokens.map((v, i) => {
            weight += (
              parseFloat(formatUnits(results[i + 3], pool.decimals)) * 100
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
      setRewardPools(newPools);
    } catch (e) {
      console.log("fetchRewardPoolsValues error");
      console.error(e);
      return;
    }
  }
}
