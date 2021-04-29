import React, {useCallback, useContext, useEffect, useState, useReducer} from "react";
import {Contract} from "@ethersproject/contracts";
import {Web3Context} from "./Web3Context";
import config from "../config";

export const PoolContext = React.createContext({});

const initialBalanceState = {
  syx: 0,
  oldSyx: 0,
  oldSyx2: 0,
  oldSyx3: 0,
  vlx: 0,
  svlx: 0
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
    case "oldSyx2":
      return Object.assign({}, state, {
        oldSyx2: action.data
      });
    case "oldSyx3":
      return Object.assign({}, state, {
        oldSyx3: action.data
      });
    case "svlx":
      return Object.assign({}, state, {
        svlx: action.data
      });
    case "vlx":
      return Object.assign({}, state, {
        vlx: action.data
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

  const getSvlxExchangeRate = useCallback(async () => {
    try {
      const svlxContract = new Contract(config.svlx, config.svlxABI, ethersProvider);
      const rate = await svlxContract.exchangeRate();
      setSvlxExchangeRate(rate / 10 ** 18);
    } catch (error) {
      setIsError(true);
      setErrorMsg(error);
    }
  }, [ethersProvider]);

  const getVlxData = useCallback(async () => {
    if (account) {
      try {
        const balance = await ethersProvider.getBalance(account);
        balanceDispatch({type: "vlx", data: balance});
      } catch (error) {
        setIsError(true);
        setErrorMsg(error);
      }
    }
  }, [account, balanceDispatch, ethersProvider]);

  const getSvlxData = useCallback(async () => {
    if (account) {
      try {
        const svlxContract = new Contract(config.svlx, config.svlxABI, ethersProvider);
        const balance = await svlxContract.balanceOf(account);
        const withdrawable = await svlxContract.getTotalWithdrawable();
        const stakingAuRa = await svlxContract.stakingAuRa();
        const orderedAmount = await svlxContract.orderedAmount();

        const stakingAuRaContract = new Contract(stakingAuRa, config.stakingAuRaABI, ethersProvider);
        const currentBlock = await ethersProvider.getBlockNumber();
        const stakingEpochEndBlock = await stakingAuRaContract.stakingEpochEndBlock();
        const stakingEpochDuration = (parseInt(stakingEpochEndBlock) - parseInt(currentBlock)) * config.secPerBlock;
        balanceDispatch({type: "svlx", data: balance});
        setSvlxWithdrawable(withdrawable);
        setStakingEpochDuration(stakingEpochDuration);
        setOrderedAmount(orderedAmount);
      } catch (error) {
        setIsError(true);
        setErrorMsg(error);
      }
    }
  }, [account, balanceDispatch, ethersProvider]);

  const getOldSyxData = useCallback(async () => {
    if (account) {
      try {
        const oldSyxContract = new Contract(config.oldSyx, config.erc20ABI, ethersProvider);
        const oldSyxBalance = await oldSyxContract.balanceOf(account);
        const oldSyxBalanceLockedOnSyxV2 = await oldSyxContract.balanceOf(config.oldSyx2);

        const oldSyxSupply = await oldSyxContract.totalSupply();

        const oldSyx2Contract = new Contract(config.oldSyx2, config.erc20ABI, ethersProvider);
        const oldSyx3Contract = new Contract(config.oldSyx3, config.erc20ABI, ethersProvider);
        const oldSyx2Balance = await oldSyx2Contract.balanceOf(account);
        const oldSyx2Supply = await oldSyx2Contract.totalSupply();
        const oldSyx3Balance = await oldSyx3Contract.balanceOf(account);
        const oldSyx3Supply = await oldSyx3Contract.totalSupply();
        setOldSyxSupply(oldSyxSupply.add(oldSyx2Supply).add(oldSyx3Supply).sub(oldSyxBalanceLockedOnSyxV2));
        balanceDispatch({type: "oldSyx", data: oldSyxBalance});
        balanceDispatch({type: "oldSyx2", data: oldSyx2Balance});
        balanceDispatch({type: "oldSyx3", data: oldSyx3Balance});
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
          const syxContract = new Contract(config.syx, config.syxABI, signer);
          const oldSyxContract = new Contract(oldSyxAddress, config.erc20ABI, signer);
          const allowance = await oldSyxContract.allowance(account, config.syx);
          if (parseFloat(allowance) < parseFloat(amount)) {
            const tx = await oldSyxContract.approve(config.syx, amount);
            await tx.wait();
          }
          const tx2 = await syxContract.exchangeSyx(oldSyxAddress, amount);
          await tx2.wait();
          getSyxData();
          getOldSyxData();
        } catch (error) {
          setIsError(true);
          setErrorMsg(error);
        } finally {
          setLoading(false);
        }
      }
    },
    [account, ethersProvider, getOldSyxData, getSyxData]
  );

  const svlxDeposit = useCallback(
    async amount => {
      if (account) {
        setLoading(true);
        try {
          const signer = ethersProvider.getSigner();
          const svlxContract = new Contract(config.svlx, config.svlxABI, signer);
          let gasLimit;
          try {
            gasLimit = await svlxContract.estimateGas.deposit({
              value: amount
            });
          } catch (error) {
            gasLimit = 3000000;
          }

          const tx = await svlxContract.deposit({value: amount, gasLimit});
          await tx.wait();
          getVlxData();
          getSvlxData();
          getSvlxExchangeRate();
        } catch (error) {
          setIsError(true);
          setErrorMsg(error);
        } finally {
          setLoading(false);
        }
      }
    },
    [account, ethersProvider]
  );

  const svlxWithdraw = useCallback(
    async amount => {
      if (account) {
        setLoading(true);
        try {
          const signer = ethersProvider.getSigner();
          const svlxContract = new Contract(config.svlx, config.svlxABI, signer);

          let gasLimit;
          try {
            gasLimit = await svlxContract.estimateGas.withdraw(amount);
          } catch (error) {
            gasLimit = 3000000;
          }
          try {
            const tx = await svlxContract.withdraw(amount, {gasLimit});
            await tx.wait();
          } catch (error) {
            error.type = "SVLX_WITHDRAW_ERR";
            setIsError(true);
            setErrorMsg(error);
          }
          getVlxData();
          getSvlxData();
          getSvlxExchangeRate();
        } catch (error) {
          setIsError(true);
          setErrorMsg(error);
        } finally {
          setLoading(false);
        }
      }
    },
    [account, ethersProvider]
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
      getVlxData();
      getSvlxData();
      getSvlxExchangeRate();
    }
  }, [account, providerNetwork, lastChainId]);

  return (
    <PoolContext.Provider
      value={{
        balanceState,
        orderedAmount,
        oldSyxSupply,
        exchangeSyx,
        svlxDeposit,
        svlxWithdraw,
        svlxExchangeRate,
        svlxWithdrawable,
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
