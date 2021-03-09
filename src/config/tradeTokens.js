import getTokens from "./tokens";
const tokens = getTokens();

function getTradeTokens() {
  if (process.env.REACT_APP_ENV === "production") {
    return [
      tokens["VLX"],
      tokens["SVLX"],
      tokens["SYX"],
      tokens["USDT"],
      tokens["ETH"],
    ];
  } else {
    return [
      tokens["VLX"],
      tokens["SVLX"],
      tokens["SYX"],
      tokens["USDT"],
      tokens["ETH"],
    ];
  }
}
export default getTradeTokens;
