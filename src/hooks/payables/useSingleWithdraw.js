import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { MaxUint256 } from "@ethersproject/constants";
import { Web3Context } from "../../contexts/Web3Context";

export default function useSingleWithdraw() {
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

      let action;
      switch (params.length) {
        case 2:
          action = "withdraw(uint256,uint256)";
          break;
        case 3:
          action = "withdraw(address,uint256,uint256)";
          break;
        default:
      }

      const connectorContract = new Contract(
        connectorAddress,
        pool.entryContractABI,
        signer
      );
      let gasLimit;
      try {
        gasLimit = await connectorContract.estimateGas[action](...params);
      } catch (err) {
        gasLimit = 1000000;
      }

      return connectorContract[action](...params, {
        gasLimit,
      });
    },
    [signer]
  );
}
