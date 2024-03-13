import Web3 from "web3";
import { provider as ProviderType } from "web3-core";
import { AbiItem } from "web3-utils";
import { ethers } from "ethers";

import erc20 from "../config/abi/erc20.json";
import { ChainId } from "../config/types";
import { NODE } from "../config/constants/chain";

export const getContract = (chainId: ChainId, address: string, provider?: ProviderType) => {
  provider = provider ? provider : new Web3.providers.HttpProvider(NODE[chainId].rpcUrls);
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(erc20 as unknown as AbiItem, address);
  return contract;
};

export const getTokenAllowance = async (
  chainId: ChainId,
  tokenAddress: string,
  owner: string,
  spender: string,
  provider?: ProviderType,
): Promise<string> => {
  const contract = getContract(chainId, tokenAddress, provider);
  try {
    const allowance: string = await contract.methods.allowance(owner, spender).call();
    return allowance;
  } catch (e) {
    return "0";
  }
};

export const approveToken = async (
  chainId: ChainId,
  tokenAddress: string,
  spender: string,
  account: string,
  provider?: ProviderType,
): Promise<string> => {
  const contract = getContract(chainId, tokenAddress, provider);
  const tx: string = await contract.methods.approve(spender, ethers.constants.MaxUint256).send({ from: account });
  return tx;
};

export const getApproveTokenObj = (
  chainId: ChainId,
  tokenAddress: string,
  spender: string,
  provider?: ProviderType,
): string | undefined => {
  const contract = getContract(chainId, tokenAddress, provider);
  try {
    return contract.methods.approve(spender, ethers.constants.MaxUint256).encodeABI();
  } catch (error) {
    console.log(error);
  }
};

export const getTransferTokenObj = (
  chainId: ChainId,
  tokenAddress: string,
  recipient: string,
  amount: string,
  provider?: ProviderType,
): string | undefined => {
  const contract = getContract(chainId, tokenAddress, provider);
  try {
    return contract.methods.transfer(recipient, amount).encodeABI();
  } catch (error) {
    console.log(error);
  }
};

export const getEthBalance = async (userAddress: string, provider?: ProviderType) => {
  try {
    if (provider) {
      const web3 = new Web3(provider);
      const balance: string = await web3.eth.getBalance(userAddress);
      return balance;
    }
  } catch (e) {
    return "0";
  }
};

export const getTokenBalance = async (
  chainId : ChainId,
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
