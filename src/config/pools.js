import env from "./env";
import getTokens from "./tokens";
const config = env;
const tokens = getTokens();

let vlxSyxPool = {
  id: "SYX/VLX",
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
  poolABI: config.rewardPoolABI
};

//new pool type
let vlxSyxPool2 = {
  id: "SYX/VLX",
  featured: false,
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
  poolABI: config.rewardPoolABI
};

let usdtSyxPool = {
  id: "SYX/USDT",
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
  poolABI: config.rewardPoolABI
};

let svlxSyxPool2 = {
  id: "SYX/SVLX",
  featured: false,
  address: config.svlxSyxMultiBpt,
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
  poolABI: config.rewardPoolABI
};

//new pool type
let usdtSyxPool2 = {
  id: "SYX/USDT",
  featured: false,
  address: config.usdtSyxMultiBpt,
  symbol: "BPT",
  type: "swap",
  referral: false,
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["SYX"], tokens["USDT"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI
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
  poolABI: config.rewardPoolABI
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
  poolABI: config.rewardPoolABI
};

let ethSyxPool = {
  id: "SYX/ETH",
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
  poolABI: config.rewardPoolABI
};

//new pool type
let ethSyxPool2 = {
  id: "SYX/ETH",
  featured: false,
  address: config.ethSyxMultiBpt,
  symbol: "BPT",
  type: "swap",
  referral: false,
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["ETH"], tokens["SYX"]],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI
};

function getPools() {
  // assign pool IDs to the pools
  if (process.env.REACT_APP_ENV === "production") {
    [vlxSyxPool2.index, svlxSyxPool2.index, usdtSyxPool2.index, ethSyxPool2.index] = [0, 1, 2, 3];
    return [vlxSyxPool2, svlxSyxPool2, usdtSyxPool2, ethSyxPool2];
  } else {
    [vlxSyxPool2.index, ethSyxPool2.index, usdtSyxPool2.index] = [0, 1, 2];
    return [vlxSyxPool2, ethSyxPool2, usdtSyxPool2];
  }
}
export default getPools;
