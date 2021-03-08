const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    textAlign: "center",
  },
  title: {
    color: "#ACAEBC",
  },
  icon: {
    width: "24px",
    height: "24px",
    display: "inline-block",
    margin: "auto 6px",
    verticalAlign: "middle",
  },
  downIcon: {
    width: "24px",
    height: "24px",
    display: "inline-block",
    margin: "auto 6px",
    verticalAlign: "middle",
    float: "right",
    marginTop: "12px",
    width: "12px",
  },
  mb16: {
    marginBottom: "16px",
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
  },
  maxBtn: {
    padding: "10px 18px",
  },
});

export default styles;
