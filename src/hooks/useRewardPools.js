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
    if (!account || !ethersProvider || !providerNetwork || !pool) return;
    fetchRewardPoolsValues(
      account,
      ethersProvider,
      providerNetwork,
      setRewardPools
    );
  }, [account, ethersProvider, providerNetwork, pool]);

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
      const curBlockNumber = await provider.getBlockNumber();
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();
      //Use temporary objects to set, otherwise the modification will not take effect
      let newPools = [];
      const promises = pools.map(async (pool, i) => {
        pool.sortIndex = i;
        const poolContract = new Contract(pool.poolAddress, pool.poolABI);
        const userInfoCall = poolContract.userInfo(pool.index, account);
        const totalAllocPointCall = poolContract.totalAllocPoint();
        const poolInfoCall = poolContract.poolInfo(pool.index);
        const syxPerBlockCall = poolContract.syxPerBlock();
        const bonusEndBlockCall = poolContract.bonusEndBlock();
        const startBlockCall = poolContract.startBlock();
        const endBlockCall = poolContract.endBlock();
        const bonusMultiplierCall = poolContract.BONUS_MULTIPLIER();
        const earnedCall = poolContract.pendingSyx(pool.index, account);

        const calls = [
          userInfoCall,
          totalAllocPointCall,
          poolInfoCall,
          syxPerBlockCall,
          bonusEndBlockCall,
          startBlockCall,
          endBlockCall,
          bonusMultiplierCall,
          earnedCall,
        ];

        const results = await ethcallProvider.all(calls);
        const [
          userInfo,
          totalAllocPoint,
          poolInfo,
          rate,
          bonusEndBlock,
          startBlock,
          endBlock,
          bonusMultiplier,
          earned,
        ] = results;
        pool.stakeAmount = formatUnits(userInfo.amount, pool.decimals);
        pool.rewardsAvailable = formatUnits(earned, pool.rewardToken.decimals);
        pool.allocPoint = poolInfo.allocPoint / totalAllocPoint;

        if (parseFloat(curBlockNumber) >= parseFloat(endBlock)) {
          pool.rewardRate = "0";
        } else if (parseFloat(curBlockNumber) < parseFloat(startBlock)) {
          pool.rewardRate = "0";
        } else if (parseFloat(curBlockNumber) < parseFloat(bonusEndBlock)) {
          pool.rewardRate = formatUnits(
            parseFloat(rate) * parseFloat(bonusMultiplier) + "",
            pool.rewardToken.decimals
          );
        } else {
          pool.rewardRate = formatUnits(rate, pool.rewardToken.decimals);
        }

        pool.rewardRate =
          parseFloat(pool.rewardRate) * parseFloat(pool.allocPoint);

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
