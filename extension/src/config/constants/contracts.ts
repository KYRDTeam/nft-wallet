import { ChainId } from "../types";

export const multiCall: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]: "",
  [ChainId.ROPSTEN]: "",
  [ChainId.BSC]: process.env.REACT_APP_MULTICALL || "",
  [ChainId.POLYGON]: process.env.REACT_APP_MULTICALL || "",
  [ChainId.AVALANCHE]: "",
  [ChainId.FANTOM]: "",
  [ChainId.CRONOS]: "",
  [ChainId.BSC_TESTNET]: "",
  [ChainId.ARBITRUM]: "",
};

export const SMART_WALLET_PROXY: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_SMART_WALLET_PROXY_MAINNET || "",
  [ChainId.ROPSTEN]: process.env.REACT_APP_SMART_WALLET_PROXY_FANTOM || "",
  [ChainId.BSC]: process.env.REACT_APP_SMART_WALLET_PROXY_BSC || "",
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_SMART_WALLET_PROXY_BSC || "",
  [ChainId.POLYGON]: process.env.REACT_APP_SMART_WALLET_PROXY_MAINNET || "",
  [ChainId.CRONOS]: process.env.REACT_APP_SMART_WALLET_PROXY_FANTOM || "",
  [ChainId.FANTOM]: process.env.REACT_APP_SMART_WALLET_PROXY_FANTOM || "",
  [ChainId.AVALANCHE]: process.env.REACT_APP_SMART_WALLET_PROXY_AVAX || "",
  [ChainId.ARBITRUM]: process.env.REACT_APP_SMART_WALLET_PROXY_ARB || "",
};

export const PLATFORM_WALLET: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_PLATFORM_WALLET || "",
  [ChainId.ROPSTEN]: process.env.REACT_APP_PLATFORM_WALLET || "",
  [ChainId.BSC]: process.env.REACT_APP_PLATFORM_WALLET || "",
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_PLATFORM_WALLET || "",
  [ChainId.POLYGON]: process.env.REACT_APP_PLATFORM_WALLET || "",
  [ChainId.CRONOS]: process.env.REACT_APP_PLATFORM_WALLET || "",
  [ChainId.FANTOM]: process.env.REACT_APP_PLATFORM_WALLET || "",
  [ChainId.AVALANCHE]: process.env.REACT_APP_PLATFORM_WALLET || "",
  [ChainId.ARBITRUM]: process.env.REACT_APP_PLATFORM_WALLET || "",
};

export const MULTI_SEND_CONTRACT: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_MULTISEND_CONTRACT || "",
  [ChainId.ROPSTEN]: process.env.REACT_APP_MULTISEND_CONTRACT || "",
  [ChainId.BSC]: process.env.REACT_APP_MULTISEND_CONTRACT || "",
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_MULTISEND_CONTRACT || "",
  [ChainId.POLYGON]: process.env.REACT_APP_MULTISEND_CONTRACT || "",
  [ChainId.CRONOS]: process.env.REACT_APP_MULTISEND_CONTRACT || "",
  [ChainId.FANTOM]: process.env.REACT_APP_MULTISEND_CONTRACT || "",
  [ChainId.AVALANCHE]: process.env.REACT_APP_MULTISEND_CONTRACT || "",
  [ChainId.ARBITRUM]: process.env.REACT_APP_MULTISEND_CONTRACT || "",
};
