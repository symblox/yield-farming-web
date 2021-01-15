import { useEffect, useState, useContext } from "react";
import {
  parseUnits,
  formatUnits,
  parseEther,
  formatEther,
} from "@ethersproject/units";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config from "../config";

const useAvailableAmount = (pool) => {
  const { ethersProvider, providerNetwork } = useContext(Web3Context);
  const [availableAmounts, setAvailableAmounts] = useState("-");

  useEffect(() => {
    if (!ethersProvider || !pool) return;
    fetchAvailableValues(
      ethersProvider,
      providerNetwork,
      pool,
      setAvailableAmounts
    );
  }, [ethersProvider, pool]);

  return [availableAmounts, setAvailableAmounts];
};

const fetchAvailableValues = async (
  provider,
  providerNetwork,
  pool,
  setAvailableAmount
) => {
  if (provider && pool) {
    try {
      let array = [];
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();
      const bptContract = new Contract(pool.address, pool.abi);

      const totalSupplyCall = bptContract.totalSupply();
      const totalWeightCall = bptContract.getTotalDenormalizedWeight();
      const swapFeeCall = bptContract.getSwapFee();

      const [totalSupply, totalWeight, swapFee] = await ethcallProvider.all([
        totalSupplyCall,
        totalWeightCall,
        swapFeeCall,
      ]);

      for (let i = 0; i < pool.supportTokens.length; i++) {
        const balanceCall = bptContract.getBalance(
          pool.supportTokens[i].address
        );
        const denormCall = bptContract.getDenormalizedWeight(
          pool.supportTokens[i].address
        );

        const [balance, denorm] = await ethcallProvider.all([
          balanceCall,
          denormCall,
        ]);

        const stakeAmount = parseEther(
          parseFloat(pool.stakeAmount) *
            parseFloat(pool.supportTokens[i].allotRatio) +
            ""
        );

        const calcSingleOutGivenPoolInCall = bptContract.calcSingleOutGivenPoolIn(
          balance,
          denorm,
          totalSupply,
          totalWeight,
          stakeAmount,
          swapFee
        );
        const [amountOut] = await ethcallProvider.all([
          calcSingleOutGivenPoolInCall,
        ]);

        array.push({
          name: pool.supportTokens[i].name,
          amount: formatUnits(
            amountOut.toString(),
            pool.supportTokens[i].decimals
          ),
        });
      }

      setAvailableAmount(array);
    } catch (e) {
      console.error(e);
      return;
    }
  }
};

export default useAvailableAmount;
