import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { atom, useAtom } from "jotai";
import { parseUnits, parseEther } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
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
import poolTokenBalanceAtom, {
  fetchPoolTokenBalance,
} from "../../../hooks/usePoolTokenBalance";
import useMultiDeposit from "../../../hooks/payables/useMultiDeposit";
import { bnum } from "../../../utils/bignumber";
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

const loadingAtom = atom((get) => {
  const availableAmounts = get(availableAmountAtom);
  const poolTokenBalance = get(poolTokenBalanceAtom);
  const tokenBalances = get(tokenBalanceAtom);
  let loading = false;
  if (
    !Array.isArray(availableAmounts) ||
    Object.keys(poolTokenBalance).length === 0 ||
    Object.keys(tokenBalances).length === 0
  )
    loading = true;
  return loading;
});

const MultiDepositModal = (props) => {
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
    let maxTokenDepositAmount = {},
      minRatio = bnum("Infinity");
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
      const ratio = maxAmount.div(poolTokenBalance);

      if (minRatio.isNaN() || ratio.lt(minRatio)) {
        minRatio = ratio;
      }

      maxTokenDepositAmount[key] = poolTokenBalance;
    }
    for (let key in maxTokenDepositAmount) {
      maxTokenDepositAmount[key] = maxTokenDepositAmount[key].times(minRatio);
      if (maxTokenDepositAmount[key].isNaN()) {
        maxTokenDepositAmount[key] = "-";
      }
    }

    return maxTokenDepositAmount;
  });
  const multiDeposit = useMultiDeposit();
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [amounts, setAmounts] = useState({});
  const [referral, setReferral] = useState("");
  const [txLoading, setTxLoading] = useState(false);
  const [loading] = useAtom(loadingAtom);
  const [availableAmounts, setAvailableAmounts] = useAtom(availableAmountAtom);
  const [tokenBalances, setTokenBalances] = useAtom(tokenBalanceAtom);
  const [poolTokenBalance, setPoolTokenBalance] = useAtom(poolTokenBalanceAtom);
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

    fetchPoolTokenBalance(
      ethersProvider,
      providerNetwork,
      pool,
      setPoolTokenBalance
    );
  }, [ethersProvider, pool]);

  const referralChange = (event) => {
    setReferral(event.target.value);
  };

  const amountChange = (event) => {
    const { name, value } = event.target;
    const ratio = bnum(value).div(
      bnum(maxTokenDepositAmount[pool.supportTokens[parseInt(name)].symbol])
    );

    let amounts = [];
    pool.supportTokens.forEach((token, i) => {
      if (name === i + "") {
        amounts.push(value);
      } else {
        const amount = ratio.times(bnum(maxTokenDepositAmount[token.symbol]));
        amounts.push(amount.toFixed(token.decimals, 0));
      }
    });
    setAmounts(amounts);
  };

  const max = (token, key) => {
    amountChange({
      target: {
        name: key,
        value: maxTokenDepositAmount[token.symbol],
      },
    });
  };

  const closeAndInitModal = () => {
    setAvailableAmounts([]);
    setPoolTokenBalance({});
    setTokenBalances({});
    closeModal();
  };

  const confirm = async () => {
    // @TODO - fix calcs so no buffer is needed
    const buffer = bnum("0.995"); //0.5%
    //All token ratios are the same, so just use the first one
    const ratio = bnum(amounts[0]).div(
      bnum(poolTokenBalance[pool.supportTokens[0].symbol])
    );
    const poolAmountOut = parseEther(
      bnum(pool.totalSupply)
        .times(ratio)
        .times(buffer)
        .toFixed(pool.decimals, 1)
    );

    const tokensIn = pool.supportTokens.map((v) => {
      if (v.symbol === "VLX") {
        return AddressZero;
      } else {
        return v.address;
      }
    });

    const maxAmountsIn = amounts.map((v, i) => {
      return parseUnits(
        bnum(v).toFixed(pool.supportTokens[i].decimals, 1),
        pool.supportTokens[i].decimals
      );
    });

    const params = [
      poolAmountOut,
      tokensIn,
      maxAmountsIn,
      referral || AddressZero,
    ];

    setTxLoading(true);
    try {
      const tx = await multiDeposit(pool, params);
      showHash(tx.hash);
      //await tx.wait();
    } catch (error) {
      console.log(error);
      errorReturned(JSON.stringify(error));
    }
    setTxLoading(false);
    closeAndInitModal();
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
                  disabled={loading || txLoading}
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
            {Array.isArray(availableAmounts) && availableAmounts.length > 0 ? (
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
                    value={
                      maxTokenDepositAmount[v.symbol]
                        ? maxTokenDepositAmount[v.symbol].toLocaleString(
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

export default withStyles(styles)(MultiDepositModal);
