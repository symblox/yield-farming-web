import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits } from "@ethersproject/units";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { bnum } from "../utils/bignumber";
import { Web3Context } from "../contexts/Web3Context";
import config from "../config";

const blocksPerYear = (3600 * 24 * 365) / config.secPerBlock;

const rewardAprsAtom = atom({ poolAprs: {}, userApr: 0, loaded: false });
export default rewardAprsAtom;

export function useRewardAprs(pools) {
  const { account, ethersProvider, providerNetwork } = useContext(Web3Context);
  const [aprs, setAprs] = useAtom(rewardAprsAtom);

  useEffect(() => {
    if (!account || !ethersProvider || !providerNetwork) return;
    fetchRewardAprsValues(
      account,
      pools,
      ethersProvider,
      providerNetwork,
      setAprs
    );
  }, [account, ethersProvider, providerNetwork]);

  return [aprs, setAprs];
}

export async function fetchRewardAprsValues(
  account,
  pools,
  provider,
  providerNetwork,
  setAprs
) {
  if (account && provider && providerNetwork) {
    try {
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();

      let prices = { VLX: 1, USDT: 1, ETH: 1 };
      //   const pricePromises = pools.map(async (pool) => {
      //     if (pool.type !== "seed") {
      //       const bptContract = new Contract(pool.address, pool.abi);
      //       let calls = [];
      //       bptContract.getSpotPrice(asset.erc20Address, asset.erc20Address2)

      //       pool.supportTokens.map((v) => {

      //         calls.push(bptContract.getBalance(v.address));
      //       });

      //       const results = await ethcallProvider.all([...calls]);
      //       pool.supportTokens.map((v, i) => {
      //         if (pool.rewardToken.symbol === v.symbol) {
      //           totalBalanceForSyx = totalBalanceForSyx.plus(
      //             bnum(formatUnits(results[i], v.decimals))
      //           );
      //         } else {
      //           totalBalanceForSyx = totalBalanceForSyx.plus(
      //             bnum(formatUnits(results[i], v.decimals)).times(
      //               prices[v.symbol]
      //             )
      //           );
      //         }
      //       });
      //     }
      //   });
      //   await Promise.all(pricePromises);
      let newPoolAprs = {};
      const promises = pools.map(async (pool) => {
        let rewardApr;
        if (pool.type !== "seed") {
          const bptContract = new Contract(pool.address, pool.abi);
          let calls = [];
          let totalBalanceForSyx = bnum(0);

          pool.supportTokens.map((v) => {
            calls.push(bptContract.getBalance(v.address));
          });

          const results = await ethcallProvider.all([...calls]);
          pool.supportTokens.map((v, i) => {
            if (pool.rewardToken.symbol === v.symbol) {
              totalBalanceForSyx = totalBalanceForSyx.plus(
                bnum(formatUnits(results[i], v.decimals))
              );
            } else {
              totalBalanceForSyx = totalBalanceForSyx.plus(
                bnum(formatUnits(results[i], v.decimals)).times(
                  prices[v.symbol]
                )
              );
            }
          });

          rewardApr = totalBalanceForSyx.gt(bnum(0))
            ? bnum(pool.rewardRate)
                .times(bnum(blocksPerYear + ""))
                .div(totalBalanceForSyx)
            : 0;
        }

        newPoolAprs[pool.index] = rewardApr.toFixed(1, 0);
      });
      await Promise.all(promises);
      setAprs({
        poolAprs: newPoolAprs,
        userApr: 0,
        loaded: true,
      });
    } catch (e) {
      setAprs({ poolAprs: {}, userApr: 0, loaded: false });
      console.log("fetchRewardAprsValues error");
      console.error(e);
      return;
    }
  }
}
