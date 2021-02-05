import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import useWithdrawReward from "../../hooks/payables/useWithdrawReward";
import styles from "../../styles/withdrawReward";

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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const WithdrawRewardsModal = (props) => {
  const {
    data: pools,
    classes,
    closeModal,
    modalOpen,
    showHash,
    errorReturned,
  } = props;
  const fullScreen = window.innerWidth < 450;
  const withdrawReward = useWithdrawReward();
  const [curPool, setCurPool] = useState({ rewardToken: {} });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!pools || pools.length === 0) return;
    pools.forEach((pool) => {
      if (pool.entryContractAddress) {
        setCurPool(pool);
      }
    });
  }, [pools]);

  const poolHandleChange = (event) => {
    setCurPool(event.target.value);
  };

  const onClaim = async () => {
    setLoading(true);
    try {
      const tx = await withdrawReward(curPool);
      showHash(tx.hash);
      //await tx.wait();
    } catch (error) {
      console.log(error);
      errorReturned(JSON.stringify(error));
    }
    setLoading(false);
  };

  return (
    <Dialog
      onClose={closeModal}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
      fullWidth={true}
      fullScreen={fullScreen}
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={closeModal}
      ></DialogTitle>
      <DialogContent>
        <>
          <Typography gutterBottom className={classes.mb16}>
            <span className={classes.title}>
              <FormattedMessage id="WITHDRAWABLE_REWARDS" />
              {": "}
            </span>
            <span className={classes.rightText}>
              <img
                className={classes.icon}
                src={"/" + curPool.rewardToken.symbol + ".png"}
                alt=""
              />{" "}
              <NumberFormat
                value={curPool.rewardsAvailable}
                defaultValue={"-"}
                displayType={"text"}
                thousandSeparator={true}
                isNumericString={true}
                suffix={curPool.rewardToken.name}
                decimalScale={4}
                fixedDecimalScale={true}
              />
            </span>
          </Typography>
          <div className={classes.customSelect}>
            <FormattedMessage id="RP_LIST_TITLE" />:
            <img
              className={classes.icon}
              src={"/" + curPool.rewardToken.symbol + ".png"}
              alt=""
            />
            {curPool.id}
            <Select value={curPool} onChange={poolHandleChange}>
              {pools.map((v, i) => {
                if (v.entryContractAddress) {
                  return (
                    <MenuItem value={v} key={i}>
                      {v.id}
                    </MenuItem>
                  );
                }
              })}
            </Select>
            <img className={classes.downIcon} src={"/down.svg"} alt="" />
          </div>
        </>
      </DialogContent>
      <DialogActions>
        <Button
          className={classes.buttonSecondary}
          disabled={loading}
          autoFocus
          onClick={onClaim}
          fullWidth={true}
        >
          {loading ? (
            <CircularProgress></CircularProgress>
          ) : (
            <FormattedMessage id="RP_WITHDRAW_REWARDS" />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(WithdrawRewardsModal);
