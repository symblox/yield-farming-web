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
      requiredNetwork: "VELAS Testnet",
      multicall: "0xb5c307d583F90bE6996A4524D665b033D1BEf751",
      rpcUrl: rpcUrls[requiredNetworkId],
      browser: browserUrls[requiredNetworkId],
      minReservedAmount: 0.1, //18 wei，The minimum reserved amount of native tokens, so as not to pay the handling fee
      rewardPool: "0x63eB6B51530FdF84aFC709F9591C4128D5a827C2",
      syx: "0xd2f83494cd97e61f117015ba79cbf8f42fd13634",
      wbnb: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
      bnbSyxPoolMutil: "0x59aa824ac262d96989c04ac0bdbdc9a52e77cc63",
      devFund: "0x17d8A87BF9F3f8ca7469D576d958bE345c1D9D5D",
      erc20ABI: abis.erc20ABI,
      rewardPoolABI: abis.rewardPoolABI,
      syxABI: abis.erc20ABI,
      secPerBlock: 3,
    };
  }
}
export default env();
