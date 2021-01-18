import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { atom, useAtom } from "jotai";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
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
import availableAmountAtom, {
  fetchAvailableValues,
} from "../../../hooks/useAvailableAmount";
import tokenBalanceAtom, {
  fetchTokenBalanceValues,
} from "../../../hooks/useTokenBalance";
import poolMaxTokenAmountInAtom, {
  fetchPoolMaxTokenAmountInValues,
} from "../../../hooks/usePoolMaxTokenAmountIn";

import styles from "../../../styles/deposit";
import config from "../../../config";

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

const maxTokenDepositAmountAtom = atom((get) => {
  const poolMaxTokenAmountIn = get(poolMaxTokenAmountInAtom);
  const tokenBalances = get(tokenBalanceAtom);
  let maxTokenDepositAmount = {};
  for (let key in tokenBalances) {
    if (key === "VLX") {
      tokenBalances[key] =
        tokenBalances[key] > config.minReservedAmount
          ? tokenBalances[key] - config.minReservedAmount
          : 0;
    }

    if (poolMaxTokenAmountIn[key] > tokenBalances[key]) {
      maxTokenDepositAmount[key] = tokenBalances[key];
    } else {
      maxTokenDepositAmount[key] = poolMaxTokenAmountIn[key];
    }
  }
  return maxTokenDepositAmount;
});

const loadingAtom = atom((get) => {
  const availableAmounts = get(availableAmountAtom);
  const poolMaxTokenAmountIn = get(poolMaxTokenAmountInAtom);
  const tokenBalances = get(tokenBalanceAtom);
  let loading = false;
  if (
    !Array.isArray(availableAmounts) ||
    Object.keys(poolMaxTokenAmountIn).length === 0 ||
    Object.keys(tokenBalances).length === 0
  )
    loading = true;
  return loading;
});

const MultiDepositModal = (props) => {
  const { data: pool, classes, closeModal, modalOpen } = props;
  const fullScreen = window.innerWidth < 450;
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [amounts, setAmounts] = useState({});
  const [referral, setReferral] = useState("");
  const [loading] = useAtom(loadingAtom);
  const [availableAmounts, setAvailableAmounts] = useAtom(availableAmountAtom);
  const [tokenBalances, setTokenBalances] = useAtom(tokenBalanceAtom);
  const [poolMaxTokenAmountIn, setPoolMaxTokenAmountIn] = useAtom(
    poolMaxTokenAmountInAtom
  );
  const [maxTokenDepositAmount] = useAtom(maxTokenDepositAmountAtom);

  useEffect(() => {
    setReferral(getUrlParams()["referral"]);
    if (!ethersProvider || !pool) return;
    fetchAvailableValues(
      ethersProvider,
      providerNetwork,
      pool,
      setAvailableAmounts
    );

    fetchTokenBalanceValues(
      account,
      ethersProvider,
      providerNetwork,
      pool.supportTokens,
      setTokenBalances
    );

    fetchPoolMaxTokenAmountInValues(
      ethersProvider,
      providerNetwork,
      pool,
      setPoolMaxTokenAmountIn
    );
  }, [ethersProvider, pool]);

  const referralChange = (event) => {
    setReferral(event.target.value);
  };

  const amountChange = (event) => {
    const { name, value } = event.target;
    const ratio =
      parseFloat(value) /
      parseFloat(
        maxTokenDepositAmount[pool.supportTokens[parseInt(name)].symbol]
      );

    let amounts = {};
    pool.supportTokens.forEach((token, i) => {
      if (name === i + "") {
        amounts[i + ""] = value;
      } else {
        amounts[i + ""] = Number.isNaN(ratio)
          ? ""
          : ratio * parseFloat(maxTokenDepositAmount[token.symbol]);
      }
    });
    setAmounts(amounts);
  };

  const max = (token, key) => {
    amountChange({
      target: {
        name: key,
        value: (maxTokenDepositAmount[token.symbol] || 0) + "",
      },
    });
  };

  const confirm = () => {
    // if (parseFloat(amount) === 0 || isNaN(parseFloat(amount))) return;
    // setLoading(true);
    // dispatcher.dispatch({
    //   type: DEPOSIT,
    //   content: {
    //     asset: pool,
    //     amount: parseFloat(amount).toString(),
    //     referral: referral,
    //     token:
    //       token === pool.supportTokens[0]
    //         ? pool.erc20Address2
    //         : pool.erc20Address,
    //   },
    // });
  };

  const inputHtmls = pool.supportTokens.map((v, i) => {
    return (
      <div className={classes.formContent} key={i}>
        <FormControl variant="outlined" style={{ flex: "4" }}>
          <OutlinedInput
            className={classes.customInput}
            name={i + ""}
            error={
              parseFloat(amounts[i] || 0) >
              parseFloat(maxTokenDepositAmount[v.symbol] || 0)
            }
            id="outlined-adornment-password"
            type={"text"}
            value={amounts[i] || ""}
            onChange={amountChange}
            endAdornment={
              <InputAdornment position="end">
                <Button
                  className={classes.maxBtn}
                  disabled={loading}
                  onClick={max.bind(this, v, i + "")}
                >
                  <FormattedMessage id="POPUP_INPUT_MAX" />
                </Button>
              </InputAdornment>
            }
          />
          {parseFloat(amounts[i] || 0) >
          parseFloat(maxTokenDepositAmount[v.symbol] || 0) ? (
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
          <div className={classes.tokenBtn}>
            <img className={classes.icon} src={"/" + v.name + ".png"} alt="" />
            {v.name}
          </div>
        </FormControl>
      </div>
    );
  });

  return (
    <Dialog
      onClose={closeModal}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
      fullWidth={true}
      fullScreen={fullScreen}
    >
      <DialogTitle id="customized-dialog-title" onClose={closeModal}>
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
            {Array.isArray(availableAmounts) ? (
              availableAmounts.map((v, i) => (
                <span key={i}>
                  <NumberFormat
                    value={v.amount}
                    defaultValue={"-"}
                    displayType={"text"}
                    thousandSeparator={true}
                    isNumericString={true}
                    decimalScale={4}
                    fixedDecimalScale={true}
                  />{" "}
                  {v.name}
                  {i === availableAmounts.length - 1 ? "" : " / "}
                </span>
              ))
            ) : (
              <>- / -</>
            )}
          </span>
        </div>
        <Typography gutterBottom style={{ overflow: "scroll" }}>
          <span style={{ color: "#ACAEBC" }}>
            <FormattedMessage id="POPUP_DEPOSITABLE_AMOUNT" />
            {": "}
          </span>
          <span className={classes.rightText}>
            {pool.supportTokens.map((v, i) => {
              return (
                <span key={i}>
                  <NumberFormat
                    value={maxTokenDepositAmount[v.symbol] || "-"}
                    defaultValue={"-"}
                    displayType={"text"}
                    thousandSeparator={true}
                    isNumericString={true}
                    suffix={v.name}
                    decimalScale={4}
                    fixedDecimalScale={true}
                    renderText={(value) => <span>{value}</span>}
                  />
                  {i === pool.supportTokens.length - 1 ? "" : " / "}
                </span>
              );
            })}
          </span>
        </Typography>
        {inputHtmls}
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
          disabled={loading}
          onClick={confirm}
          className={classes.button}
          fullWidth={true}
        >
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : (
            <FormattedMessage id="LP_DEPOSIT_WITHDRAW_REWARD" />
          )}
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(MultiDepositModal);
