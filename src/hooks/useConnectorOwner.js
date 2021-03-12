import {useCallback, useContext} from "react";
import {Contract, Provider, setMulticallAddress} from "ethers-multicall";
import {Web3Context} from "../contexts/Web3Context";
import config from "../config/config";

export default function useConnectorOwner() {
    const {ethersProvider, providerNetwork} = useContext(Web3Context);

    return useCallback(async connectorAddress => {
        setMulticallAddress(providerNetwork.chainId, config.multicall);

        const ethcallProvider = new Provider(ethersProvider);
        await ethcallProvider.init();

        const connectorContract = new Contract(connectorAddress, config.bptRefConnectorABI);
        const ownerCall = connectorContract.owner();

        const owner = await ethcallProvider.all([ownerCall]);
        console.log({callback: owner});
        return owner;
    });
}
