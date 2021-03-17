import React, {useContext, useEffect, useState} from "react";
import {FormattedMessage} from "react-intl";
import {atom, useAtom} from "jotai";
import {parseUnits, formatUnits} from "@ethersproject/units";
import {AddressZero} from "@ethersproject/constants";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import {Web3Context} from "../contexts/Web3Context";
import styles from "../styles/transaction";
import tokenBalanceAtom, {fetchTokenBalanceValues} from "../hooks/useTokenBalance";
import sorAtom, {findBestSwapsMulti, fetchPoolData, fetchPathData} from "../hooks/useSor";
import useTrade from "../hooks/payables/useTrade";
import config, {tradeTokens} from "../config";
import {debounce} from "../utils/debounce.js";
import {bnum} from "../utils/bignumber";

const loadingAtom = atom(get => {
  const tokenBalances = get(tokenBalanceAtom);
  let loading = false;
  if (Object.keys(tokenBalances).length === 0) loading = true;
  return loading;
});

const Transaction = props => {
  const {classes, showHash, errorReturned} = props;
  const tradableAmountAtom = atom(get => {
    const tokenBalances = get(tokenBalanceAtom);
    let tradableAmount = {};
    let balance;
    for (let key in tokenBalances) {
      balance = tokenBalances[key];
      if (key === "VLX") {
        balance =
          tokenBalances[key] > config.minReservedAmount ? tokenBalances[key] - config.minReservedAmount : 0;
      }

      tradableAmount[key] = balance;
    }

    return tradableAmount;
  });
  const trade = useTrade();
  const {account, ethersProvider, providerNetwork} = useContext(Web3Context);
  const [txLoading, setTxLoading] = useState(false);
  const [sellToken, setSellToken] = useState({});
  const [buyToken, setBuyToken] = useState({});
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [price, setPrice] = useState("-");
  const [swaps, setSwaps] = useState([]);
  const [slippageTolerance, setSlippageTolerance] = useState(1); //%
  const [calcPriceLoading, setCalcPriceLoading] = useState(false);
  const [poolList, setPoolList] = useState([]);
  const [tradeType, setTradeType] = useState("swapExactIn");
  const [sor, setSor] = useAtom(sorAtom);
  const [tokenBalances, setTokenBalances] = useAtom(tokenBalanceAtom);
  const [tradableAmount] = useAtom(tradableAmountAtom);
  const [loading] = useAtom(loadingAtom);

  useEffect(() => {
    if (!ethersProvider || !providerNetwork || !account) return;
    fetchPoolList();
    fetchTokenBalanceValues(account, ethersProvider, providerNetwork, tradeTokens, setTokenBalances);
  }, [ethersProvider, providerNetwork, account]);

  useEffect(() => {
    if (tradeTokens.length < 2) return;
    setSellToken(tradeTokens[0]);
    setBuyToken(tradeTokens[1]);
    fetchTradePrice("swapExactIn", tradeTokens[0], tradeTokens[1]);
  }, [poolList]);

  const fetchPoolList = async () => {
    const poolList = await fetchPoolData(ethersProvider, providerNetwork);
    setPoolList(poolList);
  };

  const fetchTradePrice = async (type = "swapExactIn", sellToken, buyToken, amount = 1, callback) => {
    if (poolList.length > 0 && amount > 0) {
      setCalcPriceLoading(true);
      debounce(1000, async () => {
        const inputToken = sellToken.address;
        const outputToken = buyToken.address;
        try {
          const newSor = await fetchPathData(inputToken, outputToken, sor, poolList, setSor);
          const [totalReturn, swap] = await findBestSwapsMulti(
            newSor,
            type,
            bnum(parseUnits(amount.toString(), type === "swapExactIn" ? sellToken.decimals : buyToken.decimals)),
            poolList.length,
            0
          );
          setSwaps(swap);
          const price = parseFloat(
            formatUnits(
              bnum(totalReturn.toString()).div(bnum(amount)).toFixed(0, 0),
              type === "swapExactIn" ? buyToken.decimals : sellToken.decimals
            )
          );
          if (type === "swapExactIn") {
            setPrice(price.toFixed(6));
          } else {
            setPrice((1 / price).toFixed(6));
          }

          if (typeof callback === "function") callback(totalReturn.toString());
        } catch (error) {
          console.log(error);
          errorReturned(JSON.stringify(error));
        }
        setCalcPriceLoading(false);
      })();
    }
  };

  const getAnotherToken = tokenSymbol => {
    for (let i = 0; i < tradeTokens.length; i++) {
      if (tokenSymbol !== tradeTokens[i].symbol) {
        return tradeTokens[i];
      }
    }
  };

  const handleChange = event => {
    const {name, value} = event.target;
    const anotherToken = getAnotherToken(value.symbol);
    switch (name) {
      case "sellToken":
        setPrice("-");
        setSellToken(value);
        if (buyToken.symbol === value.symbol) {
          setBuyToken(anotherToken);
          fetchTradePrice("swapExactIn", value, anotherToken);
        } else {
          fetchTradePrice("swapExactIn", value, buyToken);
        }
        break;
      case "buyToken":
        setPrice("-");
        setBuyToken(value);
        if (sellToken.symbol === value.symbol) {
          setSellToken(anotherToken);
          fetchTradePrice("swapExactOut", anotherToken, value);
        } else {
          fetchTradePrice("swapExactOut", sellToken, value);
        }
        break;
      default:
    }
    setSellAmount("");
    setBuyAmount("");
  };

  const amountChange = async event => {
    const {name, value} = event.target;
    let amount;
    switch (name) {
      case "sellToken":
        setSellAmount(value);
        amount = parseFloat(value) || "";
        setTradeType("swapExactIn");
        fetchTradePrice("swapExactIn", sellToken, buyToken, amount, buyAmount => {
          setBuyAmount(formatUnits(
            buyAmount,
             buyToken.decimals
          ) || ""); 
        });
        break;
      case "buyToken":
        setBuyAmount(value);
        amount = parseFloat(value) || "";
        setTradeType("swapExactOut");
        fetchTradePrice("swapExactOut", sellToken, buyToken, amount, sellAmount => {
          setSellAmount(formatUnits(
            sellAmount,
            sellToken.decimals
          ) || "")
        });
        break;
      case "slippage":
        setSlippageTolerance(value);
      default:
    }
  };

  const max = () => {
    const amount = parseFloat(tradableAmount[sellToken.symbol]) || "";
    setSellAmount(amount);
    setBuyAmount(amount * price || "");
  };

  const confirm = async () => {
    if (!Array.isArray(swaps) || swaps.length === 0) return;
    setTxLoading(true);
    if(tradeType==="swapExactOut"){
      const maxTotalAmountIn = parseUnits(
        bnum(sellAmount)
          .div(bnum(1).minus(bnum(slippageTolerance).div(bnum(100))))
          .toFixed(buyToken.decimals, 1), //buyAmount / (1 + slippageTolerance / 100)
        buyToken.decimals
      );

      try {
        const tx = await trade(tradeType, swaps, sellToken.address, buyToken.address, maxTotalAmountIn);
        showHash(tx.hash);
        //await tx.wait();
      } catch (error) {
        console.log(error);
        errorReturned(JSON.stringify(error));
      }
    }else{
      const minAmountOut = parseUnits(
        bnum(buyAmount)
          .div(bnum(1).plus(bnum(slippageTolerance).div(bnum(100))))
          .toFixed(buyToken.decimals, 1), //buyAmount / (1 + slippageTolerance / 100)
        buyToken.decimals
      );
      const tokenAmountIn = parseUnits(sellAmount + "", sellToken.decimals);
      
      try {
        const tx = await trade(tradeType, swaps, sellToken.address, buyToken.address, tokenAmountIn, minAmountOut);
        showHash(tx.hash);
        //await tx.wait();
      } catch (error) {
        console.log(error);
        errorReturned(JSON.stringify(error));
      }
    }
    
    setTxLoading(false);
  };

  return (
    <div>
      <div>
        <Typography gutterBottom align="right">
          <span style={{float: "left"}}>
            <FormattedMessage id="POPUP_LABEL_FROM" />
          </span>
          <span className={classes.textPrimy}>
            <img className={classes.icon} src={"/" + sellToken.name + ".png"} alt="" />
            <FormattedMessage id="POPUP_TRADEABLE_AMOUNT" />
            {": "}
            <NumberFormat
              value={tradableAmount[sellToken.symbol]}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              suffix={sellToken.name}
              decimalScale={4}
              fixedDecimalScale={true}
            />
          </span>
        </Typography>
        <div className={classes.formContent}>
          <FormControl variant="outlined" style={{flex: "4"}}>
            <OutlinedInput
              error={false}
              className={classes.customInput}
              id="outlined-adornment-password"
              type={"text"}
              name={"sellToken"}
              value={sellAmount}
              onChange={amountChange}
              endAdornment={
                <InputAdornment position="end">
                  <Button className={classes.maxBtn} disabled={loading || txLoading || calcPriceLoading} onClick={max}>
                    <FormattedMessage id="POPUP_INPUT_MAX" />
                  </Button>
                </InputAdornment>
              }
            />
            {sellAmount > tradableAmount[sellToken.symbol] ? (
              <span style={{color: "red"}}>
                <FormattedMessage id="TRADE_ERROR_BALANCE" />
              </span>
            ) : (
              <></>
            )}
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl} style={{flex: "1"}}>
            <Select
              className={classes.select}
              value={sellToken}
              onChange={handleChange}
              inputProps={{
                name: "sellToken",
                id: "outlined-token"
              }}
            >
              {tradeTokens.map((v, i) => (
                <MenuItem value={v} key={i}>
                  <img className={classes.icon} src={"/" + v.name + ".png"} alt="" />
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{textAlign: "center", marginBottom: "16px"}}>
          <img
            className={classes.icon}
            onClick={() => {
              const tempToken = sellToken;
              setSellToken(buyToken);
              setBuyToken(tempToken);
              fetchTradePrice("swapExactIn", buyToken, sellToken);
            }}
            style={{
              width: "20px"
            }}
            src={"/down2.svg"}
            alt=""
          />
        </div>
        <Typography gutterBottom align="right">
          <span style={{float: "left"}}>
            <FormattedMessage id="POPUP_LABEL_TO" />
          </span>{" "}
          <span className={classes.textPrimy}>
            <img className={classes.icon} src={"/" + buyToken.name + ".png"} alt="" />
            <FormattedMessage id="POPUP_TRADEABLE_AMOUNT" />
            {": "}
            <NumberFormat
              value={tradableAmount[buyToken.symbol]}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              suffix={buyToken.name}
              decimalScale={4}
              fixedDecimalScale={true}
            />
          </span>
        </Typography>
        <div className={classes.formContent}>
          <FormControl variant="outlined" style={{flex: "4"}}>
            <OutlinedInput
              className={classes.customInput}
              id="outlined-adornment-password"
              type={"text"}
              name="buyToken"
              value={buyAmount}
              onChange={amountChange}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl} style={{flex: "1"}}>
            <Select
              className={classes.select}
              value={buyToken}
              onChange={handleChange}
              inputProps={{
                name: "buyToken",
                id: "outlined-token"
              }}
            >
              {tradeTokens.map((v, i) => (
                <MenuItem value={v} key={i}>
                  <img className={classes.icon} src={"/" + v.name + ".png"} alt="" />
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <span style={{color: "red"}}>
            {!loading && !txLoading && !calcPriceLoading && sellAmount && !buyAmount ? (
              <FormattedMessage id="EXCHANGEABLE_AMOUNT_NOT_ENOUGH" />
            ) : (
              <></>
            )}
          </span>
        </div>
        <div>
          <span className={classes.text}>
            <FormattedMessage id="UNIT_PRICE" />
          </span>
          <span className={classes.rightText}>
            <FormattedMessage
              id="POPUP_LABEL_SWAP_RATE"
              values={{
                tokenFrom: sellToken.name,
                tokenTo: buyToken.name,
                rate: price
              }}
            />
          </span>
        </div>
        <div>
          <span className={classes.text}>
            <FormattedMessage id="MIN_RECEIVED" />
          </span>
          <span className={classes.rightText}>
            <NumberFormat
              value={buyAmount / (1 + slippageTolerance / 100)}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              suffix={buyToken.name}
              decimalScale={4}
              fixedDecimalScale={true}
            />
          </span>
        </div>
        <div>
          <span className={classes.text}>
            <FormattedMessage id="SLIPPAGE_TOLERANCE" />
          </span>
          <span className={classes.rightText}>
            <Input
              id="slippage-tolerance"
              name="slippage"
              classes={{input: classes.textAlignRight}}
              value={slippageTolerance}
              onChange={amountChange}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
          </span>
        </div>
      </div>
      <div>
        <Button
          autoFocus
          disabled={loading || txLoading || calcPriceLoading}
          onClick={confirm}
          className={classes.button}
          fullWidth={true}
        >
          {loading || txLoading || calcPriceLoading ? (
            <CircularProgress></CircularProgress>
          ) : (
            <FormattedMessage id="POPUP_ACTION_CONFIRM" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default withStyles(styles)(Transaction);
