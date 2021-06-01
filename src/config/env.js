import abis from "./abis";

let requiredNetworkId = process.env.REACT_APP_ENV === "production" ? 106 : 111;

const rpcUrls = {
  111: "https://explorer.testnet.veladev.net/rpc",
  106: "https://rpc.symblox.net:8080/"
};

const browserUrls = {
  111: "https://explorer.testnet.veladev.net",
  106: "https://explorer.velas.com"
};

console.log("REACT_APP_ENV: ", process.env.REACT_APP_ENV);

function env() {
  if (process.env.REACT_APP_ENV === "production") {
    return {
      requiredNetworkId,
      requiredNetwork: "VELAS Mainnet",
      multicall: "0xB417D3E1B9A6E07e4fd849Ad45564Cf63e87A538",
      bRegistry: "0x0cef9adB991dDe1930F458cD998E52fa352cD57B",
      exchangeProxy: "0xDb2ef43eB626AF1000f743a60b877e03f98561d9",
      rpcUrl: "https://explorer.velas.com/rpc",
      browser: browserUrls[requiredNetworkId],
      minReservedAmount: 0.1, //18 wei，The minimum reserved amount of native tokens, so as not to pay the handling fee
      weth: "0x380f73bad5e7396b260f737291ae5a8100baabcd",
      usdt: "0x4b773e1ae1baa4894e51cc1d1faf485c91b1012f",
      syx: "0xD0CB9244844F3E11061fb3Ea136Aab3a6ACAC017",
      oldSyx: "0x2de7063fe77aAFB5b401d65E5A108649Ec577170",
      oldSyx2: "0x01Db6ACFA20562Ba835aE9F5085859580A0b1386",
      wvlx: "0x2b1aBEb48f875465bf0D3A262a2080ab1C7A3E39",
      svlx: "0xaADBAa6758fC00dEc9B43A0364a372605D8f1883",
      bptFactory: "0x48BBEA6964139E18cE119297Dc49282e7df0f228",
      vlxSyxBpt: "0x7bD57dCA1C703E068F4A0A3Bc506612372eF7dC6",
      vlxUsdtBpt: "0x1fA22A3F8B36B5b24deE233fdaC1114E930b9Cda",
      usdtSyxBpt: "0xf02F3959C0B52a337D0C662a123103618fd38F74",
      ethSyxBpt: "0x4F5D1990F667bAa8f5d5A76282707508AD2DEF05",
      vlxEthBpt: "0xAa47D5475D89a837d61e0a33ce32Ac31D3aAf0dd",
      vlxSyxMultiBpt: "0x720b92Ef8ee928c5cbE9cA787321802610bcbf6E",
      svlxSyxMultiBpt: "0x2af1FEa48018Fe9F1266d67d45B388935df1c14D",
      usdtSyxMultiBpt: "0xE7557EFbE705E425De6A57E90447ba5AD70E9dE5",
      ethSyxMultiBpt: "0x974D24a6bce9e0A0A27228e627c9CA1437fE0286",
      connectorFactory: "0x8Ee0f91b43D7Dd3685198510e6A4b7861A3eacbf", //no set governor
      bptConnector: "0x4e6D9C58856b0ABF8A7ca703d4a5D5f2a0714921", //BptReferralConnector
      rewardPool: "0x44DDf8BDcF16667f0E9F452D3E3733Dddf438da0",
      // wvlxConnector: "0xf6182f2924065343947E7F12ec4a989Fd9D2A9Ec",
      timelock: "0xCCBd500aDdE791f4133cE0fec95B2042fF4f9ab3",
      governor: "0x8fA9dD0dA03bC91508D70d2C254dBC25560C04b5",
      devFund: "0x17d8A87BF9F3f8ca7469D576d958bE345c1D9D5D",
      exchangeAbi: abis.exchangeProxyAbi,
      erc20ABI: abis.erc20ABI,
      rewardPoolABI: abis.rewardPoolABI,
      bptABI: abis.bptABI,
      syxABI: abis.syxABI,
      bptRefConnectorABI: abis.bptRefConnectorABI,
      wvlxConnectorABI: abis.wvlxConnectorABI,
      connectorFactoryABI: abis.connectorFactoryABI,
      stakingAuRaABI: abis.stakingAuRaABI,
      svlxABI: abis.svlxABI,
      secPerBlock: 5
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
      rewardPool: "0x7924a8d124C04492c8653912004532C2a9CDFe59",
      connectorFactory: "0x6C7D0CB3a0524BA91969Dd468313d34370c4b189",
      bptConnector: "0x48cA5665f5d83d5f41B478Bf0Eca2e01467F4F54", //BptReferralConnector
      bptFactory: "0x35E1B850033BfFCf0b33A3d486F950d375bD32A1",
      wvlx: "0x78f18612775a2c54efc74c2911542aa034fe8d3f",
      svlx: "0xE5D72F0506bC6C0701E701caC1e255D16801B5C0",
      weth: "0x41e7fb07236a736e06b3460e458a5b827e552521",
      usdt: "0xA23bAeA56de679FD1baf200E92a75ac8d5eeBc8A",
      syx: "0xC119b1d91b44012Db8d0ac5537f04c7FD7629c84",
      oldSyx: "0xC20932B245840CA1C6F8c9c90BDb2F4E0289DE48",
      oldSyx2: "0x28a6312D786e9d7a78637dD137AbeF5332F3b2Aa",
      oldSyx3: "0x946b06FE625aB1AaA27294F8ed09713C8812626c",
      vlxSyxMultiBpt: "0x72c3F39e57c8306e29d088ABFc1C24427649c9f9",
      ethSyxMultiBpt: "0x988269D4599Da30C926a7946D84Ce441a88ceDd2",
      usdtSyxMultiBpt: "0x5dB61B3C05c1B7d1845123F77448888057D96184",
      timelock: "0x94590E0463E3875F1A7c34cE09f78A73ade55282",
      governor: "0x3d235F8Dc14d41237b8F3Aa8a205F7ABBBEe0c6F",
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
      secPerBlock: 10
    };
  }
}
export default env();
