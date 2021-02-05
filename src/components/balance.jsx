import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import NumberFormat from "react-number-format";

const useStyles = makeStyles({
  root: {
    display: "flex",
    fontFamily: "Oswald",
    fontSize: "20px",
    lineHeight: "24px",
    color: "#C0C1CE",
    marginRight: "32px",
    marginLeft: "0px",
    "& img": {
      width: "24px",
      height: "24px",
      marginRight: "8px",
      verticalAlign: "bottom",
    },
    "& span": {
      color: "#454862",
      marginRight: "8px",
    },
  },
});

export default function Balance(props) {
  const classes = useStyles(props);
  const { name, symbol, balance } = props;
  const tokenIcon = "/" + name + ".png";

  return (
    <div className={classes.root}>
      <img src={tokenIcon} alt="" />
      <NumberFormat
        style={{ whiteSpace: "nowrap" }}
        value={parseFloat(balance || 0).toLocaleString(undefined, {
          maximumFractionDigits: 10,
        })}
        defaultValue={"-"}
        displayType={"text"}
        thousandSeparator={true}
        isNumericString={true}
        suffix={symbol}
        decimalScale={4}
        fixedDecimalScale={true}
      />
    </div>
  );
}
