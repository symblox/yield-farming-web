import getTokens from "./tokens";
const tokens = getTokens();

function getTradeTokens() {
  if (process.env.REACT_APP_ENV === "production") {
  } else {
    return [
      tokens["BNB"],
      // tokens["WBNB"],
      tokens["SYX"],
      tokens["syUSD/BNB-LP"],
      tokens["syUSD/SYX-LP"],
    ];
  }
}
export default getTradeTokens;
