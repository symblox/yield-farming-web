import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { atom, useAtom } from "jotai";
import { parseUnits, parseEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
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
import poolTokenBalanceAtom, {
  fetchPoolTokenBalance,
} from "../../../hooks/usePoolTokenBalance";
import useMultiWithdraw from "../../../hooks/payables/useMultiWithdraw";

import styles from "../../../styles/withdraw";
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

const loadingAtom = atom((get) => {
  const availableAmounts = get(availableAmountAtom);
  const poolTokenBalance = get(poolTokenBalanceAtom);
  let loading = false;
  if (
    !Array.isArray(availableAmounts) ||
    Object.keys(poolTokenBalance).length === 0
  )
    loading = true;
  return loading;
});

const MultiWithdrawModal = (props) => {
  const { data: pool, classes, closeModal, modalOpen } = props;
  const fullScreen = window.innerWidth < 450;
  const poolAtom = atom(pool);
  const maxTokenWithdrawAmountAtom = atom((get) => {
    const pool = get(poolAtom);
    const poolTokenBalance = get(poolTokenBalanceAtom);
    const availableAmounts = get(availableAmountAtom);
    let maxTokenWithdrawAmount = {},
      minRatio = -1;
    for (let i = 0; i < availableAmounts.length; i++) {
      const key = availableAmounts[i].name;
      const tokenMaxOut = poolTokenBalance[key] * pool.maxOut;
      let maxAmount;
      if (tokenMaxOut > availableAmounts[i].amount) {
        maxAmount = availableAmounts[i].amount;
      } else {
        maxAmount = tokenMaxOut;
      }

      const ratio = maxAmount / poolTokenBalance[key];
      if (minRatio != -1) {
        if (ratio < minRatio) {
          minRatio = ratio;
        }
      } else {
        minRatio = ratio;
      }
      maxTokenWithdrawAmount[key] = poolTokenBalance[key];
    }

    for (let key in maxTokenWithdrawAmount) {
      maxTokenWithdrawAmount[key] = maxTokenWithdrawAmount[key] * minRatio;
    }

    return maxTokenWithdrawAmount;
  });
  const multiWithdraw = useMultiWithdraw();
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [amounts, setAmounts] = useState({});
  const [txLoading, setTxLoading] = useState(false);
  const [loading] = useAtom(loadingAtom);
  const [availableAmounts, setAvailableAmounts] = useAtom(availableAmountAtom);
  const [poolTokenBalance, setPoolMaxTokenAmountIn] = useAtom(
    poolTokenBalanceAtom
  );
  const [maxTokenWithdrawAmount] = useAtom(maxTokenWithdrawAmountAtom);

  useEffect(() => {
    if (!ethersProvider || !pool) return;
    fetchAvailableValues(
      ethersProvider,
      providerNetwork,
      pool,
      setAvailableAmounts
    );

    fetchPoolTokenBalance(
      ethersProvider,
      providerNetwork,
      pool,
      setPoolMaxTokenAmountIn
    );
  }, [ethersProvider, pool]);

  const amountChange = (event) => {
    const { name, value } = event.target;
    const ratio =
      parseFloat(value) /
      parseFloat(
        maxTokenWithdrawAmount[pool.supportTokens[parseInt(name)].symbol]
      );

    let amounts = [];
    pool.supportTokens.forEach((token, i) => {
      if (name === i + "") {
        amounts.push(parseFloat(value).toFixed(8));
      } else {
        amounts.push(
          Number.isNaN(ratio)
            ? ""
            : (
                ratio * parseFloat(maxTokenWithdrawAmount[token.symbol])
              ).toFixed(8)
        );
      }
    });
    setAmounts(amounts);
  };

  const max = (token, key) => {
    amountChange({
      target: {
        name: key,
        value: (maxTokenWithdrawAmount[token.symbol] || 0) + "",
      },
    });
  };

  const confirm = async () => {
    // @TODO - fix calcs so no buffer is needed
    const buffer = BigNumber.from("1000000");
    //All token ratios are the same, so just use the first one
    const ratio =
      parseFloat(amounts[0]) /
      parseFloat(poolTokenBalance[pool.supportTokens[0].symbol]);
    const poolAmountIn = parseEther(
      parseFloat(pool.totalSupply) * parseFloat(ratio) + ""
    ).sub(buffer);
    const tokensOut = pool.supportTokens.map((v) => v.address);
    const minAmountsOut = amounts.map((v, i) => "0");
    const params = [poolAmountIn, tokensOut, minAmountsOut || ""];
    setTxLoading(true);
    try {
      const tx = await multiWithdraw(pool, params);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
    setTxLoading(false);
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
              parseFloat(maxTokenWithdrawAmount[v.symbol] || 0)
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
          parseFloat(maxTokenWithdrawAmount[v.symbol] || 0) ? (
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
        <FormattedMessage id="POPUP_TITLE_WITHDRAW" />
      </DialogTitle>
      <MuiDialogContent>
        <Typography gutterBottom style={{ overflow: "scroll" }}>
          <span style={{ color: "#ACAEBC" }}>
            <FormattedMessage id="POPUP_WITHDRAWABLE_AMOUNT" />
            {": "}
          </span>
          <span className={classes.rightText}>
            {pool.supportTokens.map((v, i) => {
              return (
                <span key={i}>
                  <NumberFormat
                    value={
                      maxTokenWithdrawAmount[v.symbol]
                        ? maxTokenWithdrawAmount[v.symbol].toLocaleString(
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
            <FormattedMessage id="LP_WITHDRAW" />
          )}
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(MultiWithdrawModal);
