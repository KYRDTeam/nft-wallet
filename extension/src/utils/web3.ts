import Web3 from "web3";
import { provider as ProviderType } from "web3-core";
import {
  ChainId,
  NFTItem,
  Token,
  TransferNFTParamType,
  TxParams,
} from "../config/types";
import { NODE } from "../config/constants/chain";
import { toWei } from "./helper";
import { NFT_INTERFACE, NFT_TYPE } from "src/config/constants/constants";
import ERC721ABI from "src/config/abi/ERC721.json";
import ERC1155ABI from "src/config/abi/ERC1155.json";
import ERC20ABI from "src/config/abi/erc20.json";
import multicall from "./multicall";
import { AbiItem, toHex } from "web3-utils";
import BigNumber from "bignumber.js";
import { get } from "lodash";

export const getWeb3 = (chainId: ChainId, provider?: ProviderType) => {
  provider = provider
    ? provider
    : new Web3.providers.HttpProvider(NODE[chainId].rpcUrls);

  const web3 = new Web3(provider);
  return web3;
};

export const getCurrentNonce = async (chainId: ChainId, from: string) => {
  const web3 = getWeb3(chainId);
  let nonce;

  try {
    nonce = await web3.eth.getTransactionCount(from);
  } catch (e) {
    throw e;
  }

  return nonce;
};

export const formatTxParams = async (chainId: ChainId, txObj: TxParams) => {
  const web3 = getWeb3(chainId);

  const {
    from,
    to,
    value,
    data,
    gasPrice,
    gasLimit,
    priorityFee,
    nonce: nonceInit,
  } = txObj;

  if (from && to && gasPrice) {
    let nonce = nonceInit;
    if (!nonceInit) {
      try {
        nonce = await web3.eth.getTransactionCount(from);
      } catch (e) {
        throw e;
      }
    }

    if (!priorityFee || !Number(priorityFee)) {
      return {
        from,
        to,
        value: toHex(value || 0),
        data,
        gasPrice: toHex(toWei(gasPrice)),
        gasLimit: gasLimit ? toHex(gasLimit) : undefined,
        chainId: toHex(chainId),
        nonce,
      };
    } else {
      return {
        from,
        to,
        value: toHex(value || 0),
        data,
        maxFeePerGas: toHex(toWei(gasPrice)),
        maxPriorityFeePerGas: toHex(toWei(priorityFee)),
        gasLimit: gasLimit ? toHex(gasLimit) : undefined,
        type: "0x2", // EIP-1559
        chainId: toHex(chainId),
        nonce,
      };
    }
  } else {
    throw new Error("Missing parameters to build tx!");
  }
};

