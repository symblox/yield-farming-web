import env from "./env";
const config = env;

function getTokens() {
  return {
    SYX: {
      symbol: "SYX",
      name: "SYX",
      address: config.syx,
      abi: config.syxABI,
      decimals: 18,
    },
    BNB: {
      symbol: "BNB",
      name: "BNB",
      address: config.wbnb,
      abi: config.erc20ABI,
      decimals: 18,
    },
    WBNB: {
      symbol: "WBNB",
      name: "WBNB",
      address: config.wbnb,
      abi: config.erc20ABI,
      decimals: 18,
    },
    "syUSD/BNB-LP": {
      symbol: "syUSD/BNB-LP",
      name: "syUSD/BNB-LP",
      address: config.bnbSyUSDPoolMutil,
      abi: config.erc20ABI,
      decimals: 18,
    },
    "syUSD/SYX-LP": {
      symbol: "syUSD/SYX-LP",
      name: "syUSD/SYX-LP",
      address: config.syxSyUSDPoolMutil,
      abi: config.erc20ABI,
      decimals: 18,
    },
  };
}
export default getTokens;
