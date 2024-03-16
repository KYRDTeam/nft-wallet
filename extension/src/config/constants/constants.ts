import { ChainId, SupportedCurrencyType } from "../types";

export const KRYSTAL_APP: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.ROPSTEN]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.BSC]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.POLYGON]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.CRONOS]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.FANTOM]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.AVALANCHE]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.ARBITRUM]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.LINEA_TESTNET]: process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
  [ChainId.POLYGON_ZKEVM_TESTNET]:
    process.env.REACT_APP_KRYSTAL_APP_MAINNET || "",
};

export const krystalApiEndPoint = process.env.REACT_APP_KRYSTAL_API || "";

export const KRYSTAL_API: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: `${krystalApiEndPoint}/ethereum`,
  [ChainId.ROPSTEN]: `${krystalApiEndPoint}/ropsten`,
  [ChainId.BSC]: `${krystalApiEndPoint}/bsc`,
  [ChainId.BSC_TESTNET]: `${krystalApiEndPoint}/bsctestnet`,
  [ChainId.POLYGON]: `${krystalApiEndPoint}/polygon`,
  [ChainId.CRONOS]: `${krystalApiEndPoint}/cronos`,
  [ChainId.FANTOM]: `${krystalApiEndPoint}/fantom`,
  [ChainId.AVALANCHE]: `${krystalApiEndPoint}/avalanche`,
  [ChainId.ARBITRUM]: `${krystalApiEndPoint}/arbitrum`,
  [ChainId.LINEA_TESTNET]: `${krystalApiEndPoint}/linea`,
  [ChainId.POLYGON_ZKEVM_TESTNET]: `${krystalApiEndPoint}/zkevm`,
};

export const KRYSTAL_ADMIN_URL = process.env.REACT_APP_KRYSTAL_ADMIN_API || "";

export const LENDING_PLATFORM: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: "Compound",
  [ChainId.ROPSTEN]: "Compound",
  [ChainId.BSC]: "Venus",
  [ChainId.BSC_TESTNET]: "Venus",
  [ChainId.POLYGON]: "",
  [ChainId.CRONOS]: "",
  [ChainId.FANTOM]: "",
  [ChainId.AVALANCHE]: "",
  [ChainId.ARBITRUM]: "",
  [ChainId.LINEA_TESTNET]: "",
  [ChainId.POLYGON_ZKEVM_TESTNET]: "",
};

export const DEFAULT_GAS_LIMIT = {
  SWAP_ARBITRUM: "2000000",
};
export const WALLET_TYPE = {
  METAMASK: "metamask",
  WALLET_CONNECT: "wallet connect",
  WALLET_LINK: "wallet link",
  COINBASE: "coin base",
  TREZOR: "trezor",
  LEDGER: "ledger",
  DAPP: "dapp",
};
export const GAS_PRICE = {
  "Super Fast": 60,
  Fast: 30,
  Standard: 20,
  Low: 15,
};
export const DEFAULT_GAS_PRICE = "Standard";

export const LEDGER_DERIVATION_PATHS = [
  { value: "m/44'/60'", desc: "Ledger Live", bip44: true },
  { value: "m/44'/60'/0'", desc: "Ledger Legacy" },
  { defaultValue: "m/44'/60'/1'/0", desc: "Your Custom Path", custom: true },
];

export const TREZOR_DERIVATION_PATHS = [
  { value: "m/44'/60'/0'/0", desc: "Trezor (ETH)" },
  { value: "m/44'/61'/0'/0", desc: "Trezor (ETC)" },
  { defaultValue: "m/44'/60'/1'/0", desc: "Your Custom Path", custom: true },
];
export const MOBILE_SCREEN_SIZE = 700;
export const QUICK_SLIPPAGE_OPTIONS = ["0.1", "0.5", "1"];

export const SLIPPAGE_WARNING = 5;

export const CURRENCY_ICON = {
  usd: "$",
  eth: "Ξ",
  btc: "₿",
};

export const TOP_GAINERS = "TOP_GAINERS";
export const TOP_LOSERS = "TOP_LOSERS";
export const TRENDING = "TRENDING";

export const BASE_CURRENCY: {
  [chainId in ChainId]: Array<SupportedCurrencyType>;
} = {
  [ChainId.BSC]: ["usd", "btc", "bnb"],
  [ChainId.BSC_TESTNET]: ["usd", "btc", "bnb"],
  [ChainId.MAINNET]: ["usd", "btc", "eth"],
  [ChainId.POLYGON]: ["usd", "btc", "matic"],
  [ChainId.ROPSTEN]: ["usd", "btc", "eth"],
  [ChainId.CRONOS]: ["usd", "btc", "cro"],
  [ChainId.FANTOM]: ["usd", "btc", "ftm"],
  [ChainId.AVALANCHE]: ["usd", "btc", "avax"],
  [ChainId.ARBITRUM]: ["usd", "btc", "eth"],
  [ChainId.LINEA_TESTNET]: ["usd", "btc", "eth"],
  [ChainId.POLYGON_ZKEVM_TESTNET]: ["usd", "btc", "eth"],
};

export const MINIMUM_LIQUIDITY = 100000;

export const NFT_INTERFACE = {
  ERC721: "0x5b5e139f",
  ERC1155: "0xd9b67a26",
};

export const NFT_TYPE = {
  ERC721: "ERC721",
  ERC1155: "ERC1155",
  UNKNOWN: "UNKNOWN",
};

export const SUMMARY_TAB = {
  ASSET: "ASSET",
  NFT: "NFT",
};

export const MINIMUM_AVAILABLE_TOKEN_VALUE = 0.01;

export const TRANSACTION_TYPES = {
  SWAP: "Swap",
  RECEIVED: "Received",
  TRANSFER: "Transfer",
  APPROVAL: "Approval",
  SUPPLY: "Supply",
  WITHDRAW: "Withdraw",
  PENDING: "Pending",
};

export const WHITE_LIST = [];

export const MINIMUM_BALANCE_VALUE_TO_DISPLAY = 0.1;

export const SORT_KEY_FILTER = {
  name: "name",
  value: "quotes.usd.value",
  price: "quotes.usd.price",
  volume24h: "quotes.usd.volume24h",
};

export const COINGECKO_API = "https://api.coingecko.com/api/v3";

export const DEFAULT_RECIPIENT_MULTISEND = {
  address: "",
  amount: "",
  token: undefined,
};
export const DEFAULT_DECIMAL_FOR_DISPLAY: {
  [currency in SupportedCurrencyType]: number;
} = {
  btc: 5,
  eth: 4,
  bnb: 3,
  avax: 3,
  matic: 2,
  ftm: 2,
  usd: 2,
  cro: 2,
};

export const CANCEL = "cancel";
export const SPEED_UP = "speed_up";

export const GAS_LIMIT_DEFAULT = "100000";

export const SUPPORTED_TBA_CHAINS = [
  ChainId.POLYGON,
  // ChainId.LINEA_TESTNET,
  // ChainId.POLYGON_ZKEVM_TESTNET,
];
