import React, { useContext, useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Divider,
  Container,
  Hidden,
  Card,
  CardActions,
  CardContent,
} from "@material-ui/core";

import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import { Web3Context } from "../../contexts/Web3Context";
import config, { tradeTokens } from "../../config";
import Snackbar from "../snackbar";
import { Header } from "../header";
import Footer from "../footer";
import Pool from "../pool";
import Balance from "../balance";
import MultiDepositModal from "../modal/deposit/multiDeposit";
import MultiWithdrawModal from "../modal/withdraw/multiWithdraw";
import SingleDepositModal from "../modal/deposit/singleDeposit";
import SingleWithdrawModal from "../modal/withdraw/singleWithdraw";
import WithdrawRewardsModal from "../modal/withdrawRewardsModal";
import NetworkErrModal from "../modal/networkErrModal";
import Transaction from "../transaction";
import Loader from "../loader";
import "./home.scss";
import styles from "../../styles/home";
import userBalanceAtom, { fetchUserBalance } from "../../hooks/useUserBalance";
import rewardPoolsAtom, {
  fetchRewardPoolsValues,
} from "../../hooks/useRewardPools";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const totalRewardsAvailableAtom = atom((get) => {
  const rewardPools = get(rewardPoolsAtom);
  let totalRewardsAvailable = 0;
  if (rewardPools) {
    rewardPools.forEach((pool) => {
      totalRewardsAvailable += parseFloat(pool.rewardsAvailable || 0);
    });
    totalRewardsAvailable = totalRewardsAvailable.toFixed(4);
  }

  return totalRewardsAvailable;
});
const totalRewardAprAtom = atom((get) => {
  const rewardPools = get(rewardPoolsAtom);
  let totalRewardApr = 0,
    totalStakeAmount = 0;
  if (rewardPools) {
    rewardPools.forEach((pool) => {
      const toSyxAmount =
        (parseFloat(pool.stakeAmount) * parseFloat(pool.BPTPrice)) /
        parseFloat(pool.price);
      totalRewardApr += parseFloat(pool.rewardApr) * toSyxAmount;
      totalStakeAmount += toSyxAmount;
    });

    totalRewardApr =
      totalStakeAmount > 0
        ? (totalRewardApr / totalStakeAmount).toFixed(1)
        : "0.0";
  }

  return totalRewardApr;
});
const hasJoinedCountAtom = atom((get) => {
  const rewardPools = get(rewardPoolsAtom);
  let hasJoinedCount = 0;
  rewardPools.forEach((data) => {
    if (data.entryContractAddress) {
      hasJoinedCount++;
    }
  });
  return hasJoinedCount;
});

