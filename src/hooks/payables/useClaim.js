import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useClaim() {
  const { signer } = useContext(Web3Context);

  return useCallback(async () => {
    const action = "claim()";
    const params = [];
    const rewardEscrowContract = new Contract(
      config.rewardEscrow,
      config.rewardEscrowAbi,
      signer
    );
    let gasLimit;
    try {
      gasLimit = await rewardEscrowContract.estimateGas[action](...params);
    } catch (err) {
      gasLimit = 1000000;
    }

    return rewardEscrowContract[action](...params, {
      gasLimit,
    });
  }, [signer]);
}
