import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { MaxUint256, AddressZero } from "@ethersproject/constants";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useMultiDeposit() {
  const { account, signer } = useContext(Web3Context);

  const approve = async (tokenAddress, targetAddress, amount) => {
    const erc20Contract = new Contract(tokenAddress, config.erc20ABI, signer);
    const allowance = await erc20Contract.allowance(account, targetAddress);
    if (allowance.lt(amount)) {
      const tx = await erc20Contract.approve(targetAddress, MaxUint256);
      await tx.wait();
    }
  };

  return useCallback(
    async (pool, params) => {
      const connectorFactoryContract = new Contract(
        config.connectorFactory,
        config.connectorFactoryABI,
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
          if (tokensIn[i] === AddressZero) {
            value = maxAmountsIn[i];
          } else {
            await approve(tokensIn[i], connectorAddress, maxAmountsIn[i]);
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
