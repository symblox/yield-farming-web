import env from "./env";
import getTokens from "./tokens";
const config = env;
const tokens = getTokens();

let vlxSyxPool = {
  id: "SYX2/VLX",
  featured: false,
  address: config.vlxSyxBpt,
  symbol: "BPT",
  type: "swap-native",
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["VLX"], tokens["SYX"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

//new pool type
let vlxSyxPool2 = {
  id: "SYX2/VLX",
  featured: true,
  address: config.vlxSyxMultiBpt,
  symbol: "BPT",
  type: "swap-native",
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["VLX"], tokens["SYX"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let svlxSyxPool = {
  id: "SYX2/SVLX",
  featured: true,
  address: config.svlxSyxBpt,
  symbol: "BPT",
  type: "swap",
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["SVLX"], tokens["SYX"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let usdtSyxPool = {
  id: "SYX2/USDT",
  featured: false,
  address: config.usdtSyxBpt,
  symbol: "BPT",
  type: "swap",
  referral: true,
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["USDT"], tokens["SYX"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

//new pool type
let usdtSyxPool2 = {
  id: "SYX2/USDT",
  featured: true,
  address: config.usdtSyxMultiBpt,
  symbol: "BPT",
  type: "swap",
  referral: false,
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["USDT"], tokens["SYX"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let vlxUsdtPool = {
  id: "USDT/VLX",
  featured: false,
  address: config.vlxUsdtBpt,
  symbol: "BPT",
  type: "swap-native",
  referral: true,
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["VLX"], tokens["USDT"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let vlxEthPool = {
  id: "ETH/VLX",
  featured: false,
  address: config.vlxEthBpt,
  symbol: "BPT",
  type: "swap-native",
  referral: false,
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["VLX"], tokens["ETH"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let ethSyxPool = {
  id: "SYX2/ETH",
  featured: false,
  address: config.ethSyxBpt,
  symbol: "BPT",
  type: "swap",
  referral: false,
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["SYX"], tokens["ETH"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

//new pool type
let ethSyxPool2 = {
  id: "SYX2/ETH",
  featured: true,
  address: config.ethSyxMultiBpt,
  symbol: "BPT",
  type: "swap",
  referral: false,
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["SYX"], tokens["ETH"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

function getPools() {
  // assign pool IDs to the pools
  if (process.env.REACT_APP_ENV === "production") {
    [
      vlxSyxPool2.index,
      usdtSyxPool2.index,
      ethSyxPool2.index,
      vlxSyxPool.index,
      vlxUsdtPool.index,
      usdtSyxPool.index,
      ethSyxPool.index,
      vlxEthPool.index,
    ] = [5, 6, 7, 0, 1, 2, 3, 4];
    return [
      vlxSyxPool2,
      usdtSyxPool2,
      ethSyxPool2,
      vlxSyxPool,
      vlxUsdtPool,
      usdtSyxPool,
      ethSyxPool,
      vlxEthPool,
    ];
  } else {
    [
      vlxSyxPool2.index,
      ethSyxPool2.index,
      usdtSyxPool2.index,
      svlxSyxPool.index,
      vlxUsdtPool.index,
      usdtSyxPool.index,
      ethSyxPool.index,
      vlxEthPool.index,
      vlxSyxPool.index,
    ] = [6, 7, 8, 10, 1, 2, 3, 4, 0];
    return [
      vlxSyxPool2,
      ethSyxPool2,
      usdtSyxPool2,
      svlxSyxPool,
      vlxUsdtPool,
      usdtSyxPool,
      ethSyxPool,
      vlxEthPool,
      vlxSyxPool,
    ];
  }
}
export default getPools;
