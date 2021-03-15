import React, {useContext, useEffect, useState} from "react";
import {FormattedMessage} from "react-intl";
import {AddressZero} from "@ethersproject/constants";
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import NumberFormat from "react-number-format";
import styles from "../styles/pool";
import {fetchPoolTokenBalance} from "../hooks/usePoolTokenBalance";
import {Web3Context} from "../contexts/Web3Context";

const Pool = props => {
  const {data: pool, apr, loading, onDeposit, onWithdraw, onJoin, classes} = props;
  const tokenNameList = pool.id.split("/");
  const {ethersProvider, providerNetwork} = useContext(Web3Context);
  const [poolTokenBalance, setPoolTokenBalance] = useState({});

  useEffect(() => {
    if (!ethersProvider || !providerNetwork || !pool) return;
    fetchPoolTokenBalance(ethersProvider, providerNetwork, pool, setPoolTokenBalance);
  }, [ethersProvider, providerNetwork, pool]);

  return (
    <div className={classes.container}>
      {pool.featured ? <div className={classes.featured}></div> : <></>}
      <Card className={pool.featured ? classes.featuredRoot : classes.root}>
        <CardContent>
          {pool.stakeAmount > 0.0001 ? (
            <div className={"hold-right"}>
              <FormattedMessage id="HOLD" />
            </div>
          ) : (
            <></>
          )}
          <div className={classes.title}>
            {tokenNameList.map((v, i) => {
              return (
                <img
                  key={i}
                  className={classes.icon}
                  style={i == tokenNameList.length - 1 ? {} : {marginRight: "-4px", zIndex: 2}}
                  src={"/" + v + ".png"}
                  alt=""
                />
              );
            })}
            <div style={{padding: "8px 0 8px"}}>{pool.id}</div>
          </div>
          <Tooltip
            title={
              <React.Fragment>
                <div className={classes.tooltip}>
                  <FormattedMessage id="TOTAL_SUPPLY" />:{" "}
                  {pool.supportTokens.map((v, i) => {
                    return (
                      <NumberFormat
                        key={i}
                        value={poolTokenBalance[v.symbol]}
                        defaultValue={"-"}
                        displayType={"text"}
                        thousandSeparator={true}
                        isNumericString={true}
                        suffix={v.name}
                        decimalScale={4}
                        fixedDecimalScale={true}
                        renderText={value => {
                          if (i === 0) {
                            return <>{value}</>;
                          } else {
                            return <div style={{margin: "10px 0 0 55px"}}>{value}</div>;
                          }
                        }}
                      />
                    );
                  })}
                </div>
                <div className={classes.tooltip}>
                  <FormattedMessage id="RATIO" />: {pool.weight}
                </div>
                <div className={classes.tooltip}>
                  <FormattedMessage id="REWARD_DISTRIBUTION_RATIO" />:{" "}
                  <NumberFormat
                    value={(parseFloat(pool.allocPoint) * 100).toLocaleString(undefined, {maximumFractionDigits: 10})}
                    defaultValue={"-"}
                    displayType={"text"}
                    thousandSeparator={true}
                    isNumericString={true}
                    suffix={"%"}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </div>
              </React.Fragment>
            }
            enterTouchDelay={700}
          >
            <Typography className={pool.featured ? classes.featuredText : classes.text}>
              <FormattedMessage id="SEE_DETAIL" />
            </Typography>
          </Tooltip>

          <Typography className={classes.textSecondary}>
            <FormattedMessage id="AVG_STAKING_APR" />:{" "}
            <NumberFormat
              value={apr}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              suffix={"%"}
              decimalScale={1}
              fixedDecimalScale={true}
              renderText={value => (
                <span className={classes.textSecondaryColor} style={{float: "right"}}>
                  {value}
                </span>
              )}
            />
          </Typography>
          <Typography className={classes.textThird}>
            <FormattedMessage id="WITHDRAWABLE_REWARDS" />:{" "}
            <NumberFormat
              value={pool.rewardsAvailable}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              suffix={pool.rewardToken.name}
              decimalScale={4}
              fixedDecimalScale={true}
              renderText={value => (
                <span className={classes.textSecondaryColor} style={{float: "right"}}>
                  {value}
                </span>
              )}
            />
          </Typography>
          <Typography className={classes.textThird}>
            <FormattedMessage id="LP_MY_SHARE" />:
            <NumberFormat
              value={(pool.totalSupply > 0
                ? (parseFloat(pool.stakeAmount) / parseFloat(pool.totalSupply)) * 100
                : 0
              ).toLocaleString(undefined, {maximumFractionDigits: 10})}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              suffix={"%"}
              decimalScale={6}
              fixedDecimalScale={true}
              renderText={value => (
                <span className={classes.textThirdColor} style={{float: "right"}}>
                  {value}
                </span>
              )}
            />
          </Typography>
          <Typography className={classes.textThird}>
            <FormattedMessage id="LP_MY_DEPOSIT" />:
            {pool.supportTokens.map((v, i) => {
              return (
                <NumberFormat
                  key={i}
                  value={(parseFloat(pool.stakeAmount) / parseFloat(pool.totalSupply)) * poolTokenBalance[v.symbol]}
                  defaultValue={"-"}
                  displayType={"text"}
                  thousandSeparator={true}
                  isNumericString={true}
                  suffix={v.name}
                  decimalScale={4}
                  fixedDecimalScale={true}
                  renderText={value => {
                    if (i === 0) {
                      return (
                        <span className={classes.textThirdColor} style={{float: "right"}}>
                          {value}
                        </span>
                      );
                    } else {
                      return (
                        <div className={classes.textThirdColor} style={{textAlign: "right"}}>
                          {value}
                        </div>
                      );
                    }
                  }}
                />
              );
            })}
          </Typography>
        </CardContent>
        <CardActions className={classes.bar}>
          {pool.entryContractAddress !== AddressZero ? (
            <>
              <Grid container style={{position: "relative"}}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    size="small"
                    style={{margin: "0px 0", minWidth: "95%"}}
                    className={classes.button}
                    disabled={loading}
                    onClick={onDeposit}
                  >
                    <FormattedMessage id="LP_DEPOSIT" />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    size="small"
                    style={{margin: "0px 0", minWidth: "95%"}}
                    className={classes.buttonSecondary}
                    disabled={loading}
                    onClick={onWithdraw}
                  >
                    <FormattedMessage id="LP_WITHDRAW" />
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              className={classes.buttonSecondary}
              disabled={loading}
              onClick={onJoin}
            >
              <FormattedMessage id="JOIN" />
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
};

export default withStyles(styles)(Pool);
