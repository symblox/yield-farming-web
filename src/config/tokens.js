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
    "SYX-VELAS": {
      symbol: "SYX-VELAS",
      name: "SYX-VELAS",
      address: config.vSyx,
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
