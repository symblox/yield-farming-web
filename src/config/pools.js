import env from "./env";
import getTokens from "./tokens";
const config = env;
const tokens = getTokens();

//If syx is a tradable token of the pool, it is defined to erc20Address2
//If vlx is a tradable token of the pool, it is defined to erc20Address

let vlxSyxPool = {
  id: "SYX2/VLX",
  featured: false,
  name: "VLX",
  address: config.vlxSyxBpt,
  symbol: "BPT",
  type: "swap-native",
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["VLX"], tokens["SYX"]],
  tokens: ["SYX", "VLX"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  erc20Address: config.wvlx,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 18,
  erc20Address2: config.syx,
  erc20ABI2: config.syxABI,
  erc20Decimals2: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

//new pool type
let vlxSyxPool2 = {
  id: "SYX2/VLX",
  featured: true,
  name: "VLX",
  address: config.vlxSyxBpt2,
  symbol: "BPT",
  type: "swap-native",
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["VLX"], tokens["SYX"]],
  tokens: ["SYX", "VLX"],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  erc20Address: config.wvlx,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 18,
  erc20Address2: config.syx,
  erc20ABI2: config.syxABI,
  erc20Decimals2: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let svlxSyxPool = {
  id: "SYX2/SVLX",
  featured: true,
  name: "SVLX",
  address: config.svlxSyxBpt,
  symbol: "BPT",
  type: "swap",
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["SVLX"], tokens["SYX"]],
  tokens: ["SYX", "SVLX"],
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  erc20Address: config.svlx,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 18,
  erc20Address2: config.syx,
  erc20ABI2: config.syxABI,
  erc20Decimals2: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let usdtSyxPool = {
  id: "SYX2/USDT",
  featured: false,
  name: "USDT",
  address: config.usdtSyxBpt,
  symbol: "BPT",
  type: "swap",
  referral: true,
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["USDT"], tokens["SYX"]],
  tokens: ["SYX", "USDT"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  erc20Address: config.usdt,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 6,
  erc20Address2: config.syx,
  erc20ABI2: config.syxABI,
  erc20Decimals2: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

//new pool type
let usdtSyxPool2 = {
  id: "SYX2/USDT",
  featured: true,
  name: "USDT",
  address: config.usdtSyxBpt2,
  symbol: "BPT",
  type: "swap",
  referral: false,
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["USDT"], tokens["SYX"]],
  tokens: ["SYX", "USDT"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  erc20Address: config.usdt,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 6,
  erc20Address2: config.syx,
  erc20ABI2: config.syxABI,
  erc20Decimals2: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let vlxUsdtPool = {
  id: "USDT/VLX",
  featured: false,
  name: "VLX",
  address: config.vlxUsdtBpt,
  symbol: "BPT",
  type: "swap-native",
  referral: true,
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["VLX"], tokens["USDT"]],
  tokens: ["USDT", "VLX"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  erc20Address: config.wvlx,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 18,
  erc20Address2: config.usdt,
  erc20ABI2: config.erc20ABI,
  erc20Decimals2: 6,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let vlxEthPool = {
  id: "ETH/VLX",
  featured: false,
  name: "VLX",
  address: config.vlxEthBpt,
  symbol: "BPT",
  type: "swap-native",
  referral: false,
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["VLX"], tokens["ETH"]],
  tokens: ["ETH", "VLX"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  erc20Address: config.wvlx,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 18,
  erc20Address2: config.weth,
  erc20ABI2: config.erc20ABI,
  erc20Decimals2: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let ethSyxPool = {
  id: "SYX2/ETH",
  featured: false,
  name: "ETH",
  address: config.ethSyxBpt,
  symbol: "BPT",
  type: "swap",
  referral: false,
  depositModal: "singleDeposit",
  withdrawModal: "singleWithdraw",
  rewardToken: tokens["SYX"],
  supportTokens: [tokens["SYX"], tokens["ETH"]],
  tokens: ["SYX", "ETH"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  erc20Address: config.weth,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 18,
  erc20Address2: config.syx,
  erc20ABI2: config.erc20ABI,
  erc20Decimals2: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

//new pool type
let ethSyxPool2 = {
  id: "SYX2/ETH",
  featured: true,
  name: "ETH",
  address: config.ethSyxBpt2,
  symbol: "BPT",
  type: "swap",
  referral: false,
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: tokens["SYX"],
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [tokens["SYX"], tokens["ETH"]],
  tokens: ["SYX", "ETH"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  erc20Address: config.weth,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 18,
  erc20Address2: config.syx,
  erc20ABI2: config.erc20ABI,
  erc20Decimals2: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

function getPools() {
  // assign pool IDs to the pools
  if (process.env.REACT_APP_ENV === "production") {
    [
      vlxSyxPool.index,
      vlxUsdtPool.index,
      usdtSyxPool.index,
      ethSyxPool.index,
      vlxEthPool.index,
    ] = [0, 1, 2, 3, 4];
    return [vlxSyxPool, vlxUsdtPool, usdtSyxPool, ethSyxPool, vlxEthPool];
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
