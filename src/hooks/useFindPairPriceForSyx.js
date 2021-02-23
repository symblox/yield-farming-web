import { useCallback, useContext } from "react";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config from "../config/config";
import { bnum } from "../utils/bignumber";

export default function useFindPairPriceForSyx() {
  const { signer } = useContext(Web3Context);
  const { ethersProvider, providerNetwork } = useContext(Web3Context);

  return useCallback(
    async (pool) => {
      if (pool.type === "seed") return null;
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(ethersProvider);
      await ethcallProvider.init();
      const pairContract = new Contract(pool.address, pool.abi);

      const token0Call = pairContract.token0();
      const token1Call = pairContract.token1();
      const getReservesCall = pairContract.getReserves();
      const totalSupplyCall = pairContract.totalSupply();

      const [
        token0,
        token1,
        reserves,
        totalSupply,
      ] = await ethcallProvider.all([
        token0Call,
        token1Call,
        getReservesCall,
        totalSupplyCall,
      ]);

      if (
        token0.toLowerCase() !== config.syx.toLowerCase() &&
        token1.toLowerCase() !== config.syx.toLowerCase()
      )
        return null;

      let price, totalBalanceForSyx, erc20Contract, symbolCall;
      if (token0.toLowerCase() === config.syx.toLowerCase()) {
        price = bnum(reserves._reserve0 / reserves._reserve1 + "");
        totalBalanceForSyx = bnum(reserves._reserve0.toString()).plus(
          bnum(reserves._reserve1.toString()).times(price)
        );
        erc20Contract = new Contract(token1, config.erc20ABI);
        symbolCall = erc20Contract.symbol();
      } else {
        price = bnum(reserves._reserve1 / reserves._reserve0 + "");
        totalBalanceForSyx = bnum(reserves._reserve1.toString()).plus(
          bnum(reserves._reserve0.toString()).times(price)
        );
        erc20Contract = new Contract(token0, config.erc20ABI);
        symbolCall = erc20Contract.symbol();
      }
      const [symbol] = await ethcallProvider.all([symbolCall]);
      return [
        {
          symbol: pool.symbol,
          price: totalBalanceForSyx.div(bnum(totalSupply.toString())),
          totalBalanceForSyx,
        },
        {
          symbol,
          price,
          totalBalanceForSyx,
        },
      ];
    },
    [signer]
  );
}
