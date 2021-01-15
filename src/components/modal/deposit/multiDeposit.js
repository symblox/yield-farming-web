import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
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
import useAvailableAmount from "../../../hooks/useAvailableAmount";
import { formatNumberPrecision } from "../../../utils/numberFormat.js";
import styles from "../../../styles/deposit";
import Store from "../../../stores";
import { DEPOSIT } from "../../../constants";
import config from "../../../config";

const dispatcher = Store.dispatcher;
const emitter = Store.emitter;

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

const MultiDepositModal = (props) => {
  const { data: pool, classes, closeModal, modalOpen } = props;
  const fullScreen = window.innerWidth < 450;
  const [availableAmounts, setAvailableAmounts] = useAvailableAmount(pool);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("0");
  const [referral, setReferral] = useState("");

  useEffect(() => {
    setReferral(getUrlParams()["referral"]);
  }, [pool]);

  const amountChange = (event) => {
    setAmount(event.target.value);
  };

  const referralChange = (event) => {
    setReferral(event.target.value);
  };

  const getMaxAmount = (tokenName) => {
    let erc20Balance = parseFloat(pool.erc20Balance);
    let erc20Balance2 = parseFloat(pool.erc20Balance2);
    if (pool.type === "swap-native") {
      erc20Balance =
        erc20Balance > config.minReservedAmount
          ? erc20Balance - config.minReservedAmount
          : 0;
    }

    switch (pool.type) {
      case "swap":
      case "swap-native":
        if (token === pool.supportTokens[0]) {
          if (parseFloat(pool.maxSyxIn) > erc20Balance2) {
            return formatNumberPrecision(erc20Balance2);
          } else {
            return formatNumberPrecision(pool.maxSyxIn);
          }
        } else {
          if (parseFloat(pool.maxErc20In) > erc20Balance) {
            return formatNumberPrecision(erc20Balance);
          } else {
            return formatNumberPrecision(pool.maxErc20In);
          }
        }
      default:
        return 0;
    }
  };

  const max = (token) => {
    setAmount(getMaxAmount(token) + "");
  };

  const confirm = () => {
    if (parseFloat(amount) === 0 || isNaN(parseFloat(amount))) return;

    setLoading(true);

    dispatcher.dispatch({
      type: DEPOSIT,
      content: {
        asset: pool,
        amount: parseFloat(amount).toString(),
        referral: referral,
        token:
          token === pool.supportTokens[0]
            ? pool.erc20Address2
            : pool.erc20Address,
      },
    });
  };

  const inputHtmls = pool.supportTokens.map((v, i) => {
    return (
      <div className={classes.formContent} key={i}>
        <FormControl variant="outlined" style={{ flex: "4" }}>
          <OutlinedInput
            className={classes.customInput}
            error={parseFloat(amount) > parseFloat(getMaxAmount(v))}
            id="outlined-adornment-password"
            type={"text"}
            value={amount}
            onChange={amountChange}
            endAdornment={
              <InputAdornment position="end">
                <Button
                  className={classes.maxBtn}
                  disabled={loading}
                  onClick={max.bind(this, v)}
                >
                  <FormattedMessage id="POPUP_INPUT_MAX" />
                </Button>
              </InputAdornment>
            }
          />
          {parseFloat(amount) > parseFloat(getMaxAmount(v)) ? (
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
                <>
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
                </>
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
                    value={getMaxAmount(v)}
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
