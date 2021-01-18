import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits, parseEther } from "@ethersproject/units";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config from "../config";

const poolMaxTokenAmountInAtom = atom({});
export default poolMaxTokenAmountInAtom;

export function usePoolMaxTokenAmountIn(pool) {
  const { ethersProvider, providerNetwork } = useContext(Web3Context);
  const [poolMaxTokenAmountIn, setPoolMaxTokenAmountIn] = useAtom(
    poolMaxTokenAmountInAtom
  );

  useEffect(() => {
    if (!ethersProvider || !pool) return;
    fetchPoolMaxTokenAmountInValues(
      ethersProvider,
      providerNetwork,
      pool,
      setPoolMaxTokenAmountIn
    );
  }, [ethersProvider, pool]);

  return [poolMaxTokenAmountIn, setPoolMaxTokenAmountIn];
}

export async function fetchPoolMaxTokenAmountInValues(
  provider,
  providerNetwork,
  pool,
  setPoolMaxTokenAmountIn
) {
  if (provider && pool) {
    try {
      let array = [];
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();
      const bptContract = new Contract(pool.address, pool.abi);

      let calls = [bptContract.MAX_IN_RATIO()];
      for (let i = 0; i < pool.supportTokens.length; i++) {
        calls.push(bptContract.getBalance(pool.supportTokens[i].address));
      }

      const amountsRes = await ethcallProvider.all(calls);
      let amounts = {};
      const ratio = formatUnits(amountsRes[0], 18);
      //0 is MAX_IN_RATIO,so from 1 to end, supportTokens index is i - 1
      for (let i = 1; i < amountsRes.length; i++) {
        amounts[pool.supportTokens[i - 1].symbol] =
          formatUnits(amountsRes[i], pool.supportTokens[i - 1].decimals) *
          ratio;
      }

      setPoolMaxTokenAmountIn(amounts);
    } catch (e) {
      console.error(e);
      return;
    }
  }
}
