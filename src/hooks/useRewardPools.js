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

      const promises = pools.map(async (pool) => {
        const connectorAddressCall = connectorFactoryContract.connectors(
          account,
          pool.index
        );
        const [connectorAddress] = await ethcallProvider.all([
          connectorAddressCall,
        ]);

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
        const [userInfo, earned] = await ethcallProvider.all([
          userInfoCall,
          earnedCall,
        ]);

        pool.stakeAmount = formatUnits(userInfo.amount, pool.decimals);
        pool.rewardsAvailable = formatUnits(earned, pool.rewardToken.decimals);
      });
      await Promise.all(promises);
      console.log({ pools });
      setRewardPools(pools);
    } catch (e) {
      console.log("fetchRewardPoolsValues error");
      console.error(e);
      return;
    }
  }
}
