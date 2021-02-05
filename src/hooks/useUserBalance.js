import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits } from "@ethersproject/units";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config, { tradeTokens } from "../config/config";

const userBalanceAtom = atom([]);
export default userBalanceAtom;

export function useUserBalance() {
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [userBalances, setUserBalance] = useAtom(userBalanceAtom);

  useEffect(() => {
    if (!account || !ethersProvider || !providerNetwork) return;
    fetchUserBalance(
      account,
      ethersProvider,
      providerNetwork,
      tradeTokens,
      setUserBalance
    );
  }, [account, ethersProvider, providerNetwork]);

  return [userBalances, setUserBalance];
}

export async function fetchUserBalance(
  account,
  provider,
  providerNetwork,
  tokens,
  setUserBalance
) {
  if (provider && providerNetwork) {
    try {
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();
      let calls = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].symbol === "VLX") {
          calls.push(ethcallProvider.getEthBalance(account));
        } else {
          const erc20Contract = new Contract(tokens[i].address, tokens[i].abi);
          calls.push(erc20Contract.balanceOf(account));
        }
      }
      const amountsRes = await ethcallProvider.all(calls);
      let amounts = [];
      for (let i = 0; i < amountsRes.length; i++) {
        amounts.push({
          name: tokens[i].name,
          symbol: tokens[i].symbol,
          balance: formatUnits(amountsRes[i], tokens[i].decimals),
        });
      }
      setUserBalance(amounts);
    } catch (e) {
      console.log("fetchUserBalance error");
      console.error(e);
      return;
    }
  }
}
