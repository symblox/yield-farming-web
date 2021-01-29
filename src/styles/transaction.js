const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    // fontFamily: "Noto Sans SC",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "28px",
    lineHeight: "39px",
    textAlign: "center",
    color: "#1E304B",
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
    minWidth: "115px",
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
  containedButton: {
    borderRadius: "6px",
    margin: "0 6px",
  },
  select: {
    borderRadius: "6px",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
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
  text: {
    // fontFamily: "Noto Sans SC",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: "16px",
    lineHeight: "25px",
    color: "#ACAEBC",
  },
  rightText: {
    float: "right",
    // fontFamily: "Noto Sans SC",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "22px",
    textAlign: "right",
    color: "#4E5B70",
  },
  textPrimy: {
    fontWeight: 500,
    color: "#4E5B70",
  },
  icon: {
    width: "24px",
    height: "24px",
    display: "inline-block",
    margin: "auto 6px",
    verticalAlign: "middle",
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
  maxBtn: {
    padding: "10px 18px",
  },
  textAlignRight: {
    textAlign: "right !important",
  },
});

export default styles;
