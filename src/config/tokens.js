import env from "./env";
const config = env;

function getTokens() {
  return {
    SYX: {
      symbol: "SYX",
      name: "SYX3",
      address: config.syx,
      abi: config.syxABI,
      decimals: 18,
    },
    USDT: {
      symbol: "USDT",
      name: "USDT",
      address: config.usdt,
      abi: config.erc20ABI,
      decimals: 6,
    },
    ETH: {
      symbol: "ETH",
      name: "ETH",
      address: config.weth,
      abi: config.erc20ABI,
      decimals: 18,
    },
    SVLX: {
      symbol: "SVLX",
      name: "SVLX",
      address: config.svlx,
      abi: config.erc20ABI,
      decimals: 18,
    },
    BNB: {
      symbol: "BNB",
      name: "BNB",
      address: config.wbnb,
      abi: config.erc20ABI,
      decimals: 18,
    },
    CakeLP: {
      symbol: "Cake-LP",
      name: "Cake-LP",
      address: config.bnbSyxPoolMutil,
      abi: config.erc20ABI,
      decimals: 18,
    },
  };
}
export default getTokens;
