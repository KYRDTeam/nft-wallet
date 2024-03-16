import { ChainId, ChainNodeType } from "../types";

export const NODE: {
  [chainId in ChainId]: ChainNodeType;
} = {
  [ChainId.MAINNET]: {
    rpcUrls: "https://eth.llamarpc.com",
    name: "Ethereum",
    platform: "ethereum",
    standard: "ERC-20",
    currencySymbol: "ETH",
    scanUrl: "https://etherscan.io",
    scanName: "Etherscan",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    scanApi: {
      endpoint: "https://api.etherscan.io/api",
      key: "",
    },
    EIP1559: true,
  },
  [ChainId.ROPSTEN]: {
    rpcUrls: "https://rpc.ankr.com/eth_ropsten",
    name: "Ropsten",
    platform: "ethereum",
    standard: "ERC-20",
    currencySymbol: "ETH",
    scanUrl: "https://ropsten.etherscan.io",
    scanName: "Etherscan",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    scanApi: {
      endpoint: "https://api-ropsten.etherscan.io/api",
      key: "",
    },
    EIP1559: true,
  },
  [ChainId.BSC]: {
    rpcUrls: "https://binance.llamarpc.com",
    name: "BSC",
    platform: "binance-smart-chain",
    standard: "BEP-20",
    currencySymbol: "BNB",
    scanName: "Bscscan",
    scanUrl: "https://bscscan.com",
    address: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    scanApi: {
      endpoint: "https://api.bscscan.com/api",
      key: "",
    },
    EIP1559: false,
  },
  [ChainId.BSC_TESTNET]: {
    rpcUrls: "https://bsc-testnet-rpc.publicnode.com",
    name: "BSC test",
    platform: "binance-smart-chain",
    standard: "BEP-20",
    currencySymbol: "BNB",
    scanName: "Bscscan",
    scanUrl: "https://testnet.bscscan.com",
    address: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    scanApi: {
      endpoint: "https://testnet.bscscan.com/api",
      key: "",
    },
    EIP1559: false,
  },
  [ChainId.POLYGON]: {
    rpcUrls:
      "https://polygon.blockpi.network/v1/rpc/93239dd8b83772ae7d6c48dcaa3f8e2a748a755f",
    name: "Polygon",
    platform: "polygon-pos",
    standard: "MATIC",
    currencySymbol: "MATIC",
    scanUrl: "https://polygonscan.com",
    scanName: "Polygonscan",
    address: "0xcccccccccccccccccccccccccccccccccccccccc",
    scanApi: {
      endpoint: "https://api.polygonscan.com/api",
      key: "",
    },
    EIP1559: true,
  },
  [ChainId.AVALANCHE]: {
    rpcUrls: "https://avalanche.drpc.org",
    name: "Avalanche",
    platform: "avalanche",
    standard: "AVAX",
    currencySymbol: "AVAX",
    scanUrl: "https://cchain.explorer.avax.network",
    scanName: "Avalance Explorer",
    address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    scanApi: {
      endpoint: "",
      key: "",
    },
    EIP1559: true,
  },
  [ChainId.CRONOS]: {
    rpcUrls: "https://cronos-evm-rpc.publicnode.com",
    name: "Cronos",
    platform: "cronos",
    standard: "CRC-20",
    currencySymbol: "CRO",
    scanUrl: "https://cronos.crypto.org/explorer",
    scanName: "Cronos Explorer",
    address: "0xffffffffffffffffffffffffffffffffffffffff",
    scanApi: {
      endpoint: "",
      key: "",
    },
    EIP1559: false,
  },
  [ChainId.FANTOM]: {
    rpcUrls: "https://1rpc.io/ftm",
    name: "Fantom",
    platform: "fantom",
    standard: "Opera FTM",
    currencySymbol: "FTM",
    scanUrl: "https://ftmscan.com",
    scanName: "Fantom Explorer",
    address: "0xdddddddddddddddddddddddddddddddddddddddd",
    scanApi: {
      endpoint: "",
      key: "",
    },
    EIP1559: false,
  },
  [ChainId.ARBITRUM]: {
    rpcUrls: "https://arbitrum.drpc.org",
    name: "Arbitrum",
    platform: "ethereum",
    standard: "Arbitrum",
    currencySymbol: "ETH",
    scanUrl: "https://arbiscan.io",
    scanName: "Arbiscan",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    scanApi: {
      endpoint: "",
      key: "",
    },
    EIP1559: false,
  },
  [ChainId.POLYGON_ZKEVM_TESTNET]: {
    rpcUrls: "https://polygon-zkevm-testnet.drpc.org",
    name: "Polygon zkEVM Testnet",
    platform: "ethereum",
    standard: "Polygon zkEVM",
    currencySymbol: "ETH",
    scanUrl: "https://testnet-zkevm.polygonscan.com",
    scanName: "Polygon zkEVM Explorer",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    scanApi: {
      endpoint: "",
      key: "",
    },
    EIP1559: true,
  },
  [ChainId.LINEA_TESTNET]: {
    rpcUrls: "https://rpc.goerli.linea.build",
    name: "Linea Testnet",
    platform: "ethereum",
    standard: "Linea",
    currencySymbol: "ETH",
    scanUrl: "https://explorer.goerli.linea.build",
    scanName: "Linea Blockscout",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    scanApi: {
      endpoint: "",
      key: "",
    },
    EIP1559: true,
  },
};

export const MAINNET_CHAINS = [
  ChainId.MAINNET,
  ChainId.BSC,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.CRONOS,
  ChainId.FANTOM,
  ChainId.ARBITRUM,
];

export const SUPPORTED_CHAINS = [
  ...MAINNET_CHAINS,
  ChainId.ROPSTEN,
  ChainId.BSC_TESTNET,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.LINEA_TESTNET,
];
