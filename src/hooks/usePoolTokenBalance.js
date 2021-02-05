import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits, parseEther } from "@ethersproject/units";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config from "../config/config";

const poolTokenBalanceAtom = atom({});
export default poolTokenBalanceAtom;

export function usePoolTokenBalance(pool) {
  const { ethersProvider, providerNetwork } = useContext(Web3Context);
  const [poolTokenBalance, setPoolTokenBalance] = useAtom(poolTokenBalanceAtom);

  useEffect(() => {
    if (!ethersProvider || !pool) return;
    fetchPoolTokenBalance(
      ethersProvider,
      providerNetwork,
      pool,
      setPoolTokenBalance
    );
  }, [ethersProvider, pool]);

  return [poolTokenBalance, setPoolTokenBalance];
}

export async function fetchPoolTokenBalance(
  provider,
  providerNetwork,
  pool,
  setPoolTokenBalance
) {
  if (provider && pool) {
    try {
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();
      const bptContract = new Contract(pool.address, pool.abi);
      let calls = [];
      for (let i = 0; i < pool.supportTokens.length; i++) {
        calls.push(bptContract.getBalance(pool.supportTokens[i].address));
      }

      const amountsRes = await ethcallProvider.all(calls);
      let amounts = {};
      for (let i = 0; i < amountsRes.length; i++) {
        amounts[pool.supportTokens[i].symbol] = formatUnits(
          amountsRes[i],
          pool.supportTokens[i].decimals
        );
      }
      setPoolTokenBalance(amounts);
      return amounts;
    } catch (e) {
      console.log("fetchPoolTokenBalance error");
      console.error(e);
      return;
    }
  }
}
