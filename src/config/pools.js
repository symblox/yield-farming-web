import env from "./env";
import getTokens from "./tokens";
const config = env;
const tokens = getTokens();

//new pool type
let bnbSyxPoolMutil = {
  id: "SYX3/BNB",
  featured: true,
  address: config.bnbSyxPoolMutil,
  symbol: "Cake-LP",
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["CakeLP"]],
  abi: config.erc20ABI,
  decimals: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

function getPools() {
  // assign pool IDs to the pools
  if (process.env.REACT_APP_ENV === "production") {
  } else {
    [bnbSyxPoolMutil.index] = [0];
    return [bnbSyxPoolMutil];
  }
}
export default getPools;
