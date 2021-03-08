import abis from "./abis";

let requiredNetworkId = process.env.REACT_APP_ENV === "production" ? 106 : 111;

const rpcUrls = {
  111: "https://explorer.testnet.veladev.net/rpc",
  106: "https://rpc.symblox.net:8080/",
};

const browserUrls = {
  111: "https://explorer.testnet.veladev.net",
  106: "https://explorer.velas.com",
};

console.log("REACT_APP_ENV: ", process.env.REACT_APP_ENV);

function env() {
  if (process.env.REACT_APP_ENV === "production") {
    return {
      requiredNetworkId,
      requiredNetwork: "VELAS Mainnet",
      multicall: "0xB417D3E1B9A6E07e4fd849Ad45564Cf63e87A538",
      rpcUrl: "https://explorer.velas.com/rpc",
      browser: browserUrls[requiredNetworkId],
      minReservedAmount: 0.1, //18 wei，The minimum reserved amount of native tokens, so as not to pay the handling fee
      weth: "0x380f73bad5e7396b260f737291ae5a8100baabcd",
      usdt: "0x4b773e1ae1baa4894e51cc1d1faf485c91b1012f",
      syx: "0x01Db6ACFA20562Ba835aE9F5085859580A0b1386",
      oldSyx: "0x2de7063fe77aAFB5b401d65E5A108649Ec577170",
      wvlx: "0x2b1aBEb48f875465bf0D3A262a2080ab1C7A3E39",
      bptFactory: "0xC850E858367971B11ed74d97AA0C87ec85a03Ea1",
      vlxSyxBpt: "0x7bD57dCA1C703E068F4A0A3Bc506612372eF7dC6",
      vlxUsdtBpt: "0x1fA22A3F8B36B5b24deE233fdaC1114E930b9Cda",
      usdtSyxBpt: "0xf02F3959C0B52a337D0C662a123103618fd38F74",
      ethSyxBpt: "0x4F5D1990F667bAa8f5d5A76282707508AD2DEF05",
      vlxEthBpt: "0xAa47D5475D89a837d61e0a33ce32Ac31D3aAf0dd",
      vlxSyxMultiBpt: "0x7Ac28A9FFd42c29d9ec8302898e7353b30740DE1",
      usdtSyxMultiBpt: "0xd47DB7DF9078d3c5d5029b5E88144a0be29E4084",
      ethSyxMultiBpt: "0x616B7e367612D81512608a8D552E991847a981c8",
      connectorFactory: "0xBE6A1f0b0236BB39E0b16B0fc5cb6C291fFdFC2E", //no set governor
      bptConnector: "0xC37673764FEd37EB3c3f3C46D696B41f322123C6", //BptReferralConnector
      rewardPool: "0x9fCdD9eb40CaC90A5C385C9Ef37b48E847B178a3",
      // wvlxConnector: "0xf6182f2924065343947E7F12ec4a989Fd9D2A9Ec",
      timelock: "0x2aCC7A7279394bB9AC0265249E6d78d5B7012465",
      governor: "0x7DF0c84197D35356b1d4F29912082371f3469fF5",
      devFund: "0x17d8A87BF9F3f8ca7469D576d958bE345c1D9D5D",
      erc20ABI: abis.erc20ABI,
      rewardPoolABI: abis.rewardPoolABI,
      bptABI: abis.bptABI,
      syxABI: abis.syxABI,
      bptRefConnectorABI: abis.bptRefConnectorABI,
      wvlxConnectorABI: abis.wvlxConnectorABI,
      connectorFactoryABI: abis.connectorFactoryABI,
      secPerBlock: 5,
    };
  } else {
    return {
      requiredNetworkId,
      requiredNetwork: "VELAS Testnet",
      multicall: "0x4fd276206056D994D8F52053679CcaAA1709597e",
      bRegistry: "0xc84Bccf70c5bCd690EAD8917E832EE94Df4a5690",
      exchangeProxy: "0xC7a6Fc1DC99ff6E16f23091053eC1a21e08F5E1d",
      rpcUrl: rpcUrls[requiredNetworkId],
      browser: browserUrls[requiredNetworkId],
      minReservedAmount: 0.1, //18 wei，The minimum reserved amount of native tokens, so as not to pay the handling fee
      rewardPool: "0x5EddDA6482029E466F296AeD75cFcc624245bB80",
      connectorFactory: "0xaD96a8bd3150C0D4371a217f6E5088207c18C0B1",
      bptConnector: "0xC2598222A80b99f425c958aF3be446e5D25D3929", //BptReferralConnector
      bptFactory: "0x35E1B850033BfFCf0b33A3d486F950d375bD32A1",
      wvlx: "0x78f18612775a2c54efc74c2911542aa034fe8d3f",
      svlx: "0xE5D72F0506bC6C0701E701caC1e255D16801B5C0",
      weth: "0x41e7fb07236a736e06b3460e458a5b827e552521",
      syx: "0x946b06FE625aB1AaA27294F8ed09713C8812626c",
      usdt: "0xA23bAeA56de679FD1baf200E92a75ac8d5eeBc8A",
      oldSyx: "0xC20932B245840CA1C6F8c9c90BDb2F4E0289DE48",
      oldSyx2: "0x28a6312D786e9d7a78637dD137AbeF5332F3b2Aa",
      vlxSyxMultiBpt: "0x09F8eca78684b49ea207c8015635F5467CA63489",
      // usdtSyxMultiBpt: "0x863ad197c17f2522165db35cC3fE8F961d69DE35",
      // ethSyxMultiBpt: "0x38FD7B48ADe8E00b18a0c10fD9C395e4C936100f",
      // vlxSyxBpt: "0x3FBaf23119a999336bb9bB0744bcC6f60540B4B4",
      // vlxSyxMultiBpt: "0xFf5508e0DEFF2723a354bf1399815B8eA9421a30",
      // vlxUsdtBpt: "0x4b067bc68b54133fe64832affbab3d7a6d361ba5",
      // svlxSyxBpt: "0xaC0cb216D5c3ED83c76a8b6832CE8ebe4aa6E0B2",
      // usdtSyxBpt: "0x53c74185bad56d362e0932fdfb4cea0bea5dccff",
      // usdtSyxMultiBpt: "0x90b0b69FE53de137416CDf091AA2ec419E90C626",
      // ethSyxBpt: "0xa64b215b3b532cf7c4d1e384eff15346f0f5681c",
      // ethSyxMultiBpt: "0xE37FdfF908CBB6Fa733076ab2153bF5A3517F985",
      // vlxEthBpt: "0xCF433aBcB66E8085744Adc97D65E38BFd5Ebbc15",
      // pvlxSyxBpt: "0xc0dcFf3CA8FCBe9ee1f382D9C428d59fea91ABEA",
      timelock: "0xbC3E1c115412bd7287c0B7A602DDBe875dCDcF90",
      governor: "0x130D37E6BE101C1F4950Dbf79C638322C55BC185",
      devFund: "0x17d8A87BF9F3f8ca7469D576d958bE345c1D9D5D",
      exchangeAbi: abis.exchangeProxyAbi,
      erc20ABI: abis.erc20ABI,
      rewardPoolABI: abis.rewardPoolABI,
      bptABI: abis.bptABI,
      syxABI: abis.syxABI,
      svlxABI: abis.svlxABI,
      bptRefConnectorABI: abis.bptRefConnectorABI,
      wvlxConnectorABI: abis.wvlxConnectorABI,
      connectorFactoryABI: abis.connectorFactoryABI,
      stakingAuRaABI: abis.stakingAuRaABI,
      secPerBlock: 15,
    };
  }
}
export default env();
