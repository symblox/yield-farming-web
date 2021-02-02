import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { atom, useAtom } from "jotai";
import { parseUnits } from "@ethersproject/units";
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
import singleAvailableAmountAtom, {
  fetchAvailableValues,
} from "../../../hooks/useSingleAvailableAmount";
import poolTokenBalanceAtom, {
  fetchPoolTokenBalance,
} from "../../../hooks/usePoolTokenBalance";
import useSingleWithdraw from "../../../hooks/payables/useSingleWithdraw";
import useCalcPoolInGivenSingleOut from "../../../hooks/useCalcPoolInGivenSingleOut";
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

const loadingAtom = atom((get) => {
  const availableAmounts = get(singleAvailableAmountAtom);
  const poolTokenBalance = get(poolTokenBalanceAtom);
  let loading = false;
  if (
    !Array.isArray(availableAmounts) ||
    Object.keys(poolTokenBalance).length === 0
  )
    loading = true;
  return loading;
});

const SingleWithdrawModal = (props) => {
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
  const maxTokenWithdrawAmountAtom = atom((get) => {
    const pool = get(poolAtom);
    const poolTokenBalances = get(poolTokenBalanceAtom);
    const availableAmounts = get(singleAvailableAmountAtom);
    let maxTokenWithdrawAmount = {};
    for (let i = 0; i < availableAmounts.length; i++) {
      const availableAmount = bnum(availableAmounts[i].amount);
      const key = availableAmounts[i].name;
      const tokenMaxOut = bnum(poolTokenBalances[key]).times(bnum(pool.maxOut));
      let maxAmount;
      if (tokenMaxOut.gt(availableAmount)) {
        maxAmount = availableAmount;
      } else {
        maxAmount = tokenMaxOut;
      }

      maxTokenWithdrawAmount[key] = maxAmount;
    }

    return maxTokenWithdrawAmount;
  });

  const singleWithdraw = useSingleWithdraw();
  const calcPoolInGivenSingleOut = useCalcPoolInGivenSingleOut();
  const { ethersProvider, providerNetwork } = useContext(Web3Context);
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState({});
  const [txLoading, setTxLoading] = useState(false);
  const [loading] = useAtom(loadingAtom);
  const [availableAmounts, setAvailableAmounts] = useAtom(
    singleAvailableAmountAtom
  );
  const [poolTokenBalance, setPoolTokenBalance] = useAtom(poolTokenBalanceAtom);
  const [maxTokenWithdrawAmount] = useAtom(maxTokenWithdrawAmountAtom);
  useEffect(() => {
    if (pool.supportTokens && pool.supportTokens.length > 0)
      setSelected(pool.supportTokens[0]);
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
      setPoolTokenBalance
    );
  }, [ethersProvider, pool]);

  const amountChange = (event) => {
    const { value } = event.target;
    setAmount(value);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setAmount("");
    setSelected(value);
  };

  const max = (token) => {
    amountChange({
      target: {
        value: maxTokenWithdrawAmount[token.symbol],
      },
    });
  };

  const closeAndInitModal = () => {
    setAvailableAmounts([]);
    setPoolTokenBalance({});
    closeModal();
  };

  const confirm = async () => {
    setTxLoading(true);
    const tokenAmountOut = await calcPoolInGivenSingleOut(
      pool,
      selected.address,
      parseUnits(bnum(amount).toFixed(selected.decimals, 1), selected.decimals)
    );
    let params = [];
    if (selected.symbol !== "VLX") {
      params.push(selected.address);
    }
    params.push(tokenAmountOut);
    params.push("0");
    try {
      const tx = await singleWithdraw(pool, params);
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
                value={
                  maxTokenWithdrawAmount[selected.symbol] ||
                  maxTokenWithdrawAmount[selected.symbol] === 0
                    ? maxTokenWithdrawAmount[selected.symbol].toLocaleString(
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
                parseFloat(maxTokenWithdrawAmount[selected.symbol] || 0)
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
            parseFloat(maxTokenWithdrawAmount[selected.symbol] || 0) ? (
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
            <FormattedMessage id="LP_WITHDRAW" />
          )}
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(SingleWithdrawModal);
