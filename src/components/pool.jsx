import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AddressZero } from "@ethersproject/constants";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";
import styles from "../styles/pool";
import { Web3Context } from "../contexts/Web3Context";

const Pool = (props) => {
  const { data: pool, apr, loading, onDeposit, onWithdraw, classes } = props;
  const tokenNameList = pool.id.split("-")[0].split("/");

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
                  style={
                    i == tokenNameList.length - 1
                      ? {}
                      : { marginRight: "-4px", zIndex: 2 }
                  }
                  src={"/" + v + ".png"}
                  alt=""
                />
              );
            })}
            <div style={{ padding: "8px 0 8px" }}>{pool.id}</div>
          </div>
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
              renderText={(value) => (
                <span
                  className={classes.textSecondaryColor}
                  style={{ float: "right" }}
                >
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
              renderText={(value) => (
                <span
                  className={classes.textSecondaryColor}
                  style={{ float: "right" }}
                >
                  {value}
                </span>
              )}
            />
          </Typography>
          <Typography className={classes.textThird}>
            <FormattedMessage id="REWARD_DISTRIBUTION_RATIO" />:
            <NumberFormat
              value={(
                parseFloat(pool.allocPoint || 0) * 100
              ).toLocaleString(undefined, { maximumFractionDigits: 10 })}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              suffix={"%"}
              decimalScale={2}
              fixedDecimalScale={true}
              renderText={(value) => (
                <span
                  className={classes.textThirdColor}
                  style={{ float: "right" }}
                >
                  {value}
                </span>
              )}
            />
          </Typography>
          <Typography className={classes.textThird}>
            <FormattedMessage id="LP_MY_SHARE" />:
            <NumberFormat
              value={pool.stakeAmount}
              defaultValue={"-"}
              displayType={"text"}
              thousandSeparator={true}
              isNumericString={true}
              suffix={pool.symbol}
              decimalScale={4}
              fixedDecimalScale={true}
              renderText={(value) => (
                <span
                  className={classes.textThirdColor}
                  style={{ float: "right" }}
                >
                  {value}
                </span>
              )}
            />
          </Typography>
        </CardContent>
        <CardActions className={classes.bar}>
          <Grid container style={{ position: "relative" }}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                size="small"
                style={{ margin: "12px 0", minWidth: "95%" }}
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
                style={{ margin: "12px 0", minWidth: "95%" }}
                className={classes.buttonSecondary}
                disabled={loading}
                onClick={onWithdraw}
              >
                <FormattedMessage id="LP_WITHDRAW" />
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
};

export default withStyles(styles)(Pool);
