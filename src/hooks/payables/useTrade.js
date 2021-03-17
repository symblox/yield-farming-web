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
    async (tradeType, swaps, sellToken, buyToken, tokenAmountIn, minAmountOut) => {
      const exchangeContract = new Contract(
        config.exchangeProxy,
        config.exchangeAbi,
        signer
      );

      let value = "0";
      let action,params;
      if(tradeType === "swapExactIn"){
        action =
        "multihopBatchSwapExactIn((address,address,address,uint256,uint256,uint256)[][],address,address,uint256,uint256)";
        params = [swaps, sellToken, buyToken, tokenAmountIn, minAmountOut];
      }else{
        action =
        "multihopBatchSwapExactOut((address,address,address,uint256,uint256,uint256)[][],address,address,uint256)";
        params = [swaps, sellToken, buyToken, tokenAmountIn];
      }
      
      if (
        sellToken === AddressZero ||
        sellToken.toLowerCase() === config.wvlx.toLowerCase()
      ) {
        value = tokenAmountIn;
      } else {
        await approve(sellToken, config.exchangeProxy, tokenAmountIn);
      }

      let gasLimit;
      try {
        gasLimit = await exchangeContract.estimateGas[action](...params, {
          value,
        });
      } catch (err) {
        gasLimit = 1000000;
      }

      return exchangeContract[action](...params, {
        gasLimit,
        value,
      });
    },
    [signer]
  );
}
