import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useWithdraw() {
  const { account, signer } = useContext(Web3Context);

  return useCallback(
    async (pool, tokenAmountOut) => {
      const action = "withdraw(uint256,uint256)";
      const params = [pool.index, tokenAmountOut];
      const poolContract = new Contract(pool.poolAddress, pool.poolABI, signer);
      let gasLimit;
      try {
        gasLimit = await poolContract.estimateGas[action](...params);
      } catch (err) {
        gasLimit = 1000000;
      }

      return poolContract[action](...params, {
        gasLimit,
      });
    },
    [signer]
  );
}
