import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { MaxUint256 } from "@ethersproject/constants";
import { Web3Context } from "../../contexts/Web3Context";

export default function useMultiDeposit() {
  const { account, signer } = useContext(Web3Context);

  return useCallback(
    async (pool, params) => {
      const connectorFactoryContract = new Contract(
        pool.entryContractFactoryAddress,
        pool.entryContractFactoryABI,
        signer
      );
      const connectorAddress = await connectorFactoryContract.connectors(
        account,
        pool.index
      );

      if (Array.isArray(params.tokensIn)) {
        for (let i = 0; i < params.tokensIn.length; i++) {
          const erc20Contract = new Contract(
            params.tokensIn[i],
            pool.erc20ABI,
            signer
          );

          const allowance = await erc20Contract.allowance(
            account,
            connectorAddress
          );
          if (allowance.lt(params.maxAmountsIn[i])) {
            await erc20Contract.approve(connectorAddress, MaxUint256);
          }
        }
      }

      const connectorContract = new Contract(
        connectorAddress,
        pool.entryContractABI,
        signer
      );

      let gasLimit;
      try {
        gasLimit = await connectorContract.estimateGas[
          "multiDeposit(uint256,address[],uint256[],address)"
        ](...params);
      } catch (err) {
        gasLimit = 1000000;
      }

      return connectorContract[
        "multiDeposit(uint256,address[],uint256[],address)"
      ](...params, {
        gasLimit,
      });
    },
    [signer]
  );
}
