import env from "./env";
import getTokens from "./tokens";
const config = env;
const tokens = getTokens();

let seedPool = {
  id: "WBNB",
  type: "seed",
  featured: true,
  address: config.wbnb,
  symbol: "WBNB",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["WBNB"]],
  abi: config.erc20ABI,
  decimals: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

//new pool type
let bnbSyxPoolMutil = {
  id: "SYX3/BNB",
  featured: true,
  address: config.bnbSyxPoolMutil,
  symbol: "Cake-LP",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["CakeLP"]],
  abi: config.pancakePairAbi,
  decimals: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

function getPools() {
  // assign pool IDs to the pools
  if (process.env.REACT_APP_ENV === "production") {
  } else {
    [bnbSyxPoolMutil.index, seedPool.index] = [0, 1];
    return [bnbSyxPoolMutil, seedPool];
  }
}
export default getPools;
