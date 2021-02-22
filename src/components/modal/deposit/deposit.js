import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { atom, useAtom } from "jotai";
import { parseUnits, formatUnits } from "@ethersproject/units";
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
import tokenBalanceAtom, {
  fetchTokenBalanceValues,
} from "../../../hooks/useTokenBalance";
import useDeposit from "../../../hooks/payables/useDeposit";
import styles from "../../../styles/deposit";
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

const loadingAtom = atom((get) => {
  const tokenBalances = get(tokenBalanceAtom);
  let loading = false;
  if (Object.keys(tokenBalances).length === 0) loading = true;
  return loading;
});

const DepositModal = (props) => {
  const {
    data: pool,
    classes,
    closeModal,
    modalOpen,
    showHash,
    errorReturned,
    loadData,
  } = props;
  const fullScreen = window.innerWidth < 450;
  const deposit = useDeposit();
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [amount, setAmount] = useState("");
  const [txLoading, setTxLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useAtom(tokenBalanceAtom);
  const [loading] = useAtom(loadingAtom);
  console.log({ loadData });
  useEffect(() => {
    if (!ethersProvider || !pool) return;
    fetchTokenBalanceValues(
      account,
      ethersProvider,
      providerNetwork,
      pool.supportTokens,
      setTokenBalances
    );
  }, [ethersProvider, pool]);

  const amountChange = (event) => {
    const { value } = event.target;
    setAmount(value);
  };

  const max = () => {
    amountChange({
      target: {
        value: tokenBalances[pool.symbol],
      },
    });
  };

  const closeAndInitModal = () => {
    setTokenBalances({});
    closeModal();
  };

  const confirm = async () => {
    const tokenAmountIn = parseUnits(
      bnum(amount).toFixed(pool.decimals, 1),
      pool.decimals
    );
    setTxLoading(true);
    try {
      const tx = await deposit(pool, tokenAmountIn);
      showHash(tx.hash);
      setTxLoading(false);
      closeAndInitModal();
      await tx.wait();
      loadData();
    } catch (error) {
      console.log(error);
      errorReturned(JSON.stringify(error));
      setTxLoading(false);
      closeAndInitModal();
    }
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
        <div style={{ overflow: "scroll" }}>
          <span style={{ color: "#ACAEBC" }}>
            <FormattedMessage id="TOTAL_STAKE" />
            {": "}
          </span>
          <span className={classes.rightText}>
            <NumberFormat
              value={pool.stakeAmount}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              decimalScale={4}
              fixedDecimalScale={true}
              suffix={pool.symbol}
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
                value={tokenBalances[pool.symbol]}
                defaultValue={"-"}
                displayType={"text"}
                thousandSeparator={true}
                isNumericString={true}
                suffix={pool.symbol}
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
                parseFloat(tokenBalances[pool.symbol] || 0)
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
                    onClick={max}
                  >
                    <FormattedMessage id="POPUP_INPUT_MAX" />
                  </Button>
                </InputAdornment>
              }
            />
            {parseFloat(amount || 0) >
            parseFloat(tokenBalances[pool.symbol] || 0) ? (
              <span style={{ color: "red" }}>
                <FormattedMessage id="TRADE_ERROR_BALANCE" />
              </span>
            ) : (
              <></>
            )}
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

export default withStyles(styles)(DepositModal);
