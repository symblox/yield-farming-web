import React, {useCallback, useContext, useEffect, useState, useReducer} from "react";
import {Contract} from "@ethersproject/contracts";
import {Web3Context} from "./Web3Context";
import config from "../config";

export const PoolContext = React.createContext({});

const initialBalanceState = {
  syx: 0,
  oldSyx: 0
};

function balanceReducer(state, action) {
  switch (action.type) {
    case "syx":
      return Object.assign({}, state, {
        syx: action.data
      });
    case "oldSyx":
      return Object.assign({}, state, {
        oldSyx: action.data
      });
    default:
      return state;
  }
}

export function PoolContextProvider({children}) {
  const {ethersProvider, account, providerNetwork} = useContext(Web3Context);

  const [balanceState, balanceDispatch] = useReducer(balanceReducer, initialBalanceState);
  const [svlxExchangeRate, setSvlxExchangeRate] = useState("-");
  const [svlxWithdrawable, setSvlxWithdrawable] = useState("0");
  const [stakingEpochDuration, setStakingEpochDuration] = useState("-");
  const [orderedAmount, setOrderedAmount] = useState(null);
  const [oldSyxSupply, setOldSyxSupply] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastChainId, setLastChainId] = useState(0);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});

  const getOldSyxData = useCallback(async () => {
    if (account) {
      try {
        const oldSyxContract = new Contract(config.oldSyx, config.erc20ABI, ethersProvider);
        const oldSyxBalance = await oldSyxContract.balanceOf(account);
        const oldSyxSupply = await oldSyxContract.totalSupply();
        setOldSyxSupply(oldSyxSupply);
        balanceDispatch({type: "oldSyx", data: oldSyxBalance});
      } catch (error) {
        setIsError(true);
        setErrorMsg(error);
      }
    }
  }, [account, balanceDispatch, setOldSyxSupply, ethersProvider]);

  const getSyxData = useCallback(async () => {
    if (account) {
      try {
        const syxContract = new Contract(config.syx, config.erc20ABI, ethersProvider);
        const syxBalance = await syxContract.balanceOf(account);
        balanceDispatch({type: "syx", data: syxBalance});
      } catch (error) {
        setIsError(true);
        setErrorMsg(error);
      }
    }
  }, [account, balanceDispatch, ethersProvider]);

  const exchangeSyx = useCallback(
    async (type, amount) => {
      if (account) {
        setLoading(true);
        const oldSyxAddress = config[type];
        try {
          const signer = ethersProvider.getSigner();
          const syxMinterContract = new Contract(config.syxMinter, config.syxMinterABI, signer);
          const oldSyxContract = new Contract(oldSyxAddress, config.erc20ABI, signer);
          const allowance = await oldSyxContract.allowance(account, config.syxMinter);
          if (parseFloat(allowance) < parseFloat(amount)) {
            const tx = await oldSyxContract.approve(config.syxMinter, amount);
            await tx.wait();
          }
          const tx2 = await syxMinterContract.exchangeSyx(oldSyxAddress, amount);
          await tx2.wait();
          getSyxData();
          getOldSyxData();
        } catch (error) {
          console.log(error);
          setIsError(true);
          setErrorMsg(error);
        } finally {
          setLoading(false);
        }
      }
    },
    [account, ethersProvider, getOldSyxData, getSyxData]
  );

  useEffect(() => {
    if (
      providerNetwork &&
      providerNetwork.chainId &&
      parseInt(providerNetwork.chainId) !== parseInt(lastChainId) &&
      account
    ) {
      setLastChainId(providerNetwork.chainId);
      getOldSyxData();
      getSyxData();
    }
  }, [account, providerNetwork, lastChainId]);

  return (
    <PoolContext.Provider
      value={{
        balanceState,
        orderedAmount,
        oldSyxSupply,
        exchangeSyx,
        stakingEpochDuration,
        loading,
        isError,
        setIsError,
        errorMsg,
        setErrorMsg
      }}
    >
      {children}
    </PoolContext.Provider>
  );
}
