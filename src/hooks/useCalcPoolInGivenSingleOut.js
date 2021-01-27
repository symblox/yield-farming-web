import { useCallback, useContext } from "react";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config from "../config";

export default function useCalcPoolInGivenSingleOut() {
  const { signer } = useContext(Web3Context);
  const { ethersProvider, providerNetwork } = useContext(Web3Context);

  return useCallback(
    async (pool, tokenAddress, amountToWei) => {
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(ethersProvider);
      await ethcallProvider.init();
      const bptContract = new Contract(pool.address, pool.abi);

      const totalSupplyCall = bptContract.totalSupply();
      const totalWeightCall = bptContract.getTotalDenormalizedWeight();
      const swapFeeCall = bptContract.getSwapFee();
      const balanceCall = bptContract.getBalance(tokenAddress);
      const denormCall = bptContract.getDenormalizedWeight(tokenAddress);

      const [
        totalSupply,
        totalWeight,
        swapFee,
        balance,
        denorm,
      ] = await ethcallProvider.all([
        totalSupplyCall,
        totalWeightCall,
        swapFeeCall,
        balanceCall,
        denormCall,
      ]);

      const amountOutCall = bptContract.calcPoolInGivenSingleOut(
        balance,
        denorm,
        totalSupply,
        totalWeight,
        amountToWei,
        swapFee
      );

      const [amountOut] = await ethcallProvider.all([amountOutCall]);

      return amountOut;
    },
    [signer]
  );
}
