import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { Web3Context } from "../../contexts/Web3Context";

export default function useMultiWithdraw() {
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

      const connectorContract = new Contract(
        connectorAddress,
        pool.entryContractABI,
        signer
      );

      let gasLimit;
      try {
        gasLimit = await connectorContract.estimateGas[
          "multiWithdraw(uint256,address[],uint256[])"
        ](...params);
      } catch (err) {
        gasLimit = 1000000;
      }

      return connectorContract["multiWithdraw(uint256,address[],uint256[])"](
        ...params,
        {
          gasLimit,
        }
      );
    },
    [signer]
  );
}
