import React, { Component } from "react";
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
import Store from "../../stores";
import { GET_REWARDS } from "../../constants";

import { tokensName } from "../../config";

const dispatcher = Store.dispatcher;

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    textAlign: "center",
  },
  icon: {
    width: "24px",
    height: "24px",
    display: "inline-block",
    margin: "auto 6px",
    verticalAlign: "middle",
  },
  customSelect: {
    width: "100%",
    height: "48px",
    lineHeight: "48px",
    border: "1px solid #EAEAEA",
    borderRadius: "6px",
    padding: "0px 20px",
    position: "relative",
    marginBottom: "20px",

    "& .MuiInput-root": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 0,
    },
  },
  customInput: {
    border: "1px solid #EAEAEA",
    borderRadius: "6px",
    paddingRight: "0px",
    marginRight: "5px",

    "& button": {
      borderRadius: "0px",
      margin: "0",
      fontSize: "20px",
      lineHeight: "23px",
      color: "#ACAEBC",
    },
  },
  button: {
    background: "linear-gradient(135deg, #42D9FE 0%, #2872FA 100%, #42D9FE)",
    borderRadius: "26px",
    // fontFamily: "Noto Sans SC",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "20px",
    lineHeight: "34px",
    color: "#FFFFFF",
    height: "50px",
    margin: "16px 8px 32px 8px",
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
    lineHeight: "34px",
    color: "#FFFFFF",
    height: "50px",
    margin: "16px 8px 32px 8px",
    "&:hover": {
      background: "linear-gradient(315deg, #FF78E1 0%, #FF736E 100%, #FF78E1)",
    },
    "&.Mui-disabled": {
      background:
        "linear-gradient(135deg, rgb(255, 58, 51, 0.12) 0%, rgb(252, 6, 198, 0.12) 100%, rgb(255, 58, 51, 0.12))",
      color: "#FFFFFF",
    },
  },
  containedButton: {
    borderRadius: "6px",
    margin: "0 6px",
  },
  select: {
    borderRadius: "6px",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    color: theme.palette.grey[500],
  },
  formControl: {
    margin: 0,
    minWidth: 120,
  },
  formContent: {
    margin: "16px 0px",
    display: "flex",
  },
  textField: {
    flex: 1,
  },
  rightButton: {
    right: 0,
    position: "absolute",
  },
  message: {
    lineHeight: "44px",
  },
  text: {
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: "16px",
    lineHeight: "25px",
    color: "#ACAEBC",
  },
  rightText: {
    float: "right",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "22px",
    textAlign: "right",
    color: "#4E5B70",
  },
  maxBtn: {
    padding: "10px 18px",
  },
});

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

class WithdrawRewardsModal extends Component {
  constructor(props) {
    super(props);

    let curPool;
    props.data.forEach((data) => {
      if (data.entryContractAddress) {
        curPool = data;
      }
    });
    this.state = {
      pool: curPool,
      token: curPool.tokens[0],
      amount: "0",
      loading: false,
    };
  }

  poolHandleChange = (event) => {
    let selectPool;
    for (let i = 0; i < this.props.data.length; i++) {
      if (
        this.props.data[i].index.toString() === event.target.value.toString()
      ) {
        selectPool = this.props.data[i];
        break;
      }
    }
    if (selectPool)
      this.setState({
        pool: selectPool,
        token: selectPool.tokens[0],
      });
  };

  onClaim = () => {
    this.setState({
      loading: true,
    });

    dispatcher.dispatch({
      type: GET_REWARDS,
      content: {
        asset: this.state.pool,
      },
    });
  };

  render() {
    const { classes, data, closeModal, modalOpen } = this.props;
    const { loading } = this.state;
    const fullScreen = window.innerWidth < 450;

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
            <Typography gutterBottom style={{ marginBottom: "16px" }}>
              <span style={{ color: "#ACAEBC" }}>
                <FormattedMessage id="WITHDRAWABLE_REWARDS" />
                {": "}
              </span>
              <span style={{ float: "right" }}>
                <img
                  className={classes.icon}
                  src={
                    "/" +
                    tokensName[
                      this.state.pool.rewardToken.symbol.toLowerCase()
                    ] +
                    ".png"
                  }
                  alt=""
                />{" "}
                <NumberFormat
                  value={this.state.pool.rewardsAvailable}
                  defaultValue={"-"}
                  displayType={"text"}
                  thousandSeparator={true}
                  isNumericString={true}
                  suffix={
                    tokensName[this.state.pool.rewardToken.symbol.toLowerCase()]
                  }
                  decimalScale={4}
                  fixedDecimalScale={true}
                />
              </span>
            </Typography>
            <div className={classes.customSelect}>
              <FormattedMessage id="RP_LIST_TITLE" />:
              <img
                className={classes.icon}
                src={
                  "/" + tokensName[this.state.pool.name.toLowerCase()] + ".png"
                }
                alt=""
              />
              {this.state.pool.id}
              <Select
                value={this.state.pool.index}
                onChange={this.poolHandleChange.bind(this)}
              >
                {data.map((v, i) => {
                  if (v.entryContractAddress) {
                    return (
                      <MenuItem value={v.index} key={i}>
                        {v.id}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
              <img
                className={classes.icon}
                style={{
                  float: "right",
                  marginTop: "12px",
                  width: "12px",
                }}
                src={"/down.svg"}
                alt=""
              />
            </div>
          </>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.buttonSecondary}
            disabled={loading}
            autoFocus
            onClick={this.onClaim}
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
  }
}

export default withStyles(styles)(WithdrawRewardsModal);
