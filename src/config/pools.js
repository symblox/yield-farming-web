import env from "./env";
import getTokens from "./tokens";
const config = env;
const tokens = getTokens();

// let seedPool = {
//   id: "WBNB",
//   type: "seed",
//   featured: true,
//   address: config.wbnb,
//   symbol: "WBNB",
//   rewardToken: tokens["SYX"],
//   supportTokens: [tokens["WBNB"]],
//   abi: config.erc20ABI,
//   decimals: 18,
//   poolAddress: config.rewardPool,
//   poolABI: config.rewardPoolABI,
// };

//new pool type
let bnbSyUSDPoolMutil = {
  id: "syUSD/BNB-LP",
  featured: true,
  address: config.bnbSyUSDPoolMutil,
  symbol: "syUSD/BNB-LP",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["syUSD/BNB-LP"]],
  abi: config.pancakePairAbi,
  decimals: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

function getPools() {
  // assign pool IDs to the pools
  if (process.env.REACT_APP_ENV === "production") {
  } else {
    [bnbSyUSDPoolMutil.index] = [0];
    return [bnbSyUSDPoolMutil];
  }
}
export default getPools;
