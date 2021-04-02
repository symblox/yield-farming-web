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
      rewardPool: "0x5E39cBDcB852b8C2C83ec676F60Db5520936C80d",
      syx: "0xd31216D08002f88c7aFE99F58245F05C8b59B046",
      wbnb: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
      bnbSyUSDPoolMutil: "0x683368e9d7583a0d14e85c27c6ac1440456ed4ca",
      devFund: "0x17d8A87BF9F3f8ca7469D576d958bE345c1D9D5D",
      pancakePairAbi: abis.pancakePairAbi,
      erc20ABI: abis.erc20ABI,
      rewardPoolABI: abis.rewardPoolABI,
      syxABI: abis.erc20ABI,
      secPerBlock: 3,
    };
  }
}
export default env();
