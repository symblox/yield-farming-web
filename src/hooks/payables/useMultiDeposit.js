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

      let value = "0";
      //0: poolAmountOut,1: tokensIn,2: maxAmountsIn,3: referral
      const [, tokensIn, maxAmountsIn] = params;
      if (Array.isArray(tokensIn)) {
        for (let i = 0; i < tokensIn.length; i++) {
          if (tokensIn[i] === "0x0000000000000000000000000000000000000000") {
            value = maxAmountsIn[i];
          } else {
            const erc20Contract = new Contract(
              tokensIn[i],
              pool.erc20ABI,
              signer
            );

            const allowance = await erc20Contract.allowance(
              account,
              connectorAddress
            );
            if (allowance.lt(maxAmountsIn[i])) {
              const tx = await erc20Contract.approve(
                connectorAddress,
                MaxUint256
              );
              await tx.wait();
            }
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
        ](...params, {
          value,
        });
      } catch (err) {
        gasLimit = 1000000;
      }

      return connectorContract[
        "multiDeposit(uint256,address[],uint256[],address)"
      ](...params, {
        gasLimit,
        value,
      });
    },
    [signer]
  );
}
