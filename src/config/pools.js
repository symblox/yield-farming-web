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

let seedSyxPool = {
  id: "SYX-VELAS",
  type: "seed",
  featured: true,
  address: config.vSyx,
  symbol: "SYX-VELAS",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["SYX-VELAS"]],
  abi: config.erc20ABI,
  decimals: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

//new pool type
let bnbSyxPoolMutil = {
  id: "SYX/BNB-LP",
  featured: true,
  address: config.bnbSyxPoolMutil,
  symbol: "SYX/BNB-LP",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["SYX/BNB-LP"]],
  abi: config.pancakePairAbi,
  decimals: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

function getPools() {
  // assign pool IDs to the pools
  if (process.env.REACT_APP_ENV === "production") {
  } else {
    [bnbSyxPoolMutil.index, seedPool.index, seedSyxPool.index] = [0, 1, 2];
    return [bnbSyxPoolMutil, seedPool, seedSyxPool];
  }
}
export default getPools;
