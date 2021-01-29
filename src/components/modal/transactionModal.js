import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { atom, useAtom } from "jotai";
import { parseUnits, formatUnits } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { Web3Context } from "../../contexts/Web3Context";
import styles from "../../styles/transaction";
import tokenBalanceAtom, {
  fetchTokenBalanceValues,
} from "../../hooks/useTokenBalance";
import poolTokenBalanceAtom, {
  fetchPoolTokenBalance,
} from "../../hooks/usePoolTokenBalance";
import useCalcTradePrice from "../../hooks/useCalcTradePrice";
import useTrade from "../../hooks/payables/useTrade";
import config from "../../config";
import { debounce } from "../../utils/debounce.js";

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    // fontFamily: "Noto Sans SC",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: "18px",
    lineHeight: "25px",
    color: "#ACAEBC",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const loadingAtom = atom((get) => {
  const poolTokenBalance = get(poolTokenBalanceAtom);
  const tokenBalances = get(tokenBalanceAtom);
  let loading = false;
  if (
    Object.keys(poolTokenBalance).length === 0 ||
    Object.keys(tokenBalances).length === 0
  )
    loading = true;
  return loading;
});

const TransactionModal = (props) => {
  const {
    data: pool,
    classes,
    closeModal,
    modalOpen,
    showHash,
    errorReturned,
  } = props;
  const fullScreen = window.innerWidth < 450;
  const poolAtom = atom(pool);
  const tradableAmountAtom = atom((get) => {
    const pool = get(poolAtom);
    const poolTokenBalance = get(poolTokenBalanceAtom);
    const tokenBalances = get(tokenBalanceAtom);
    let tradableAmount = {};
    for (let key in tokenBalances) {
      if (key === "VLX") {
        tokenBalances[key] =
          tokenBalances[key] > config.minReservedAmount
            ? tokenBalances[key] - config.minReservedAmount
            : 0;
      }

      const tokenMaxIn = poolTokenBalance[key] * pool.maxIn;
      let maxAmount;
      if (tokenMaxIn > tokenBalances[key]) {
        maxAmount = tokenBalances[key];
      } else {
        maxAmount = tokenMaxIn;
      }

      tradableAmount[key] = maxAmount;
    }

    return tradableAmount;
  });
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const calcTradePrice = useCalcTradePrice();
  const trade = useTrade();
  const [txLoading, setTxLoading] = useState(false);
  const [sellToken, setSellToken] = useState({});
  const [buyToken, setBuyToken] = useState({});
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [price, setPrice] = useState("-");
  const [slippageTolerance, setSlippageTolerance] = useState(1); //%
  const [calcPriceLoading, setCalcPriceLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useAtom(tokenBalanceAtom);
  const [poolTokenBalance, setPoolTokenBalance] = useAtom(poolTokenBalanceAtom);
  const [tradableAmount] = useAtom(tradableAmountAtom);
  const [loading] = useAtom(loadingAtom);

  useEffect(() => {
    if (!ethersProvider || !pool || !account) return;
    if (pool.supportTokens.length >= 2) {
      setSellToken(pool.supportTokens[0]);
      setBuyToken(pool.supportTokens[1]);
      fetchTradePrice(pool.supportTokens[0], pool.supportTokens[1]);
    }
    fetchTokenBalanceValues(
      account,
      ethersProvider,
      providerNetwork,
      pool.supportTokens,
      setTokenBalances
    );

    fetchPoolTokenBalance(
      ethersProvider,
      providerNetwork,
      pool,
      setPoolTokenBalance
    );
  }, [ethersProvider, pool, account]);

  const fetchTradePrice = async (
    sellToken,
    buyToken,
    amount = 1,
    type = "sell",
    callback
  ) => {
    if (amount) {
      setCalcPriceLoading(true);
      debounce(1000, async () => {
        const price = await calcTradePrice(
          pool,
          sellToken.address,
          buyToken.address,
          parseUnits(amount + "", sellToken.decimals),
          type
        );
        setPrice(parseFloat(price).toFixed(6));
        if (typeof callback === "function") callback(price);
        setCalcPriceLoading(false);
      })();
    }
  };

  const getAnotherToken = (tokenSymbol) => {
    for (let i = 0; i < pool.supportTokens.length; i++) {
      if (tokenSymbol !== pool.supportTokens[i].symbol) {
        return pool.supportTokens[i];
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const anotherToken = getAnotherToken(value.symbol);
    switch (name) {
      case "sellToken":
        setSellToken(value);
        setBuyToken(anotherToken);
        setPrice("-");
        fetchTradePrice(value, anotherToken);
        break;
      case "buyToken":
        setBuyToken(value);
        setSellToken(anotherToken);
        setPrice("-");
        fetchTradePrice(anotherToken, value);
        break;
      default:
    }
    setSellAmount("");
    setBuyAmount("");
  };

  const amountChange = async (event) => {
    const { name, value } = event.target;
    let amount;
    switch (name) {
      case "sellToken":
        setSellAmount(value);
        amount = parseFloat(value) || "";
        fetchTradePrice(sellToken, buyToken, amount, "sell", (price) =>
          setBuyAmount(amount * parseFloat(price) || "")
        );
        break;
      case "buyToken":
        setBuyAmount(value);
        amount = parseFloat(value) || "";
        fetchTradePrice(sellToken, buyToken, amount, "buy", (price) =>
          setSellAmount((amount * 1) / parseFloat(price) || "")
        );
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

  const closeAndInitModal = () => {
    setPoolTokenBalance({});
    setTokenBalances({});
    setPrice("-");
    closeModal();
  };

  const confirm = async () => {
    const maxPrice = parseUnits(
      (1 / parseFloat(price)) * (1 + slippageTolerance / 100) + "",
      buyToken.decimals
    );
    const minAmountOut = parseUnits(
      buyAmount / (1 + slippageTolerance / 100) + "",
      sellToken.decimals
    );
    const tokenAmountIn = parseUnits(sellAmount + "", sellToken.decimals);

    setTxLoading(true);
    try {
      const tx = await trade(
        pool,
        sellToken.symbol === "VLX" ? AddressZero : sellToken.address,
        buyToken.symbol === "VLX" ? AddressZero : buyToken.address,
        minAmountOut,
        maxPrice,
        tokenAmountIn
      );
      showHash(tx.hash);
      //await tx.wait();
    } catch (error) {
      console.log(error);
      errorReturned(JSON.stringify(error));
    }
    setTxLoading(false);
    closeAndInitModal();
  };

  return (
    <Dialog
      onClose={closeAndInitModal}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
      fullWidth={true}
      fullScreen={fullScreen}
    >
      <DialogTitle id="customized-dialog-title" onClose={closeAndInitModal}>
        <FormattedMessage id="POPUP_TITLE_SWAP" />
      </DialogTitle>
      <DialogContent>
        <Typography gutterBottom align="right">
          <span style={{ float: "left" }}>
            <FormattedMessage id="POPUP_LABEL_FROM" />
          </span>
          <span className={classes.textPrimy}>
            <img
              className={classes.icon}
              src={"/" + sellToken.name + ".png"}
              alt=""
            />
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
          <FormControl variant="outlined" style={{ flex: "4" }}>
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
                  <Button
                    className={classes.maxBtn}
                    disabled={loading || txLoading || calcPriceLoading}
                    onClick={max}
                  >
                    <FormattedMessage id="POPUP_INPUT_MAX" />
                  </Button>
                </InputAdornment>
              }
            />
            {false ? (
              <span style={{ color: "red" }}>
                <FormattedMessage id="TRADE_ERROR_BALANCE" />
              </span>
            ) : (
              <></>
            )}
          </FormControl>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ flex: "1" }}
          >
            <Select
              className={classes.select}
              value={sellToken}
              onChange={handleChange}
              inputProps={{
                name: "sellToken",
                id: "outlined-token",
              }}
            >
              {pool.supportTokens.map((v, i) => (
                <MenuItem value={v} key={i}>
                  <img
                    className={classes.icon}
                    src={"/" + v.name + ".png"}
                    alt=""
                  />
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <img
            className={classes.icon}
            style={{
              width: "20px",
            }}
            src={"/down2.svg"}
            alt=""
          />
        </div>
        <Typography gutterBottom align="right">
          <span style={{ float: "left" }}>
            <FormattedMessage id="POPUP_LABEL_TO" />
          </span>{" "}
          <span className={classes.textPrimy}>
            <img
              className={classes.icon}
              src={"/" + buyToken.name + ".png"}
              alt=""
            />
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
          <FormControl variant="outlined" style={{ flex: "4" }}>
            <OutlinedInput
              className={classes.customInput}
              id="outlined-adornment-password"
              type={"text"}
              name="buyToken"
              value={buyAmount}
              onChange={amountChange}
            />
          </FormControl>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ flex: "1" }}
          >
            <Select
              className={classes.select}
              value={buyToken}
              onChange={handleChange}
              inputProps={{
                name: "buyToken",
                id: "outlined-token",
              }}
            >
              {pool.supportTokens.map((v, i) => (
                <MenuItem value={v} key={i}>
                  <img
                    className={classes.icon}
                    src={"/" + v.name + ".png"}
                    alt=""
                  />
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                rate: price,
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
              classes={{ input: classes.textAlignRight }}
              value={slippageTolerance}
              onChange={amountChange}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
          </span>
        </div>
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(TransactionModal);
