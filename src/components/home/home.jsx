import React, { Component } from "react";
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
import config from "../../config";
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
import Store from "../../stores";
import "./home.scss";

import {
  ERROR,
  WITHDRAW_RETURNED,
  DEPOSIT_RETURNED,
  TRADE_RETURNED,
  TX_CONFIRM,
  GET_REWARDS_RETURNED,
  CONNECTION_DISCONNECTED,
  GET_BALANCES_PERPETUAL_RETURNED,
  GET_BALANCES_PERPETUAL,
  CREATE_ENTRY_CONTRACT,
  CREATE_ENTRY_CONTRACT_RETURNED,
} from "../../constants";
import styles from "../../styles/home";

const emitter = Store.emitter;
const dispatcher = Store.dispatcher;
const store = Store.store;

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

class Home extends Component {
  static contextType = Web3Context;
  constructor(props) {
    super(props);

    const rewardPools = store.getStore("rewardPools");
    this.state = {
      tabValue: 0,
      rewardPools,
      loading: true,
      txLoading: false,
      multiDepositModalOpen: false,
      singleDepositModalOpen: false,
      multiWithdrawModalOpen: false,
      singleWithdrawModalOpen: false,
      withdrawRewardsModalOpen: false,
    };
  }

  componentWillMount() {
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(DEPOSIT_RETURNED, this.showHash);
    emitter.on(WITHDRAW_RETURNED, this.showHash);
    emitter.on(TRADE_RETURNED, this.showHash);
    emitter.on(GET_REWARDS_RETURNED, this.showHash);
    emitter.on(CREATE_ENTRY_CONTRACT_RETURNED, this.showHash);
    emitter.on(TX_CONFIRM, this.hideLoading);
    emitter.on("accountsChanged", () => {
      this.setState({ loading: true }, () => {
        dispatcher.dispatch({
          type: GET_BALANCES_PERPETUAL,
          content: {},
        });
      });
    });
  }

  componentDidMount() {
    const networkId = store.getStore("networkId");
    this.setState({
      networkId,
    });

    const that = this;
    setTimeout(async () => {
      const account = store.getStore("account");
      that.setState({
        account,
      });
      dispatcher.dispatch({
        type: GET_BALANCES_PERPETUAL,
        content: {},
      });
    }, 2000);
  }
  componentWillUnmount() {
    emitter.removeListener(
      CONNECTION_DISCONNECTED,
      this.connectionDisconnected
    );
    emitter.removeListener(
      GET_BALANCES_PERPETUAL_RETURNED,
      this.getBalancesReturned
    );
    emitter.removeListener(DEPOSIT_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_RETURNED, this.showHash);
    emitter.removeListener(TRADE_RETURNED, this.showHash);
    emitter.removeListener(GET_REWARDS_RETURNED, this.showHash);
    emitter.removeListener(CREATE_ENTRY_CONTRACT_RETURNED, this.showHash);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(TX_CONFIRM, this.hideLoading);
  }

  connectionDisconnected = () => {
    this.setState({ account: store.getStore("account") });
  };