const Home = (props) => {
  const { classes } = props;
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [multiDepositModalOpen, setMultiDepositModalOpen] = useState(false);
  const [singleDepositModalOpen, setSingleDepositModalOpen] = useState(false);
  const [multiWithdrawModalOpen, setMultiWithdrawModalOpen] = useState(false);
  const [singleWithdrawModalOpen, setSingleWithdrawModalOpen] = useState(false);
  const [withdrawRewardsModalOpen, setWithdrawRewardsModalOpen] = useState(
    false
  );
  const [depositData, setDepositData] = useState({});
  const [withdrawData, setWithdrawData] = useState({});
  const [snackbarType, setSnackbarType] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userBalances, setUserBalance] = useAtom(userBalanceAtom);
  const [rewardPools, setRewardPools] = useAtom(rewardPoolsAtom);

  const [totalRewardApr] = useAtom(totalRewardAprAtom);
  const [totalRewardsAvailable] = useAtom(totalRewardsAvailableAtom);
  const [hasJoinedCount] = useAtom(hasJoinedCountAtom);

  useEffect(() => {
    if (!account || !ethersProvider || !providerNetwork) return;
    fetchUserBalance(
      account,
      ethersProvider,
      providerNetwork,
      tradeTokens,
      setUserBalance
    );
    fetchRewardPoolsValues(
      account,
      ethersProvider,
      providerNetwork,
      setRewardPools
    );
  }, [account, ethersProvider, providerNetwork]);

  const createEntryContract = (data) => {};

  const showHash = (txHash) => {};

  const errorReturned = (error) => {};

  const openDepositModal = (data) => {
    switch (data.depositModal) {
      case "multiDeposit":
        setMultiDepositModalOpen(true);
        break;
      case "singleDeposit":
        setSingleDepositModalOpen(true);
        break;
      default:
        break;
    }
    setDepositData(data);
  };

  const openWithdrawModal = (data) => {
    switch (data.withdrawModal) {
      case "multiWithdraw":
        setMultiWithdrawModalOpen(true);
        break;
      case "singleWithdraw":
        setSingleWithdrawModalOpen(true);
        break;
      default:
        break;
    }
    setWithdrawData(data);
  };

  const renderNetworkErrModal = () => {
    return <NetworkErrModal />;
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderMultiDepositModal = (data) => {
    return (
      <MultiDepositModal
        data={data}
        loading={loading || txLoading}
        closeModal={() => setMultiDepositModalOpen(false)}
        modalOpen={multiDepositModalOpen}
        showHash={showHash}
        errorReturned={errorReturned}
      />
    );
  };

  const renderSingleDepositModal = (data) => {
    return (
      <SingleDepositModal
        data={data}
        loading={loading || txLoading}
        closeModal={() => setSingleDepositModalOpen(false)}
        modalOpen={singleDepositModalOpen}
        showHash={showHash}
        errorReturned={errorReturned}
      />
    );
  };

  const renderMultiWithdrawModal = (data) => {
    return (
      <MultiWithdrawModal
        data={data}
        loading={loading || txLoading}
        closeModal={() => setMultiWithdrawModalOpen(false)}
        modalOpen={multiWithdrawModalOpen}
        showHash={showHash}
        errorReturned={errorReturned}
      />
    );
  };

  const renderSingleWithdrawModal = (data) => {
    return (
      <SingleWithdrawModal
        data={data}
        loading={loading || txLoading}
        closeModal={() => setSingleWithdrawModalOpen(false)}
        modalOpen={singleWithdrawModalOpen}
        showHash={showHash}
        errorReturned={errorReturned}
      />
    );
  };

  const renderWithdrawRewardsModal = (data) => {
    return (
      <WithdrawRewardsModal
        data={data}
        loading={loading || txLoading}
        closeModal={() => setWithdrawRewardsModalOpen(false)}
        modalOpen={withdrawRewardsModalOpen}
        showHash={showHash}
        errorReturned={errorReturned}
      />
    );
  };

  const renderSnackbar = () => {
    return (
      <Snackbar type={snackbarType} message={snackbarMessage} open={true} />
    );
  };

  return (
    <div>
      <Header />
      <Container>
        <Hidden xsDown>
          <Typography className={classes.headerTitle} gutterBottom>
            <FormattedMessage id="HOME_TITLE" />
          </Typography>
          <Typography className={classes.headerTitleSecondary} gutterBottom>
            <FormattedMessage id="HOME_SUBTITLE" />
          </Typography>
        </Hidden>
        <Hidden smUp>
          <div className={classes.balanceBar}>
            <img className={classes.walletIcon} src={"/wallet.svg"} alt="" />
            <span style={{ opacity: "0.6" }}>
              <FormattedMessage id="WALLET_BALANCE" />
            </span>
            <div
              style={{
                display: "flex",
                margin: "10px auto 20px",
                overflowX: "scroll",
                overflowY: "hidden",
              }}
            >
              {Array.from(userBalances).map((data, i) => (
                <Balance
                  key={i}
                  name={data.name}
                  symbol={data.symbol}
                  balance={data.balance}
                />
              ))}
            </div>
          </div>
        </Hidden>
        <Hidden xsDown>
          <Card className={classes.root}>
            <CardActions className={classes.actions}>
              <img className={classes.walletIcon} src={"/wallet.svg"} alt="" />
              <FormattedMessage id="WALLET_BALANCE" />
              {Array.from(userBalances).map((data, i) => (
                <Balance
                  key={i}
                  name={data.name}
                  symbol={data.symbol}
                  balance={data.balance}
                />
              ))}
            </CardActions>
            <Divider />
            <CardContent>
              <Grid container spacing={3} style={{ position: "relative" }}>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.paper}>
                    <Typography className={classes.paperTitle} gutterBottom>
                      <FormattedMessage id="MY_STAKING_APR" />
                    </Typography>
                    <Typography
                      className={classes.paperTitleSecondary}
                      gutterBottom
                    >
                      <NumberFormat
                        value={totalRewardApr || 0}
                        defaultValue={"-"}
                        displayType={"text"}
                        thousandSeparator={true}
                        isNumericString={true}
                        decimalScale={1}
                        fixedDecimalScale={true}
                      />
                      <span className="small-text"> %</span>
                    </Typography>
                    <Typography className={classes.paperTip} gutterBottom>
                      <FormattedMessage id="STAKING_TIP" />
                    </Typography>
                  </Paper>
                </Grid>
                <Hidden xsDown>
                  <Divider className={classes.divider} orientation="vertical" />
                </Hidden>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.paper}>
                    <Typography className={classes.paperTitle} gutterBottom>
                      <FormattedMessage id="WITHDRAWABLE_REWARDS" />
                    </Typography>
                    <Typography
                      className={classes.paperTitleSecondary}
                      gutterBottom
                    >
                      <NumberFormat
                        value={totalRewardsAvailable || 0}
                        defaultValue={"-"}
                        displayType={"text"}
                        thousandSeparator={true}
                        isNumericString={true}
                        decimalScale={4}
                        fixedDecimalScale={true}
                      />
                      <span className="small-text">SYX2</span>
                    </Typography>
                    <Button
                      style={{ marginTop: "9px" }}
                      className={classes.buttonSecondary}
                      variant="contained"
                      disabled={hasJoinedCount === 0 || loading || txLoading}
                      onClick={() => {
                        setWithdrawRewardsModalOpen(true);
                      }}
                    >
                      <FormattedMessage id="RP_WITHDRAW_REWARDS" />
                    </Button>
                    <Typography className={classes.paperTip} gutterBottom>
                      <FormattedMessage id="WITHDRAW_REWARDS_TIP" />
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.root}>
            <CardActions className={classes.actionsSm}>
              <FormattedMessage id="MY_STAKING_APR" />
              <NumberFormat
                value={totalRewardApr || 0}
                defaultValue={"-"}
                displayType={"text"}
                thousandSeparator={true}
                isNumericString={true}
                suffix={"%"}
                decimalScale={1}
                fixedDecimalScale={true}
              />
            </CardActions>
            <Divider />
            <CardContent>
              <Grid container spacing={3} style={{ position: "relative" }}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Typography className={classes.paperTitle} gutterBottom>
                      <FormattedMessage id="WITHDRAWABLE_REWARDS" />
                    </Typography>
                    <Typography
                      className={classes.paperTitleSecondary}
                      gutterBottom
                    >
                      <NumberFormat
                        value={totalRewardsAvailable || 0}
                        defaultValue={"-"}
                        displayType={"text"}
                        thousandSeparator={true}
                        isNumericString={true}
                        suffix={"SYX2"}
                        decimalScale={4}
                        fixedDecimalScale={true}
                      />
                    </Typography>
                    <Button
                      style={{ marginTop: "9px" }}
                      className={classes.buttonSecondary}
                      variant="contained"
                      disabled={hasJoinedCount === 0 || loading || txLoading}
                      onClick={() => {
                        setWithdrawRewardsModalOpen(true);
                      }}
                    >
                      <FormattedMessage id="RP_WITHDRAW_REWARDS" />
                    </Button>
                    <Typography className={classes.paperTip} gutterBottom>
                      <FormattedMessage id="WITHDRAW_REWARDS_TIP" />
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Hidden>
        <Paper className={classes.container}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label={<FormattedMessage id="RP_LIST_TITLE" />} />
            <Tab label={<FormattedMessage id="EXCHANGE" />} />
          </Tabs>
          <TabPanel value={tabValue} index={0} className={classes.container}>
            <Grid container spacing={3}>
              {rewardPools.map((pool, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Pool
                    data={pool}
                    loading={loading || txLoading}
                    onDeposit={() => openDepositModal(pool)}
                    onWithdraw={() => openWithdrawModal(pool)}
                    onJoin={() => createEntryContract(pool)}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index={1} className={classes.container}>
            <Transaction data={rewardPools[0]} />
          </TabPanel>
        </Paper>
      </Container>
      {multiDepositModalOpen && renderMultiDepositModal(depositData)}
      {singleDepositModalOpen && renderSingleDepositModal(depositData)}
      {multiWithdrawModalOpen && renderMultiWithdrawModal(withdrawData)}
      {singleWithdrawModalOpen && renderSingleWithdrawModal(withdrawData)}
      {withdrawRewardsModalOpen && renderWithdrawRewardsModal(rewardPools)}
      {providerNetwork &&
        providerNetwork.chainId.toString() !==
          config.requiredNetworkId.toString() &&
        renderNetworkErrModal()}
      {snackbarMessage && renderSnackbar()}
      {(loading || txLoading) && <Loader />}
      <Footer />
    </div>
  );
};

export default withRouter(withStyles(styles)(Home));
