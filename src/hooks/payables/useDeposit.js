import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { MaxUint256, AddressZero } from "@ethersproject/constants";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useSingleDeposit() {
  const { account, signer } = useContext(Web3Context);

  const approve = async (tokenAddress, targetAddress, amount) => {
    const erc20Contract = new Contract(tokenAddress, config.erc20ABI, signer);
    const allowance = await erc20Contract.allowance(account, targetAddress);
    if (allowance.lt(amount)) {
      const tx = await erc20Contract.approve(targetAddress, MaxUint256);
      await tx.wait();
    }
  };

  return useCallback(
    async (pool, tokenAmountIn) => {
      const value = "0";
      const action = "deposit(uint256,uint256)";
      await approve(pool.address, pool.poolAddress, tokenAmountIn);
      const params = [pool.index, tokenAmountIn];
      const poolContract = new Contract(pool.poolAddress, pool.poolABI, signer);
      let gasLimit;
      try {
        gasLimit = await poolContract.estimateGas[action](...params, {
          value,
        });
      } catch (err) {
        gasLimit = 1000000;
      }

      return poolContract[action](...params, {
        gasLimit,
        value,
      });
    },
    [signer]
  );
}
