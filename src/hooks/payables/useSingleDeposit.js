import { useCallback, useContext } from "react";
import { Contract } from "ethers";
import { MaxUint256, AddressZero } from "@ethersproject/constants";
import { Web3Context } from "../../contexts/Web3Context";
import config from "../../config";

export default function useSingleDeposit() {
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
    async (pool, params, tokenAmountIn) => {
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
      let action = "deposit(address,uint256,uint256,address)";
      if (
        params[0] === AddressZero ||
        params[0].toLowerCase() === config.wvlx.toLowerCase()
      ) {
        value = tokenAmountIn;
      } else {
        await approve(params[0], connectorAddress, params[1]);
      }

      const connectorContract = new Contract(
        connectorAddress,
        pool.entryContractABI,
        signer
      );
      let gasLimit;
      try {
        gasLimit = await connectorContract.estimateGas[action](...params, {
          value,
        });
      } catch (err) {
        gasLimit = 1000000;
      }

      return connectorContract[action](...params, {
        gasLimit,
        value,
      });
    },
    [signer]
  );
}
