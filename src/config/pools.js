import env from "./env";
const config = env;
//If syx is a tradable token of the pool, it is defined to erc20Address2
//If vlx is a tradable token of the pool, it is defined to erc20Address
let seedPool = {
  id: "VLX",
  featured: true,
  name: "VLX",
  website: "Reward Pool",
  address: config.wvlx,
  symbol: "VLX",
  ROI: "DF",
  type: "seed",
  tokens: ["VLX"],
  abi: config.erc20ABI,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 18,
  decimals: 18,
  entryContractABI: config.wvlxConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let vlxSyxPool = {
  id: "SYX2/VLX",
  featured: false,
  name: "VLX",
  website: "Reward Pool",
  address: config.vlxSyxBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap-native",
  tokens: ["SYX", "VLX"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
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
  website: "Reward Pool",
  address: config.vlxSyxMultiBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap-native",
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: {
    symbol: "SYX",
    name: "SYX2",
    address: config.syx,
    abi: config.syxABI,
    decimals: 18,
  },
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [
    {
      symbol: "VLX",
      name: "VLX",
      address: config.wvlx,
      abi: config.erc20ABI,
      decimals: 18,
    },
    {
      symbol: "SYX",
      name: "SYX2",
      address: config.syx,
      abi: config.syxABI,
      decimals: 18,
    },
  ],
  tokens: ["SYX", "VLX"],
  abi: config.bptABI,
  decimals: 18,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
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
  website: "Reward Pool",
  address: config.svlxSyxBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap",
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: {
    symbol: "SYX",
    name: "SYX2",
    address: config.syx,
    abi: config.syxABI,
    decimals: 18,
  },
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [
    {
      symbol: "SVLX",
      name: "SVLX",
      address: config.svlx,
      abi: config.erc20ABI,
      decimals: 18,
    },
    {
      symbol: "SYX",
      name: "SYX2",
      address: config.syx,
      abi: config.syxABI,
      decimals: 18,
    },
  ],
  tokens: ["SYX", "SVLX"],
  abi: config.bptABI,
  decimals: 18,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
  erc20Address: config.svlx,
  erc20ABI: config.erc20ABI,
  erc20Decimals: 18,
  erc20Address2: config.syx,
  erc20ABI2: config.syxABI,
  erc20Decimals2: 18,
  poolAddress: config.rewardPool,
  poolABI: config.rewardPoolABI,
};

let pvlxSyxPool = {
  id: "SYX2/pVLX",
  featured: false,
  name: "pVLX",
  website: "Reward Pool",
  address: config.pvlxSyxBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap",
  tokens: ["SYX", "pVLX"], //reward token must in first
  abi: config.bptABI,
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
  decimals: 18,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
  erc20Address: config.pVlx,
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
  website: "Reward Pool",
  address: config.usdtSyxBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap",
  referral: true,
  tokens: ["SYX", "USDT"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
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
  website: "Reward Pool",
  address: config.usdtSyxMultiBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap",
  referral: false,
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: {
    symbol: "SYX",
    name: "SYX2",
    address: config.syx,
    abi: config.syxABI,
    decimals: 18,
  },
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [
    {
      symbol: "USDT",
      name: "USDT",
      address: config.usdt,
      abi: config.erc20ABI,
      decimals: 6,
    },
    {
      symbol: "SYX",
      name: "SYX2",
      address: config.syx,
      abi: config.syxABI,
      decimals: 18,
    },
  ],
  tokens: ["SYX", "USDT"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
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
  website: "Reward Pool",
  address: config.vlxUsdtBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap-native",
  referral: true,
  tokens: ["USDT", "VLX"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
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
  website: "Reward Pool",
  address: config.vlxEthBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap-native",
  referral: false,
  tokens: ["ETH", "VLX"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
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
  website: "Reward Pool",
  address: config.ethSyxBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap",
  referral: false,
  tokens: ["SYX", "ETH"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
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
  website: "Reward Pool",
  address: config.ethSyxMultiBpt,
  symbol: "BPT",
  ROI: "DF",
  type: "swap",
  referral: false,
  depositModal: "multiDeposit",
  withdrawModal: "multiWithdraw",
  rewardToken: {
    symbol: "SYX",
    name: "SYX2",
    address: config.syx,
    abi: config.syxABI,
    decimals: 18,
  },
  //The order of tokens needs to be consistent with the order of tokens in bpt, otherwise the order of maxAmountsIn in the multiDeposit method needs to be adjusted
  supportTokens: [
    {
      symbol: "ETH",
      name: "ETH",
      address: config.weth,
      abi: config.erc20ABI,
      decimals: 18,
    },
    {
      symbol: "SYX",
      name: "SYX2",
      address: config.syx,
      abi: config.syxABI,
      decimals: 18,
    },
  ],
  tokens: ["SYX", "ETH"], //reward token must in first
  abi: config.bptABI,
  decimals: 18,
  rewardsAddress: config.syx,
  rewardsABI: config.syxABI,
  rewardsSymbol: "SYX",
  entryContractABI: config.bptRefConnectorABI,
  entryContractFactoryAddress: config.connectorFactory,
  entryContractFactoryABI: config.connectorFactoryABI,
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
