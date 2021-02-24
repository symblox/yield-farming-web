import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useWithdrawReward() {
  const { account, signer } = useContext(Web3Context);

  return useCallback(
    async (pool) => {
      const poolContract = new Contract(pool.poolAddress, pool.poolABI, signer);
      let gasLimit;
      try {
        gasLimit = await poolContract.estimateGas["getReward"](pool.index);
      } catch (err) {
        gasLimit = 1000000;
      }

      return poolContract["getReward"](pool.index, {
        gasLimit,
      });
    },
    [signer]
  );
}
