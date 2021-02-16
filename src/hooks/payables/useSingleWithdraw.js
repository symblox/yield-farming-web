import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useSingleWithdraw() {
  const { account, signer } = useContext(Web3Context);

  return useCallback(
    async (pool, params) => {
      const connectorFactoryContract = new Contract(
        config.connectorFactoryABI,
        config.connectorFactoryABI,
        signer
      );
      const connectorAddress = await connectorFactoryContract.connectors(
        account,
        pool.index
      );

      let action = "withdraw(address,uint256,uint256)";

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
