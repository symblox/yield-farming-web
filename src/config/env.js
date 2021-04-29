import abis from "./abis";

let requiredNetworkId = process.env.REACT_APP_ENV === "production" ? 56 : 97;

const rpcUrls = {
  97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  56: "https://bsc-dataseed.binance.org/",
};

const browserUrls = {
  97: "https://testnet.bscscan.com/",
  56: "https://bscscan.com/",
};

console.log("REACT_APP_ENV: ", process.env.REACT_APP_ENV);

function env() {
  if (process.env.REACT_APP_ENV === "production") {
    return {};
  } else {
    return {
      requiredNetworkId,
      requiredNetwork: "BSC Testnet",
      multicall: "0xb5c307d583F90bE6996A4524D665b033D1BEf751",
      rpcUrl: rpcUrls[requiredNetworkId],
      browser: browserUrls[requiredNetworkId],
      liquidityPageUrl:
        "https://pancake-swap-git-symblox-symblox-dev.vercel.app/#/pool",
      swapPageUrl:
        "https://pancake-swap-git-symblox-symblox-dev.vercel.app/#/swap",
      bridgeUrl: "https://dev.x.symblox.io/",
      minReservedAmount: 0.1, //18 wei，The minimum reserved amount of native tokens, so as not to pay the handling fee
      rewardPool: "0xE40f1E81bdB678829a4B28F45d761ac1B4a6a5A1",
      rewardEscrow: "0xaC16eF7BB6232a957Ec72770fcD65B0d4edb81dE",
      syx: "0x47c11E73FaeA96F981c44c8B068a328f3a83d8e9",
      wbnb: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
      bnbSyUSDPoolMutil: "0x191b2819b2d8a0e5a5d7510564f421e520b33dde",
      syxSyUSDPoolMutil: "0x47659f52e2cf6520d82472d0f7508f220c63c753",
      devFund: "0x17d8A87BF9F3f8ca7469D576d958bE345c1D9D5D",
      rewardEscrowAbi: abis.rewardEscrowAbi,
      pancakePairAbi: abis.pancakePairAbi,
      erc20ABI: abis.erc20ABI,
      rewardPoolABI: abis.rewardPoolABI,
      syxABI: abis.erc20ABI,
      secPerBlock: 3,
    };
  }
}
export default env();
