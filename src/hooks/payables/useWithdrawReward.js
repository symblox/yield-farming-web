import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useWithdrawReward() {
  const { account, signer } = useContext(Web3Context);

  return useCallback(
    async (pool) => {
      const connectorFactoryContract = new Contract(
        config.connectorFactory,
        config.connectorFactoryABI,
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
        gasLimit = await connectorContract.estimateGas["getReward"]();
      } catch (err) {
        gasLimit = 1000000;
      }

      return connectorContract["getReward"]({
        gasLimit,
      });
    },
    [signer]
  );
}
