import React, { useContext, useEffect, useState } from "react";
import { parseEther, formatEther } from "@ethersproject/units";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { FormattedMessage } from "react-intl";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
  Grid,
  Divider,
} from "@material-ui/core";

import { PoolContext } from "../contexts/PoolContext";
import { Web3Context } from "../contexts/Web3Context";
import BalanceBar from "./BalanceBar";
import NetworkErrModal from "./modal/networkErrModal";
import config from "../config";

const styles = (theme) => ({
  container: {
    textAlign: "center",
  },
  heroText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: "2rem",
    marginBottom: "4rem",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  root: {
    background: "#FFFFFF",
    boxShadow: "0px 0px 35px 0px rgba(94, 85, 126, 0.15)",
    borderRadius: "12px",
    textAlign: "left",

    "& Button": {},
    "& p": {
      margin: "8px 0",
    },
  },

  title: {
    margin: "0 0 16px 0",
    textAlign: "left",
  },
  subTitle: {
    // margin: "8px 0",
    fontWeight: "500",
  },
  box: {
    width: "100%",
  },
  button: {
    background: "linear-gradient(135deg, #42D9FE 0%, #2872FA 100%, #42D9FE)",
    borderRadius: "26px",
    // fontFamily: "Noto Sans SC",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "20px",
    color: "#FFFFFF",
    width: "100%",
    margin: "26px auto 0 auto",
    "&:hover": {
      background: "linear-gradient(315deg, #4DB5FF 0%, #57E2FF 100%, #4DB5FF)",
    },
    "&.Mui-disabled": {
      background:
        "linear-gradient(135deg, rgb(66, 217, 254, 0.12) 0%, rgb(40, 114, 250,0.12) 100%, rgb(66, 217, 254, 0.12))",
      color: "#FFFFFF",
    },
  },
  buttonSecondary: {
    background: "linear-gradient(135deg, #FF3A33 0%, #FC06C6 100%, #FF3A33)",
    borderRadius: "26px",
    // fontFamily: "Noto Sans SC",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "20px",
    color: "#FFFFFF",
    width: "100%",
    margin: "26px auto 0 auto",
    "&:hover": {
      background: "linear-gradient(315deg, #FF78E1 0%, #FF736E 100%, #FF78E1)",
    },
    "&.Mui-disabled": {
      background:
        "linear-gradient(135deg, rgb(255, 58, 51, 0.12) 0%, rgb(252, 6, 198, 0.12) 100%, rgb(255, 58, 51, 0.12))",
      color: "#FFFFFF",
    },
  },
  warning: {
    color: "#FF0000",
  },
});

