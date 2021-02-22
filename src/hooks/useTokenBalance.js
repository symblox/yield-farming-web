import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits, parseEther } from "@ethersproject/units";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config from "../config";

const tokenBalanceAtom = atom({});
export default tokenBalanceAtom;

export function useTokenBalance(tokens) {
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [tokenBalances, setTokenBalances] = useAtom(tokenBalanceAtom);

  useEffect(() => {
    if (!ethersProvider || !tokens) return;
    fetchTokenBalanceValues(
      account,
      ethersProvider,
      providerNetwork,
      tokens,
      setTokenBalances
    );
  }, [account, ethersProvider, tokens]);

  return [tokenBalances, setTokenBalances];
}

export async function fetchTokenBalanceValues(
  account,
  provider,
  providerNetwork,
  supportTokens,
  setTokenBalances
) {
  if (provider && supportTokens) {
    try {
      let array = [];
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();
      let calls = [];
      for (let i = 0; i < supportTokens.length; i++) {
        if (supportTokens[i].symbol === "BNB") {
          calls.push(ethcallProvider.getEthBalance(account));
        } else {
          const contract = new Contract(
            supportTokens[i].address,
            supportTokens[i].abi
          );
          calls.push(contract.balanceOf(account));
        }
      }

      const balancesRes = await ethcallProvider.all(calls);
      let balances = {};
      for (let i = 0; i < balancesRes.length; i++) {
        balances[supportTokens[i].symbol] = parseFloat(
          formatUnits(balancesRes[i], supportTokens[i].decimals)
        );
      }
      setTokenBalances(balances);
    } catch (e) {
      console.log("fetchTokenBalanceValues error");
      console.error(e);
      return;
    }
  }
}
