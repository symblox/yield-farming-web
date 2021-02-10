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
import { parseUnits, formatUnits } from "@ethersproject/units";
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
import rewardAprsAtom, {
  fetchRewardAprsValues,
} from "../../hooks/useRewardAprs";
import sorAtom, {
  findBestSwapsMulti,
  fetchPoolData,
  fetchPathData,
} from "../../hooks/useSor";
import useInterval from "../../hooks/useInterval";
import useCreateConnector from "../../hooks/payables/useCreateConnector";
import { bnum } from "../../utils/bignumber";

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
  const rewardPool = get(rewardPoolsAtom);
  let totalRewardsAvailable = 0;
  if (rewardPool.pools) {
    rewardPool.pools.forEach((pool) => {
      totalRewardsAvailable += parseFloat(pool.rewardsAvailable || 0);
    });
    totalRewardsAvailable = totalRewardsAvailable.toFixed(4);
  }

  return totalRewardsAvailable;
});
const hasJoinedCountAtom = atom((get) => {
  const rewardPool = get(rewardPoolsAtom);
  let hasJoinedCount = 0;
  rewardPool.pools.forEach((data) => {
    if (data.entryContractAddress) {
      hasJoinedCount++;
    }
  });
  return hasJoinedCount;
});

const loadingAtom = atom((get) => {
  const userBalance = get(userBalanceAtom);
  const rewardPool = get(rewardPoolsAtom);
  let loading = false;
  if (
    !Array.isArray(userBalance) ||
    Object.keys(userBalance).length === 0 ||
    !rewardPool.loaded
  )
    loading = true;
  return loading;
});

const Home = (props) => {
  const { classes } = props;
  const createConnector = useCreateConnector();
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [tabValue, setTabValue] = useState(0);
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
  const [rewardPool, setRewardPools] = useAtom(rewardPoolsAtom);
  const [aprs, setAprs] = useAtom(rewardAprsAtom);
  const [sor, setSor] = useAtom(sorAtom);
  const [totalRewardsAvailable] = useAtom(totalRewardsAvailableAtom);
  const [hasJoinedCount] = useAtom(hasJoinedCountAtom);
  const [loading] = useAtom(loadingAtom);

  const loadData = async () => {
    if (account && ethersProvider && providerNetwork) {
      fetchUserBalance(
        account,
        ethersProvider,
        providerNetwork,
        tradeTokens,
        setUserBalance
      );
      await fetchRewardPoolsValues(
        account,
        ethersProvider,
        providerNetwork,
        setRewardPools
      );
      const poolList = await fetchPoolData(ethersProvider, providerNetwork);
      let pricesForRewardToken = {};
      let inputToken;
      const outputToken = config.syx;
      const promises = tradeTokens.map(async (v) => {
        if (v.symbol !== "SYX") {
          inputToken = v.address;
          const newSor = await fetchPathData(
            inputToken,
            outputToken,
            sor,
            poolList,
            setSor
          );
          const [totalReturn] = await findBestSwapsMulti(
            newSor,
            "swapExactIn",
            bnum(parseUnits("0.01", v.decimals)), //To prevent the number of bpts from being not enough to 1, use 0.01, if the price is not enough, it will be treated as 0
            10,
            0
          );
          pricesForRewardToken[v.symbol] = formatUnits(
            bnum(totalReturn.toString()).times(bnum(100)).toString(),
            18
          );
        }
      });
      await Promise.all(promises);
      fetchRewardAprsValues(
        account,
        rewardPool.pools,
        pricesForRewardToken,
        ethersProvider,
        providerNetwork,
        setAprs
      );
    }
  };

  useInterval(() => loadData(), 10000);

  useEffect(() => {
    loadData();
  }, [account, ethersProvider, providerNetwork]);

  const createEntryContract = (pool) => {
    createConnector(pool);
  };

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
                        value={aprs.userApr}
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
                value={aprs.userApr}
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
              {rewardPool.pools.map((pool, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Pool
                    data={pool}
                    apr={aprs["poolAprs"][pool.index]}
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
            <Transaction data={rewardPool.pools[0]} />
          </TabPanel>
        </Paper>
      </Container>
      {multiDepositModalOpen && renderMultiDepositModal(depositData)}
      {singleDepositModalOpen && renderSingleDepositModal(depositData)}
      {multiWithdrawModalOpen && renderMultiWithdrawModal(withdrawData)}
      {singleWithdrawModalOpen && renderSingleWithdrawModal(withdrawData)}
      {withdrawRewardsModalOpen && renderWithdrawRewardsModal(rewardPool.pools)}
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