const ExchangeSVLX = ({ classes }) => {
  const {
    balanceState,
    orderedAmount,
    svlxExchangeRate,
    svlxDeposit,
    svlxWithdraw,
    svlxWithdrawable,
    stakingEpochDuration,
    loading,
    isError,
    setIsError,
    errorMsg,
    setErrorMsg,
  } = useContext(PoolContext);
  const { providerNetwork } = useContext(Web3Context);

  const [amount, setAmount] = useState(0);
  const [svlxAmount, setSvlxAmount] = useState(0);
  const [balances, setBalances] = useState([]);

  const amountChange = (event) => {
    if (event.target.value && Number.isNaN(parseFloat(event.target.value))) {
      setAmount(0);
    } else {
      setAmount(event.target.value);
    }
  };

  const svlxAmountChange = (event) => {
    if (event.target.value && Number.isNaN(parseFloat(event.target.value))) {
      setSvlxAmount(0);
    } else {
      setSvlxAmount(event.target.value);
    }
  };

  const getMaxVlXAmount = () => {
    setAmount(Math.floor(formatEther(balanceState.vlx) * 10000) / 10000);
  };

  const getMaxSVlXAmount = () => {
    setSvlxAmount(Math.floor(formatEther(balanceState.svlx) * 10000) / 10000);
  };

  useEffect(() => {
    let array = [];
    for (let i in balanceState) {
      const balance = formatEther(balanceState[i]);
      if (i == "vlx" || i == "svlx")
        array.push({
          name: i,
          balance,
        });
    }
    setBalances(array);
  }, [balanceState]);

  return (
    <Box paddingX={2} marginBottom={32}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={isError}
        onClose={() => {
          setIsError(false);
          setErrorMsg({});
        }}
      >
        <MuiAlert
          severity="error"
          onClose={() => {
            setIsError(false);
            setErrorMsg({});
          }}
        >
          {typeof errorMsg === "object" ? (
            errorMsg.type === "SVLX_WITHDRAW_ERR" ? (
              <FormattedMessage id="SVLX_WITHDRAW_ERR" />
            ) : (
              JSON.stringify(errorMsg)
            )
          ) : (
            errorMsg
          )}
        </MuiAlert>
      </Snackbar>
      {providerNetwork &&
        (config.requiredNetworkId.toString() !==
        providerNetwork.chainId.toString() ? (
          <NetworkErrModal />
        ) : (
          <></>
        ))}
      <Box maxWidth="60rem" marginX="auto">
        <BalanceBar balances={balances} />
      </Box>
      <Box
        maxWidth="60rem"
        marginX="auto"
        marginY="2rem"
        p={6}
        className={classes.root}
      >
        <Grid container spacing={8}>
          <Grid item xs={12} sm={12}>
            <Typography className={classes.subTitle}>
              <FormattedMessage id="VLX_EXCHANGE_RATE" />
            </Typography>
            <Typography>
              1 VLX = {(1 / parseFloat(svlxExchangeRate)).toFixed(4)} SVLX
            </Typography>
            <FormControl variant="outlined" className={classes.box}>
              <Typography>
                <FormattedMessage id="EXCHANGE_TIP" />
                <span style={{ float: "right" }}>
                  <FormattedMessage
                    id="EXCHANGE_WALLET_BALANCE"
                    values={{
                      amount: (
                        <NumberFormat
                          value={formatEther(balanceState.vlx)}
                          defaultValue={"-"}
                          displayType={"text"}
                          thousandSeparator={true}
                          isNumericString={true}
                          suffix={" VLX"}
                          decimalScale={4}
                          fixedDecimalScale={true}
                        />
                      ),
                    }}
                  />
                </span>
              </Typography>
              <OutlinedInput
                // className={classes.customInput}
                id="outlined-adornment-password"
                type={"text"}
                value={amount}
                onChange={amountChange}
                endAdornment={
                  <InputAdornment position="end">
                    <Button onClick={getMaxVlXAmount}>
                      <FormattedMessage id="POPUP_INPUT_MAX" />
                    </Button>
                  </InputAdornment>
                }
              />
              <Typography variant="body2">
                <FormattedMessage id="EXPECTED_TO_GET" />:{" "}
                {parseFloat(amount / svlxExchangeRate).toFixed(4)} SVLX
                <br />
              </Typography>
            </FormControl>
            <Button
              className={classes.button}
              disabled={
                amount == 0 ||
                parseFloat(amount) >
                  parseFloat(formatEther(balanceState.vlx)) ||
                loading
              }
              onClick={async () => {
                if (amount > 0) {
                  await svlxDeposit(parseEther(amount.toString()));
                  setAmount(0);
                }
              }}
            >
              {loading ? (
                <CircularProgress
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                ></CircularProgress>
              ) : (
                <FormattedMessage id="DEPOSIT" />
              )}
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography className={classes.subTitle}>
              <FormattedMessage id="SVLX_EXCHANGE_RATE" />
            </Typography>
            <Typography>
              1 SVLX = {parseFloat(svlxExchangeRate).toFixed(4)} VLX
            </Typography>
            <FormControl variant="outlined" className={classes.box}>
              <Typography>
                <FormattedMessage id="EXCHANGE_TIP" />
                <span style={{ float: "right" }}>
                  <FormattedMessage
                    id="EXCHANGE_WALLET_BALANCE"
                    values={{
                      amount: (
                        <NumberFormat
                          value={formatEther(balanceState.svlx)}
                          defaultValue={"-"}
                          displayType={"text"}
                          thousandSeparator={true}
                          isNumericString={true}
                          suffix={" SVLX"}
                          decimalScale={4}
                          fixedDecimalScale={true}
                        />
                      ),
                    }}
                  />
                </span>
              </Typography>
              <OutlinedInput
                // className={classes.customInput}
                id="outlined-adornment-password"
                type={"text"}
                value={svlxAmount}
                onChange={svlxAmountChange}
                endAdornment={
                  <InputAdornment position="end">
                    <Button onClick={getMaxSVlXAmount}>
                      <FormattedMessage id="POPUP_INPUT_MAX" />
                    </Button>
                  </InputAdornment>
                }
              />
              <Typography variant="body2">
                <FormattedMessage id="EXPECTED_TO_GET" />:{" "}
                {parseFloat(svlxAmount * svlxExchangeRate).toFixed(4)} VLX
                <br />
              </Typography>
            </FormControl>
            {parseFloat(formatEther(svlxWithdrawable.toString())) <
            parseFloat(svlxAmount) ? (
              <FormattedMessage
                id="WITHDRAWABLE_TIP"
                values={{
                  maxWithdrawable: formatEther(svlxWithdrawable.toString()),
                  stakingEpochDuration: (stakingEpochDuration / 60).toFixed(2),
                  orderedAmount:
                    orderedAmount &&
                    orderedAmount[1] &&
                    parseFloat(orderedAmount[2]) > 0
                      ? parseFloat(
                          formatEther(orderedAmount[1].toString())
                        ).toFixed(4)
                      : 0,
                }}
              />
            ) : (
              ""
            )}
            <Button
              className={classes.buttonSecondary}
              disabled={
                svlxAmount == 0 ||
                parseFloat(svlxAmount) >
                  parseFloat(formatEther(balanceState.svlx)) ||
                loading
              }
              onClick={async () => {
                if (svlxAmount > 0) {
                  await svlxWithdraw(
                    parseEther(
                      Math.floor(svlxAmount * svlxExchangeRate * 1000000) /
                        1000000 +
                        ""
                    )
                  );
                  setSvlxAmount(0);
                }
              }}
            >
              {loading ? (
                <CircularProgress
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                ></CircularProgress>
              ) : parseFloat(formatEther(svlxWithdrawable.toString())) <
                parseFloat(svlxAmount) ? (
                <FormattedMessage id="WITHDRAW_APPLY" />
              ) : (
                <FormattedMessage id="WITHDRAW" />
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default withRouter(withStyles(styles)(ExchangeSVLX));
