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
      rewardPool: "0x1826D28feD4C28447E11919dF1CE203A4a02cce5",
      rewardEscrow: "0xd793E6bA9b30E237374dEb1975bae19e689AeaC8",
      syx: "0x909cE73d92a7e89D31Ac23E401BE65C538bD4355",
      wbnb: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
      syxSyUSDPoolMutil: "0x984dc9f92bb168b47bae56c76f513b54be6bc786",
      bnbSyUSDPoolMutil: "0x414990edef9393e64e000c656447d7993b8fd7b2",
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
