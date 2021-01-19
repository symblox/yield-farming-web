import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits, parseEther } from "@ethersproject/units";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config from "../config";

const availableAmountAtom = atom("-");
export default availableAmountAtom;

export function useAvailableAmount(pool) {
  const { ethersProvider, providerNetwork } = useContext(Web3Context);
  const [availableAmounts, setAvailableAmounts] = useAtom(availableAmountAtom);

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
}

export async function fetchAvailableValues(
  provider,
  providerNetwork,
  pool,
  setAvailableAmounts
) {
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

      const ratio = parseFloat(1 / pool.supportTokens.length);

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
          parseFloat(pool.stakeAmount) * ratio + ""
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
          name: pool.supportTokens[i].symbol,
          amount: formatUnits(
            amountOut.toString(),
            pool.supportTokens[i].decimals
          ),
        });
      }

      setAvailableAmounts(array);
    } catch (e) {
      console.error(e);
      return;
    }
  }
}
