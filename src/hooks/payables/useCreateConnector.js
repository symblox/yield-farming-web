import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useCreateConnector() {
  const { signer } = useContext(Web3Context);

  return useCallback(
    async (pool) => {
      const connectorFactoryContract = new Contract(
        config.connectorFactory,
        config.connectorFactoryABI,
        signer
      );

      let gasLimit;
      try {
        gasLimit = await connectorFactoryContract.estimateGas[
          "createConnector"
        ](pool.address, pool.index);
      } catch (err) {
        gasLimit = 1000000;
      }

      return connectorFactoryContract["createConnector"](
        pool.address,
        pool.index,
        {
          gasLimit,
        }
      );
    },
    [signer]
  );
}
