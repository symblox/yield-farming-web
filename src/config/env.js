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
      //rewardPool: "0x00A9368df04aBfb9CE9e42FA9062EE7E59aF59C8",
      rewardPool: "0xF30dAcf6E9469ffCF4Dbe3d484C9E62CaA0f5A5f",
      //connectorFactory: "0x1b91eC3c5b8FC7f98ab3df0e3C0d5Bdc39769d83",
      connectorFactory: "0x01d81265F560Ecf64609997De47077c1bd7BE5bE",
      bptConnector: "0xd4Dc89F0afaaCFD81292E5A6deA95E7183c8a809", //BptReferralConnector
      bptFactory: "0x3eF481a34533cb34A8e74Ec02D8D739d983F5ceb",
      wvlx: "0x78f18612775a2c54efc74c2911542aa034fe8d3f",
      svlx: "0x17aCFfF64385FaeB974e618E29E23952775527b2",
      weth: "0x41e7fb07236a736e06b3460e458a5b827e552521",
      syx: "0x81e67f3741BB8A7d148CCc2Ef73e9A7459EA6357",
      usdt: "0xA23bAeA56de679FD1baf200E92a75ac8d5eeBc8A",
      //oldSyx: "0xC20932B245840CA1C6F8c9c90BDb2F4E0289DE48",
      oldSyx: "0x28a6312D786e9d7a78637dD137AbeF5332F3b2Aa",
      pVlx: "0x3724d456d7D02327A06B6a12DB429D83A2617c9B",
      vlxSyxMultiBpt: "0xd9AbFbA962570d9679364cD66F20Db131b2d7ee6",
      usdtSyxMultiBpt: "0x6bd8923cDeaA81F559B754c120A6f1B6F4bb796F",
      ethSyxMultiBpt: "0x285f6f75e7b230c906ef08f499a6bbfbf90c74c2",
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
      devFund: "0x17d8A87BF9F3f8ca7469D576d958bE345c1D9D5D",
      exchangeAbi: abis.exchangeProxyAbi,
      erc20ABI: abis.erc20ABI,
      rewardPoolABI: abis.rewardPoolABI,
      bptABI: abis.bptABI,
      syxABI: abis.syxABI,
      bptRefConnectorABI: abis.bptRefConnectorABI,
      wvlxConnectorABI: abis.wvlxConnectorABI,
      connectorFactoryABI: abis.connectorFactoryABI,
      secPerBlock: 5,
    };
  }
}
export default env();
