const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "28px",
    lineHeight: "39px",
    textAlign: "center",
    color: "#1E304B",
  },
  button: {
    background: "linear-gradient(135deg, #FF3A33 0%, #FC06C6 100%, #FF3A33)",
    borderRadius: "26px",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "20px",
    lineHeight: "34px",
    color: "#FFFFFF",
    paddingTop: "9px",
    height: "50px",
    minWidth: "115px",
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
  tokenBtn: {
    height: "47px",
    lineHeight: "47px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    textAlign: "center",
  },
});

export default styles;
