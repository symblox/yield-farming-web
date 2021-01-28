import { useCallback, useContext } from "react";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config from "../config/config";

export default function useCalcTradePrice() {
  const { signer } = useContext(Web3Context);
  const { ethersProvider, providerNetwork } = useContext(Web3Context);

  return useCallback(
    async (pool, tokenIn, tokenOut, amountToWei, type) => {
      if (parseFloat(amountToWei) === 0) return 0;
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(ethersProvider);
      await ethcallProvider.init();
      const bptContract = new Contract(pool.address, pool.abi);

      const balanceInCall = bptContract.getBalance(tokenIn);
      const denormInCall = bptContract.getDenormalizedWeight(tokenIn);
      const balanceOutCall = bptContract.getBalance(tokenOut);
      const denormOutCall = bptContract.getDenormalizedWeight(tokenOut);
      const swapFeeCall = bptContract.getSwapFee();

      const [
        balanceIn,
        denormIn,
        balanceOut,
        denormOut,
        swapFee,
      ] = await ethcallProvider.all([
        balanceInCall,
        denormInCall,
        balanceOutCall,
        denormOutCall,
        swapFeeCall,
      ]);

      if (type === "sell") {
        const tokenAmountOutCall = bptContract.calcOutGivenIn(
          balanceIn,
          denormIn,
          balanceOut,
          denormOut,
          amountToWei,
          swapFee
        );
        const [tokenAmountOut] = await ethcallProvider.all([
          tokenAmountOutCall,
        ]);
        return tokenAmountOut / amountToWei;
      } else if (type === "buy") {
        const tokenAmountInCall = await bptContract.calcInGivenOut(
          balanceIn,
          denormIn,
          balanceOut,
          denormOut,
          amountToWei,
          swapFee
        );
        const [tokenAmountIn] = await ethcallProvider.all([tokenAmountInCall]);
        return amountToWei / tokenAmountIn;
      } else {
        return 0;
      }
    },
    [signer]
  );
}