export const estimateGas = async (chainId: ChainId, txObj: TxParams) => {
  try {
    const web3 = getWeb3(chainId);
    const obj = await formatTxParams(chainId, txObj);
    // @ts-ignore
    return web3.eth.estimateGas(obj);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const sendTx = async (
  chainId: ChainId,
  txObj: TxParams,
  provider?: ProviderType,
  callback?: any
) => {
  const web3 = getWeb3(chainId, provider);
  try {
    const obj = await formatTxParams(chainId, txObj);
    // @ts-ignore
    return web3.eth.sendTransaction(obj, (_, hash) => {
      callback(hash);
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const sendRawTx = async (
  chainId: ChainId,
  signedTx: string,
  callback?: any
) => {
  const web3 = getWeb3(chainId);
  try {
    return web3.eth.sendSignedTransaction(signedTx, (_, hash) => {
      // console.log(_, hash);
      callback(hash);
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTxReceipt = async (
  chainId: ChainId,
  hash: string,
  provider?: ProviderType
) => {
  const web3 = getWeb3(chainId, provider);
  if (hash) {
    return web3.eth.getTransactionReceipt(hash);
  }
  return Promise.reject();
};

export const signMessage = async (
  chainId: ChainId,
  message: string,
  address: string,
  password: string,
  provider?: ProviderType,
  callback?: any
) => {
  const web3 = getWeb3(chainId, provider);
  try {
    return web3.eth.personal.sign(message, address, password, callback);
  } catch (e) {
    return "";
  }
};

export const checkNFTOwner = async (
  provider: ProviderType,
  chainId: ChainId,
  address: string,
  contractAddress: string,
  tokenID: string
): Promise<{ type: string; isOwner: boolean }> => {
  const web3 = getWeb3(chainId);

  let isERC721 = false;
  try {
    const tokenContract = new web3.eth.Contract(
      ERC721ABI as unknown as AbiItem,
      contractAddress,
      {
        from: address,
      }
    );
    isERC721 = await tokenContract.methods
      .supportsInterface(NFT_INTERFACE.ERC721)
      .call();

    if (isERC721) {
      const ownerAddress = await tokenContract.methods.ownerOf(tokenID).call();
      return {
        type: NFT_TYPE.ERC721,
        isOwner:
          ownerAddress && ownerAddress.toLowerCase() === address.toLowerCase(),
      };
    }
  } catch (e) {
    console.log(isERC721, e);
  }

  let isERC1155 = false;
  try {
    const tokenContract = new web3.eth.Contract(
      ERC1155ABI as unknown as AbiItem,
      contractAddress,
      {
        from: address,
      }
    );

    isERC1155 = await tokenContract.methods
      .supportsInterface(NFT_INTERFACE.ERC1155)
      .call();

    if (isERC1155) {
      const contractERC1155 = new web3.eth.Contract(
        ERC1155ABI as unknown as AbiItem,
        contractAddress
      );
      const ntfBalance = await contractERC1155.methods
        .balanceOf(address, tokenID)
        .call();
      return { type: NFT_TYPE.ERC1155, isOwner: +ntfBalance > 0 };
    }
  } catch (e) {
    throw e;
  }

  return { type: NFT_TYPE.UNKNOWN, isOwner: false };
};

export const getDataTransferNFT = (
  chainId: ChainId,
  params: TransferNFTParamType,
  nftType: any,
  provider?: ProviderType
) => {
  const web3 = getWeb3(chainId, provider);
  const ABI = nftType === NFT_TYPE.ERC721 ? ERC721ABI : ERC1155ABI;

  try {
    const tokenContract = new web3.eth.Contract(
      ABI as unknown as AbiItem,
      params.contractAddress
    );

    let txData;
    if (nftType === NFT_TYPE.ERC721) {
      txData = tokenContract.methods
        .safeTransferFrom(params.fromAddress, params.toAddress, params.tokenID)
        .encodeABI();
    }
    if (nftType === NFT_TYPE.ERC1155) {
      const amount = params.amount ? params.amount : 1;
      txData = tokenContract.methods
        .safeTransferFrom(
          params.fromAddress,
          params.toAddress,
          params.tokenID,
          amount,
          "0x"
        )
        .encodeABI();
    }

    return txData;
  } catch (e) {
    return false;
  }
};

export async function fetchTokenSymbolAndDecimal(
  tokenAddress: string,
  chainId: ChainId
): Promise<Token | null> {
  try {
    const provider = new Web3.providers.HttpProvider(NODE[chainId].rpcUrls);
    const web3 = new Web3(provider);

    let tokenContract = new web3.eth.Contract(
      ERC20ABI as unknown as AbiItem,
      tokenAddress
    );
    const symbol = await tokenContract.methods.symbol().call();
    const decimals = await tokenContract.methods.decimals().call();
    const name = await tokenContract.methods.name().call();

    return {
      symbol,
      decimals,
      address: tokenAddress,
      name: name || "",
      logo: "",
      tag: "UNVERIFIED",
      balance: "",
      humanizeBalance: "",
      formattedBalance: "",
      isNative: false,
    };
  } catch (e) {
    return null;
  }
}

export const getHigherGasFee = (type: any) => {
  switch (type) {
    case "Custom":
      return "Fast";
    case "Low":
      return "Standard";
    case "Standard":
      return "Fast";
    case "Fast":
      return "Super Fast";
    default:
      return "Standard";
  }
};

export const getWeb3BlockNumber = async (
  chainId: ChainId,
  provider?: ProviderType
) => {
  const web3 = getWeb3(chainId, provider);
  return await web3.eth.getBlockNumber();
};

export const getNftBalance = async (
  chainId: ChainId,
  userAddress: string,
  tokenAddress: string,
  provider?: ProviderType
) => {
  const web3 = getWeb3(chainId, provider);

  let isERC721 = false;
  try {
    const tokenContract = new web3.eth.Contract(
      ERC721ABI as unknown as AbiItem,
      tokenAddress,
    );
    isERC721 = await tokenContract.methods
      .supportsInterface(NFT_INTERFACE.ERC721)
      .call();

    if (!isERC721) {
      return
    }

    const balance = await tokenContract.methods.balanceOf(userAddress).call();
    let balanceBN = new BigNumber(balance)
    if (balanceBN.comparedTo(0) == 1) {
      let calls = []
      for (let i = 0; i < balanceBN.toNumber(); i++) {
        calls.push({
          address: tokenAddress,
          name: "tokenOfOwnerByIndex",
          params: [userAddress, i],
        })
      }

      const responses = await multicall(chainId, ERC721ABI, calls)
      let tokens = responses.map((data: any) => {
        return {
          tokenID: get(data, "[0]").toString()
        }
      })
      return tokens
    }
  } catch (e) {
    console.log(isERC721, e);
    return null
  }
}
