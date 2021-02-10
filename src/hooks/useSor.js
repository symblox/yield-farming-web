import { useEffect, useContext } from "react";
import { atom, useAtom } from "jotai";
import { formatUnits } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { Web3Context } from "../contexts/Web3Context";
import config, { pools } from "../config";
import { bnum } from "../utils/bignumber";
import {
  filterPools,
  parsePoolData,
  processPaths,
  processEpsOfInterestMultiHop,
  smartOrderRouterMultiHopEpsOfInterest,
  getCostOutputToken,
  sortPoolsMostLiquid,
} from "@balancer-labs/sor";

const initData = {
  processedPools: null,
  processedPathsIn: null,
  processedPathsOut: null,
  epsOfInterestIn: null,
  epsOfInterestOut: null,
  noPools: 10,
  costOutputToken: bnum(0),
  costInputToken: bnum(0),
  isLoadingPaths: true,
  lastInputToken: "",
  lastOutputToken: "",
};
const sorAtom = atom(initData);
export default sorAtom;

export function useSor() {
  const { ethersProvider, providerNetwork } = useContext(Web3Context);
  const [sor, setSor] = useAtom(sorAtom);
  useEffect(() => {
    fetchPoolData(ethersProvider, providerNetwork);
  }, [ethersProvider, providerNetwork]);
  return [sor, setSor];
}

export async function fetchPoolData(provider, providerNetwork) {
  if (provider && providerNetwork) {
    try {
      setMulticallAddress(providerNetwork.chainId, config.multicall);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();

      //Use temporary objects to set, otherwise the modification will not take effect
      let newPools = [];
      const promises = pools.map(async (pool, i) => {
        if (pool.type !== "seed") {
          let newPool = { tokensList: [], tokens: [] };
          newPool.id = pool.address.toLowerCase();
          const bptContract = new Contract(pool.address, pool.abi);
          const swapFeeCall = bptContract.getSwapFee();
          const totalDenormalizedWeightCall = bptContract.getTotalDenormalizedWeight();

          let extraCall = [],
            extraCall2 = [];
          pool.supportTokens.map((v) => {
            extraCall.push(bptContract.getBalance(v.address));
            extraCall2.push(bptContract.getDenormalizedWeight(v.address));
          });

          const results = await ethcallProvider.all([
            swapFeeCall,
            totalDenormalizedWeightCall,
            ...extraCall,
            ...extraCall2,
          ]);

          const [swapFee, totalDenormalizedWeight] = results;
          newPool.swapFee = swapFee.toString();
          newPool.totalWeight = totalDenormalizedWeight.toString();

          pool.supportTokens.map((v, i) => {
            newPool.tokensList.push(v.address.toLowerCase());
            newPool.tokens.push({
              address: v.address.toLowerCase(),
              balance: results[i + 2].toString(),
              decimals: v.decimals,
              denormWeight: results[i + 4].toString(),
            });
          });
          newPools.push(newPool);
        }
      });
      await Promise.all(promises);
      return newPools;
    } catch (e) {
      console.log("fetchPoolData error");
      console.error(e);
      return;
    }
  }
}

export async function fetchPathData(
  inputToken,
  outputToken,
  sor,
  poolList,
  setSor,
  isRefresh = false
) {
  try {
    if (
      poolList &&
      inputToken !== "" &&
      outputToken !== "" &&
      (sor.lastInputToken !== inputToken ||
        sor.lastOutputToken !== outputToken ||
        isRefresh)
    ) {
      let newSor = Object.assign({}, sor);
      newSor.isLoadingPaths = true;
      newSor.lastInputToken = inputToken;
      newSor.lastOutputToken = outputToken;

      let [pools, pathData] = await loadPathData(
        {
          pools: poolList,
        },
        inputToken,
        outputToken
      );

      newSor.processedPools = pools;
      newSor.processedPathsIn = processPaths(pathData, pools, "swapExactIn");
      newSor.epsOfInterestIn = processEpsOfInterestMultiHop(
        newSor.processedPathsIn,
        "swapExactIn",
        newSor.noPools
      );
      newSor.processedPathsOut = processPaths(pathData, pools, "swapExactOut");
      newSor.epsOfInterestOut = processEpsOfInterestMultiHop(
        newSor.processedPathsOut,
        "swapExactOut",
        newSor.noPools
      );

      newSor.isLoadingPaths = false;
      setSor(newSor);
      return newSor;
    } else {
      return sor;
    }
  } catch (e) {
    setSor(initData);
    console.log("fetchPathData error");
    console.error(e);
    return;
  }
}

const loadPathData = async (allPools, tokenIn, tokenOut) => {
  tokenIn = tokenIn.toLowerCase();
  tokenOut = tokenOut.toLowerCase();
  const [directPools, hopTokens, poolsTokenIn, poolsTokenOut] = filterPools(
    allPools.pools,
    tokenIn,
    tokenOut,
    10
  );

  const [
    mostLiquidPoolsFirstHop,
    mostLiquidPoolsSecondHop,
  ] = sortPoolsMostLiquid(
    tokenIn,
    tokenOut,
    hopTokens,
    poolsTokenIn,
    poolsTokenOut
  );

  const [pools, pathData] = parsePoolData(
    directPools,
    tokenIn,
    tokenOut,
    mostLiquidPoolsFirstHop,
    mostLiquidPoolsSecondHop,
    hopTokens
  );

  return [pools, pathData];
};

export async function findBestSwapsMulti(
  sor,
  swapType,
  swapAmount,
  maxPools,
  returnTokenCostPerPool
) {
  if (!sor || sor.isLoadingPaths) return [0, []];
  let processedPaths = sor.processedPathsIn;
  let epsOfInterest = sor.epsOfInterestIn;

  if (swapType === "swapExactOut") {
    processedPaths = sor.processedPathsOut;
    epsOfInterest = sor.epsOfInterestOut;
  }

  const [sorSwaps, totalReturn] = smartOrderRouterMultiHopEpsOfInterest(
    JSON.parse(JSON.stringify(sor.processedPools)),
    processedPaths,
    swapType,
    swapAmount,
    maxPools,
    returnTokenCostPerPool,
    epsOfInterest
  );

  return [totalReturn, sorSwaps];
}
