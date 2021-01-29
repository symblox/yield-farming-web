import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { MaxUint256, AddressZero } from "@ethersproject/constants";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useTrade() {
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
    async (
      pool,
      sellToken,
      buyToken,
      minAmountOut,
      maxPrice,
      tokenAmountIn
    ) => {
      const bptContract = new Contract(pool.address, pool.abi, signer);

      let value = "0";
      let action;
      let params = [];

      if (sellToken === AddressZero) {
        action = "swapWTokenAmountIn(address,uint256,uint256)";
        value = tokenAmountIn;
        params = [buyToken, minAmountOut, maxPrice];
      } else if (buyToken === AddressZero) {
        action = "swapExactAmountInWTokenOut(address,uint256,uint256,uint256)";
        params = [sellToken, tokenAmountIn, minAmountOut, maxPrice];
        await approve(sellToken, pool.address, tokenAmountIn);
      } else {
        action = "swapExactAmountIn(address,uint256,address,uint256,uint256)";
        params = [sellToken, tokenAmountIn, buyToken, minAmountOut, maxPrice];
        await approve(sellToken, pool.address, tokenAmountIn);
      }

      let gasLimit;
      try {
        gasLimit = await bptContract.estimateGas[action](...params, {
          value,
        });
      } catch (err) {
        gasLimit = 1000000;
      }

      return bptContract[action](...params, {
        gasLimit,
        value,
      });
    },
    [signer]
  );
}
