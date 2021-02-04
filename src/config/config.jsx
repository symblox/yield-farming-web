import env from "./env";
import getPools from "./pools";
import getTokens from "./tokens";
import getTradeTokens from "./tradeTokens";

export default env;
export const pools = getPools();
export const tokens = getTokens();
export const tradeTokens = getTradeTokens();
export const tokensName = {
  syx: "SYX2",
  usdt: "USDT",
  vlx: "VLX",
  eth: "ETH",
  pvlx: "pVlx",
  svlx: "SVLX",
};
