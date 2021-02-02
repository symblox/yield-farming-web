import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { atom, useAtom } from "jotai";
import { parseUnits, formatUnits } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { Web3Context } from "../../../contexts/Web3Context";
import tokenBalanceAtom, {
  fetchTokenBalanceValues,
} from "../../../hooks/useTokenBalance";
import poolTokenBalanceAtom, {
  fetchPoolTokenBalance,
} from "../../../hooks/usePoolTokenBalance";
import useSingleDeposit from "../../../hooks/payables/useSingleDeposit";
import useCalcSingleOutGivenPoolIn from "../../../hooks/useCalcSingleOutGivenPoolIn";
import styles from "../../../styles/deposit";
import config from "../../../config";
import { bnum } from "../../../utils/bignumber";

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

function getUrlParams() {
  const url = window.location.search;
  let theRequest = new Object();
  if (url.indexOf("?") !== -1) {
    let str = url.substr(1);
    let strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
    }
  }
  return theRequest;
}

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

const SingleDepositModal = (props) => {
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
  const maxTokenDepositAmountAtom = atom((get) => {
    const pool = get(poolAtom);
    const poolTokenBalances = get(poolTokenBalanceAtom);
    const tokenBalances = get(tokenBalanceAtom);
    let maxTokenDepositAmount = {};
    for (let key in tokenBalances) {
      let tokenBalance = bnum(tokenBalances[key]);
      const poolTokenBalance = bnum(poolTokenBalances[key]);
      if (key === "VLX") {
        const minReservedAmount = bnum(config.minReservedAmount);
        tokenBalance = tokenBalance.gt(minReservedAmount)
          ? tokenBalance.minus(minReservedAmount)
          : 0;
      }
      const tokenMaxIn = poolTokenBalance.times(bnum(pool.maxIn));
      let maxAmount;
      if (tokenMaxIn.gt(tokenBalance)) {
        maxAmount = tokenBalance;
      } else {
        maxAmount = tokenMaxIn;
      }

      maxTokenDepositAmount[key] = maxAmount;
    }

    return maxTokenDepositAmount;
  });

  const singleDeposit = useSingleDeposit();
  const calcSingleOutGivenPoolIn = useCalcSingleOutGivenPoolIn();
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState({});
  const [referral, setReferral] = useState("");
  const [stakedAmount, setStakedAmount] = useState("-");
  const [stakedList, setStakedList] = useState({});
  const [txLoading, setTxLoading] = useState(false);
  const [loading] = useAtom(loadingAtom);
  const [tokenBalances, setTokenBalances] = useAtom(tokenBalanceAtom);
  const [poolTokenBalance, setPoolTokenBalance] = useAtom(poolTokenBalanceAtom);
  const [maxTokenDepositAmount] = useAtom(maxTokenDepositAmountAtom);
  useEffect(() => {
    setReferral(getUrlParams()["referral"]);
    if (pool.supportTokens && pool.supportTokens.length > 0)
      setSelected(pool.supportTokens[0]);
    if (!ethersProvider || !pool) return;
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

    fetchStakedAmount();
  }, [ethersProvider, pool]);

  const fetchStakedAmount = async () => {
    let staked = {};
    const promises = pool.supportTokens.map(async (v) => {
      let amount = await calcSingleOutGivenPoolIn(
        pool,
        v.address,
        parseUnits(pool.stakeAmount, pool.decimals)
      );
      amount = formatUnits(amount, v.decimals);
      staked[v.symbol] = amount;
    });
    await Promise.all(promises);
    setStakedList(staked);
    setStakedAmount(staked[pool.supportTokens[0].symbol]);
  };

  const referralChange = (event) => {
    setReferral(event.target.value);
  };

  const amountChange = (event) => {
    const { value } = event.target;
    setAmount(value);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setAmount("");
    setSelected(value);
    setStakedAmount(stakedList[value.symbol]);
  };

  const max = (token) => {
    amountChange({
      target: {
        value: maxTokenDepositAmount[token.symbol],
      },
    });
  };

  const closeAndInitModal = () => {
    setPoolTokenBalance({});
    setTokenBalances({});
    closeModal();
  };

  const confirm = async () => {
    const tokenAmountIn = parseUnits(
      bnum(amount).toFixed(selected.decimals, 1),
      selected.decimals
    );
    let params = [];
    if (selected.symbol === "VLX") {
      params.push("0");
    } else {
      params.push(selected.address);
      params.push(tokenAmountIn);
      params.push("0");
    }
    if (pool.referral) {
      params.push(referral || AddressZero);
    }

    setTxLoading(true);
    try {
      const tx = await singleDeposit(pool, params, tokenAmountIn);
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
        <FormattedMessage id="POPUP_TITLE_DEPOSIT" />
      </DialogTitle>
      <MuiDialogContent>
        {pool.referral ? (
          <>
            <Typography gutterBottom style={{ overflow: "scroll" }}>
              <span style={{ color: "#ACAEBC" }}>
                <FormattedMessage id="REFERRER" />
                {": "}
              </span>
            </Typography>
            <div className={classes.formContent}>
              <FormControl variant="outlined" style={{ flex: "1" }}>
                <OutlinedInput
                  className={classes.customInput}
                  id="outlined-adornment-password"
                  type={"text"}
                  value={referral}
                  onChange={referralChange}
                />
              </FormControl>
            </div>
          </>
        ) : (
          <></>
        )}
        <div style={{ overflow: "scroll" }}>
          <span style={{ color: "#ACAEBC" }}>
            <FormattedMessage id="TOTAL_STAKE" />
            {": "}
          </span>
          <span className={classes.rightText}>
            <NumberFormat
              value={stakedAmount}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              decimalScale={4}
              fixedDecimalScale={true}
              suffix={selected.name}
            />
          </span>
        </div>
        <Typography gutterBottom style={{ overflow: "scroll" }}>
          <span style={{ color: "#ACAEBC" }}>
            <FormattedMessage id="POPUP_DEPOSITABLE_AMOUNT" />
            {": "}
          </span>
          <span className={classes.rightText}>
            <span>
              <NumberFormat
                value={
                  maxTokenDepositAmount[selected.symbol] ||
                  maxTokenDepositAmount[selected.symbol] === 0
                    ? maxTokenDepositAmount[selected.symbol].toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 10,
                        }
                      )
                    : "-"
                }
                defaultValue={"-"}
                displayType={"text"}
                thousandSeparator={true}
                isNumericString={true}
                suffix={selected.name}
                decimalScale={4}
                fixedDecimalScale={true}
                renderText={(value) => <span>{value}</span>}
              />
            </span>
          </span>
        </Typography>
        <div className={classes.formContent}>
          <FormControl variant="outlined" style={{ flex: "4" }}>
            <OutlinedInput
              className={classes.customInput}
              error={
                parseFloat(amount || 0) >
                parseFloat(maxTokenDepositAmount[selected.symbol] || 0)
              }
              id="outlined-adornment-password"
              type={"text"}
              value={amount || ""}
              onChange={amountChange}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    className={classes.maxBtn}
                    disabled={loading || txLoading}
                    onClick={max.bind(this, selected)}
                  >
                    <FormattedMessage id="POPUP_INPUT_MAX" />
                  </Button>
                </InputAdornment>
              }
            />
            {parseFloat(amount || 0) >
            parseFloat(maxTokenDepositAmount[selected.symbol] || 0) ? (
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
              value={selected}
              onChange={handleChange}
              inputProps={{
                name: "token",
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
        <Typography gutterBottom>
          <span className={classes.text}>
            <FormattedMessage id="POPUP_WITHDRAW_REWARD" />
          </span>
          <NumberFormat
            value={pool.rewardsAvailable}
            defaultValue={"-"}
            displayType={"text"}
            thousandSeparator={true}
            isNumericString={true}
            suffix={pool.rewardToken.name}
            decimalScale={4}
            fixedDecimalScale={true}
            renderText={(value) => (
              <span className={classes.rightText}>{value}</span>
            )}
          />
        </Typography>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button
          autoFocus
          disabled={loading || txLoading}
          onClick={confirm}
          className={classes.button}
          fullWidth={true}
        >
          {loading || txLoading ? (
            <CircularProgress></CircularProgress>
          ) : (
            <FormattedMessage id="LP_DEPOSIT_WITHDRAW_REWARD" />
          )}
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(SingleDepositModal);
