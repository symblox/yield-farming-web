import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { parseUnits } from "@ethersproject/units";
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
import useWithdraw from "../../../hooks/payables/useWithdraw";
import { bnum } from "../../../utils/bignumber";
import styles from "../../../styles/withdraw";

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

const WithdrawModal = (props) => {
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
  const withdraw = useWithdraw();
  const [amount, setAmount] = useState("");
  const [txLoading, setTxLoading] = useState(false);

  const amountChange = (event) => {
    const { value } = event.target;
    setAmount(value);
  };

  const max = () => {
    amountChange({
      target: {
        value: pool.stakeAmount,
      },
    });
  };

  const confirm = async () => {
    setTxLoading(true);
    const tokenAmountOut = parseUnits(
      bnum(amount).toFixed(pool.decimals, 1),
      pool.decimals
    );
    try {
      const tx = await withdraw(pool, tokenAmountOut);
      showHash(tx.hash);
      setTxLoading(false);
      closeModal();
      await tx.wait();
      loadData();
    } catch (error) {
      console.log(error);
      errorReturned(JSON.stringify(error));
      setTxLoading(false);
      closeModal();
    }
  };

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
            <span>
              <NumberFormat
                value={pool.stakeAmount}
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
                parseFloat(amount || 0) > parseFloat(pool.stakeAmount || 0)
              }
              id="outlined-adornment-password"
              type={"text"}
              value={amount || ""}
              onChange={amountChange}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    className={classes.maxBtn}
                    disabled={txLoading}
                    onClick={max.bind(this)}
                  >
                    <FormattedMessage id="POPUP_INPUT_MAX" />
                  </Button>
                </InputAdornment>
              }
            />
            {parseFloat(amount || 0) > parseFloat(pool.stakeAmount || 0) ? (
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
          disabled={txLoading}
          onClick={confirm}
          className={classes.button}
          fullWidth={true}
        >
          {txLoading ? (
            <CircularProgress></CircularProgress>
          ) : (
            <FormattedMessage id="LP_WITHDRAW" />
          )}
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(WithdrawModal);
