import Web3 from "web3";
import { provider as ProviderType } from "web3-core";
import { AbiItem } from "web3-utils";
import { ethers } from "ethers";

import erc721 from "../config/abi/ERC721.json";
import { ChainId } from "../config/types";
import { NODE } from "../config/constants/chain";

export const getContract = (chainId: ChainId, address: string, provider?: ProviderType) => {
    provider = provider ? provider : new Web3.providers.HttpProvider(NODE[chainId].rpcUrls);
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(erc721 as unknown as AbiItem, address);
    return contract;
};

export const getTokenBalance = async (
    chainId: ChainId,
    tokenAddress: string,
    userAddress: string,
    provider?: ProviderType,
): Promise<string> => {
    const contract = getContract(chainId, tokenAddress, provider);
    try {
        const balance: string = await contract.methods.balanceOf(userAddress).call();
        return balance;
    } catch (e) {
        return "0";
    }
};

export const getTokenOfOwnerByIndex = async (
    chainId: ChainId,
    tokenAddress: string,
    userAddress: string,
    index: Number,
    provider?: ProviderType,
): Promise<string | undefined> => {
    const contract = getContract(chainId, tokenAddress, provider);

    try {
        const balance: string = await contract.methods.tokenOfOwnerByIndex(userAddress, index).call();
        return balance;
    } catch (e) {
        return undefined;
    }
}