  showHash = (txHash) => {
    this.setState({
      snackbarMessage: null,
      snackbarType: null,
      multiDepositModalOpen: false,
      singleDepositModalOpen: false,
      multiWithdrawModalOpen: false,
      singleWithdrawModalOpen: false,
      withdrawRewardsModalOpen: false,
      txLoading: true,
    });
    const that = this;
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: "Hash" };
      that.setState(snackbarObj);
    });

    setTimeout(() => {
      dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} });
      this.hideLoading();
    }, 10000);
  };

  showLoading = () => {
    this.setState({ txLoading: true });
  };

  hideLoading = () => {
    this.setState({
      txLoading: false,
    });
  };

  createEntryContract = (data) => {
    const { account } = this.state;
    if (
      !Object.getOwnPropertyNames(account).length ||
      account.address === undefined
    ) {
      this.context.connectWeb3();
    } else {
      this.showLoading();
      setTimeout(() => {
        this.hideLoading();
      }, 5000);
      dispatcher.dispatch({
        type: CREATE_ENTRY_CONTRACT,
        content: {
          asset: data,
        },
      });
    }
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null };
    this.setState(snackbarObj);
    this.setState({ loading: false, txLoading: false });
    const that = this;
    setTimeout(() => {
      const snackbarObj = {
        snackbarMessage: error.toString(),
        snackbarType: "Error",
        multiDepositModalOpen: false,
        singleDepositModalOpen: false,
        multiWithdrawModalOpen: false,
        singleWithdrawModalOpen: false,
        withdrawRewardsModalOpen: false,
      };
      that.setState(snackbarObj);
    });
  };

  getBalancesReturned = () => {
    const rewardPools = store.getStore("rewardPools");
    this.setState({
      loading: false,
      rewardPools,
    });

    const that = this;
    window.setTimeout(() => {
      const account = store.getStore("account");
      that.setState({
        account,
      });
      dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} });
    }, 10000);
  };

  openDepositModal = (data) => {
    let key;
    switch (data.depositModal) {
      case "multiDeposit":
        key = "multiDepositModalOpen";
        break;
      case "singleDeposit":
        key = "singleDepositModalOpen";
        break;
      default:
        break;
    }
    this.setState({
      [key]: true,
      depositData: data,
    });
  };

  openWithdrawModal = (data) => {
    if (data.withdrawModal) {
      let key;
      switch (data.withdrawModal) {
        case "multiWithdraw":
          key = "multiWithdrawModalOpen";
          break;
        case "singleWithdraw":
          key = "singleWithdrawModalOpen";
          break;
        default:
          break;
      }
      this.setState({
        [key]: true,
        withdrawData: data,
      });
    }
  };

  openWithdrawRewardsModal = () => {
    this.setState({
      withdrawRewardsModalOpen: true,
    });
  };

  closeMultiDepositModal = () => {
    this.setState({ multiDepositModalOpen: false });
  };

  closeSingleDepositModal = () => {
    this.setState({ singleDepositModalOpen: false });
  };

  closeMultiWithdrawModal = () => {
    this.setState({ multiWithdrawModalOpen: false });
  };

  closeSingleWithdrawModal = () => {
    this.setState({ singleWithdrawModalOpen: false });
  };

  closeWithdrawRewardsModal = () => {
    this.setState({ withdrawRewardsModalOpen: false });
  };

  renderSnackbar = () => {
    var { snackbarType, snackbarMessage } = this.state;
    return (
      <Snackbar type={snackbarType} message={snackbarMessage} open={true} />
    );
  };

  renderMultiDepositModal = (data) => {
    return (
      <MultiDepositModal
        data={data}
        loading={this.state.loading || this.state.txLoading}
        closeModal={this.closeMultiDepositModal}
        modalOpen={this.state.multiDepositModalOpen}
        showHash={this.showHash}
        errorReturned={this.errorReturned}
      />
    );
  };

  renderSingleDepositModal = (data) => {
    return (
      <SingleDepositModal
        data={data}
        loading={this.state.loading || this.state.txLoading}
        closeModal={this.closeSingleDepositModal}
        modalOpen={this.state.singleDepositModalOpen}
        showHash={this.showHash}
        errorReturned={this.errorReturned}
      />
    );
  };

  renderMultiWithdrawModal = (data) => {
    return (
      <MultiWithdrawModal
        data={data}
        loading={this.state.loading || this.state.txLoading}
        closeModal={this.closeMultiWithdrawModal}
        modalOpen={this.state.multiWithdrawModalOpen}
        showHash={this.showHash}
        errorReturned={this.errorReturned}
      />
    );
  };

  renderSingleWithdrawModal = (data) => {
    return (
      <SingleWithdrawModal
        data={data}
        loading={this.state.loading || this.state.txLoading}
        closeModal={this.closeSingleWithdrawModal}
        modalOpen={this.state.singleWithdrawModalOpen}
        showHash={this.showHash}
        errorReturned={this.errorReturned}
      />
    );
  };

  renderWithdrawRewardsModal = (data) => {
    return (
      <WithdrawRewardsModal
        data={data}
        loading={this.state.loading || this.state.txLoading}
        closeModal={this.closeWithdrawRewardsModal}
        modalOpen={this.state.withdrawRewardsModalOpen}
      />
    );
  };

  renderNetworkErrModal = () => {
    return <NetworkErrModal />;
  };

  handleChange = (event, newValue) => {
    console.log(newValue);
    this.setState({ tabValue: newValue });
  };

  render() {
    const { classes } = this.props;
    const {
      multiDepositModalOpen,
      singleDepositModalOpen,
      multiWithdrawModalOpen,
      singleWithdrawModalOpen,
      withdrawRewardsModalOpen,
      rewardPools,
      snackbarMessage,
      loading,
      txLoading,
    } = this.state;

    if (!rewardPools) {
      return null;
    }

    let rewardApr = 0,
      rewardsAvailable = 0,
      totalStakeAmount = 0;
    if (this.state.rewardPools) {
      this.state.rewardPools.forEach((pool) => {
        const toSyxAmount =
          (parseFloat(pool.stakeAmount) * parseFloat(pool.BPTPrice)) /
          parseFloat(pool.price);
        rewardApr += parseFloat(pool.rewardApr) * toSyxAmount;
        rewardsAvailable += parseFloat(pool.rewardsAvailable || 0);
        totalStakeAmount += toSyxAmount;
      });

      rewardApr =
        totalStakeAmount > 0
          ? (rewardApr / totalStakeAmount).toFixed(1)
          : "0.0";
      rewardsAvailable = rewardsAvailable.toFixed(4);
    }

    let balanceSet = new Set();
    let hasJoinedCount = 0;
    rewardPools.forEach((data) => {
      if (data.entryContractAddress) {
        hasJoinedCount++;
      }
      balanceSet.add(
        JSON.stringify({
          name: data.name,
          erc20Balance: data.erc20Balance,
        })
      );
    });

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
                {rewardPools.length > 0 ? (
                  <Balance
                    outline={true}
                    name={
                      rewardPools[0] ? rewardPools[0].rewardToken.symbol : ""
                    }
                    balance={rewardPools[0] ? rewardPools[0].rewardsBalance : 0}
                  />
                ) : (
                  <></>
                )}
                {Array.from(balanceSet).map((data, i) => (
                  <Balance
                    key={i}
                    outline={true}
                    name={JSON.parse(data).name}
                    balance={JSON.parse(data).erc20Balance}
                  />
                ))}
              </div>
            </div>
          </Hidden>
          <Hidden xsDown>
            <Card className={classes.root}>
              <CardActions className={classes.actions}>
                <img
                  className={classes.walletIcon}
                  src={"/wallet.svg"}
                  alt=""
                />
                <FormattedMessage id="WALLET_BALANCE" />
                {rewardPools.length > 0 ? (
                  <Balance
                    name={
                      rewardPools[0] ? rewardPools[0].rewardToken.symbol : ""
                    }
                    balance={rewardPools[0] ? rewardPools[0].rewardsBalance : 0}
                  />
                ) : (
                  <></>
                )}
                {Array.from(balanceSet).map((data, i) => (
                  <Balance
                    key={i}
                    name={JSON.parse(data).name}
                    balance={JSON.parse(data).erc20Balance}
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
                          value={rewardApr || 0}
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
                    <Divider
                      className={classes.divider}
                      orientation="vertical"
                    />
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
                          value={rewardsAvailable || 0}
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
                          this.openWithdrawRewardsModal();
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
                  value={rewardApr || 0}
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
                          value={rewardsAvailable || 0}
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
                          this.openWithdrawRewardsModal();
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
              value={this.state.tabValue}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label={<FormattedMessage id="RP_LIST_TITLE" />} />
              <Tab label={<FormattedMessage id="EXCHANGE" />} />
            </Tabs>
            <TabPanel
              value={this.state.tabValue}
              index={0}
              className={classes.container}
            >
              <Grid container spacing={3}>
                {rewardPools.map((data, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Pool
                      data={data}
                      loading={loading || txLoading}
                      onDeposit={() => this.openDepositModal(data)}
                      onWithdraw={() => this.openWithdrawModal(data)}
                      onJoin={() => this.createEntryContract(data)}
                    />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel
              value={this.state.tabValue}
              index={1}
              className={classes.container}
            >
              <Transaction data={rewardPools[0]} />
            </TabPanel>
          </Paper>
        </Container>
        {multiDepositModalOpen &&
          this.renderMultiDepositModal(this.state.depositData)}
        {singleDepositModalOpen &&
          this.renderSingleDepositModal(this.state.depositData)}
        {multiWithdrawModalOpen &&
          this.renderMultiWithdrawModal(this.state.withdrawData)}
        {singleWithdrawModalOpen &&
          this.renderSingleWithdrawModal(this.state.withdrawData)}
        {withdrawRewardsModalOpen &&
          this.renderWithdrawRewardsModal(this.state.rewardPools)}
        {this.state.networkId &&
          this.state.networkId.toString() !==
            config.requiredNetworkId.toString() &&
          this.renderNetworkErrModal()}
        {snackbarMessage && this.renderSnackbar()}

        {(loading || txLoading) && <Loader />}
        <Footer />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Home));
