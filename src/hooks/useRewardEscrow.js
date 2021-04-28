import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config, { pools } from "../config";

const rewardEscrowAtom = atom({
  userRewards: 0,
  userLastGetReward: 0,
  coolingTime: 0,
  unLockTime: 0,
});
export default rewardEscrowAtom;

export function useRewardEscrow() {
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [rewardEscrow, setRewardEscrow] = useAtom(rewardEscrowAtom);

  useEffect(() => {
    if (!account || !ethersProvider || !providerNetwork) return;
    fetchRewardEscrowValues(
      account,
      ethersProvider,
      providerNetwork,
      setRewardEscrow
    );
  }, [account, ethersProvider, providerNetwork]);

  return [rewardEscrow, setRewardEscrow];
}

export async function fetchRewardEscrowValues(
  account,
  provider,
  providerNetwork,
  setRewardEscrow
) {
  if (account && provider && providerNetwork) {
    try {
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();

      const rewardEscrowContract = new Contract(
        config.rewardEscrow,
        config.rewardEscrowAbi
      );
      const userRewardsCall = rewardEscrowContract.userRewards(account);
      const userLastGetRewardCall = rewardEscrowContract.userLastGetReward(
        account
      );
      const coolingTimeCall = rewardEscrowContract.coolingTime();

      const calls = [userRewardsCall, userLastGetRewardCall, coolingTimeCall];

      const results = await ethcallProvider.all(calls);
      const [userRewards, userLastGetReward, coolingTime] = results;

      setRewardEscrow({
        userRewards: formatUnits(userRewards, 18),
        userLastGetReward: userLastGetReward.toString(),
        coolingTime: coolingTime.toString(),
        unLockTime: userLastGetReward.add(coolingTime).toString(),
      });
    } catch (e) {
      setRewardEscrow({
        userRewards: 0,
        userLastGetReward: 0,
        coolingTime: 0,
        unLockTime: 0,
      });
      console.log("fetchRewardPoolsValues error");
      console.error(e);
      return;
    }
  }
}
