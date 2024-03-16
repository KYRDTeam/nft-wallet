export enum WalletType {
  METAMASK = "METAMASK",
  COINBASE = "COINBASE",
  TREZOR = "TREZOR",
  LEDGER = "LEDGER",
  WALLET_CONNECT = "WALLET_CONNECT",
}

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  BSC = 56,
  BSC_TESTNET = 97,
  POLYGON = 137,
  POLYGON_ZKEVM_TESTNET = 1442,
  LINEA_TESTNET = 59140,
  CRONOS = 25,
  FANTOM = 250,
  AVALANCHE = 43114,
  ARBITRUM = 42161,
}

type ScanApiType = {
  endpoint: string;
  key: string;
};

export type ChainNodeType = {
  rpcUrls: string;
  name: string;
  platform: string;
  standard: string;
  currencySymbol: string;
  scanUrl: string;
  scanApi: ScanApiType;
  scanName: string;
  address: string;
  EIP1559: boolean;
};

export type ChainNodeDetailType = {
  id: number | string;
  rpcUrls: string;
  name: string;
  platform: string;
  standard: string;
  currencySymbol: string;
  scanUrl: string;
  scanApi: ScanApiType;
  scanName: string;
  address: string;
  EIP1559: boolean;
};

export enum Timer {
  PLANNING = 1,
  GOING_IN = 2,
  ENDED = 3,
}

export type SupportedCurrencyType =
  | "usd"
  | "btc"
  | "matic"
  | "bnb"
  | "eth"
  | "cro"
  | "ftm"
  | "avax";

export type Quote = {
  symbol: string;
  value: number;
  rate: number;
  price: number;
  volume24h: number;
};

export type QuoteList<Q> = {
  usdValue: number;
  avax: Q;
  bnb: Q;
  btc: Q;
  eth: Q;
  matic: Q;
  usd: Q;
};

export type Token = {
  address: string;
  decimals: number;
  logo: string;
  name: string;
  symbol: string;
  tag: TokenTagType;
  quotes?: QuoteList<Quote>;
  sparkline?: number[];
  usd?: number;
  usd24hChange?: number;
  usd24hChangePercentage?: number;
  usd24hVol?: number;
  usdMarketCap?: number;
  balance: string;
  humanizeBalance: string;
  formattedBalance: string;
  isNative: boolean;
  earn?: {
    distributionBorrowRate: number;
    distributionSupplyRate: number;
    liquidity: string;
    name: string;
    stableBorrowRate: number;
    supplyRate: number;
    totalSupply: string;
    variableBorrowRate: number;
  }[];
};

export type TokenDetail = {
  address: string;
  decimals: number;
  description: string;
  links: { [x: string]: string };
  logo: string;
  markets: { [x: string]: any };
  name: string;
  symbol: string;
  tag: TokenTagType;
};

export type TokenChartData = {
  date: string;
  price: number;
  volume: number;
};

export type EarnToken = {
  address: string;
  decimals: number;
  logo: string;
  name: string;
  symbol: string;
  tag: TokenTagType;
  balance: string;
  humanizeBalance: string;
  formattedBalance: string;
  isNative: boolean;
  overview: Platform[];
};

export type Platform = {
  distributionBorrowRate: number;
  distributionSupplyRate: number;
  liquidity: string;
  name: string;
  stableBorrowRate: number;
  supplyRate: number;
  totalSupply: string;
  variableBorrowRate: number;
};

export type EarnBalance = {
  name: string;
  balances: EarnBalanceToken[];
};

export type EarnBalanceToken = {
  address: string;
  decimals: number;
  logo: string;
  name: string;
  symbol: string;
  tag: string;
  requiresApproval: boolean;
  interestBearingTokenAddress: string;
  interestBearingTokenBalance: string;
  interestBearingTokenDecimals: number;
  interestBearingTokenSymbol: string;
  supplyBalance: string; // full decimals
  supplyRate: number;
};

export type DistributionBalance = Token & {
  unclaimed: string;
  current: string;
  address: string;
  decimals: number;
  logo: string;
  name: string;
  symbol: string;
};

export type PoolBalances = {
  [x: string]: {
    value: number;
    pools: {
      project: string;
      value: number;
      underlying: {
        balance: string;
        token: Token;
        quotes?: QuoteList<Quote>;
      }[];
    }[];
  };
};

export type Balance = {
  balance: string;
  token: Token;
  quotes: QuoteList<Quote>;
};

export type RateType = {
  amount: string;
  estimatedGas: string;
  hint: string;
  platform: string;
  platformIcon: string;
  platformShort: string;
  priceImpact: number;
  rate: string;
  humanizeRate: number;
};

export type GasPrices = {
  superFast: string;
  fast: string;
  low: string;
  standard: string;
};

export type GasType = "Super Fast" | "Fast" | "Standard" | "Low" | "Custom";

export type SwapParams = {
  hint?: string;
  userAddress?: string;
  dest?: string;
  src?: string;
  srcAmount?: string;
  minDestAmount?: string;
};

export type SwapAndDepositParams = {
  hint?: string;
  userAddress?: string;
  dest?: string;
  src?: string;
  srcAmount?: string;
  minDestAmount?: string;
  lendingPlatform?: string;
};

export type WithdrawParams = {
  userAddress?: string;
  token?: string;
  amount?: string;
  lendingPlatform?: string;
};

export type ClaimParams = {
  userAddress?: string;
  lendingPlatform?: string;
};

export type TxParams = {
  from?: string;
  to?: string;
  value?: string;
  data?: string;
  nonce?: number;
  gasPrice?: string | number;
  maxFeePerGas?: string | number;
  priorityFee?: string | number;
  gasLimit?: string | number;
  type?: string;
  chainId?: string;
};

export type TxReceipt = {
  status: boolean;
};

export type ExploreData = {
  id: number;
  url: string;
  imageUrl: string;
  type: string;
};

export type Transaction = {
  blockNumber: number;
  extraData: object;
  receiveToken: object;
  address: string;
  decimals: number;
  logo: string;
  name: string;
  symbol: string;
  receiveValue: string;
  from: string;
  gasCost: string;
  gasCostQuote: number;
  gasLimit: number;
  gasPrice: string;
  gasPriceQuote: number;
  gasUsed: number;
  hash: string;
  logs: any;
  nonce: number;
  status: string;
  timestamp: number;
  to: string;
  type: string;
  value: string;
  valueQuote: number;
};

export type QuoteMarket = {
  marketCap: number;
  price: number;
  price24hChange: number;
  price24hChangePercentage: number;
  sparkline: number[];
  symbol: string;
  volume24h: number;
};

export type TokenTagType = "PROMOTION" | "VERIFIED" | "SCAM" | "UNVERIFIED";

export type TokenMarketType = {
  address: string;
  decimals: number;
  logo: string;
  name: string;
  quotes: QuoteList<QuoteMarket>;
  sparkline: number[];
  symbol: string;
  tag: TokenTagType | "";
  usd: number;
  usd24hChange: number;
  usd24hChangePercentage: number;
  usd24hVol: number;
  usdMarketCap: number;
};

export type NFTItem = {
  collectibleName: string;
  externalData: {
    animation: string;
    description: string;
    image: string;
    name: string;
  };
  favorite: boolean;
  tokenBalance: string;
  tokenID: string;
  tokenUrl: string;
};

export type NFTCollectionType = {
  collectibleAddress: string;
  collectibleLogo: string;
  collectibleName: string;
  collectibleSymbol: string;
  items: NFTItem[];
};

export type TransferNFTParamType = {
  contractAddress: string;
  fromAddress: string;
  toAddress: string;
  tokenID: string;
  amount?: number;
};

export type TokenLinkType = {
  homepage?: string;
  twitterScreenName?: string;
  telegram?: string;
  discord?: string;
};

export type OrderByType = "asc" | "desc" | null;

export enum QuickFilterEnum {
  TOP_GAINERS = "TOP_GAINERS",
  TOP_LOSERS = "TOP_LOSERS",
  TRENDING = "TRENDING",
}

export type QuickFilterType =
  | QuickFilterEnum.TOP_GAINERS
  | QuickFilterEnum.TOP_LOSERS
  | QuickFilterEnum.TRENDING
  | null;

export type NotificationType = {
  content: string;
  createdAt: string;
  id: number;
  image: string;
  link: string;
  title: string;
  updatedAt: string;
};

export type AppSettingKey =
  | "APP_HEADER_BAR"
  | "APP_SWAP_BOX"
  | "APP_SWAP_SUCCESS"
  | "LANDING_HEADER_BAR";

export type MultiSendRecipientType = {
  amount: string;
  toAddress: string;
  tokenAddress: string;
};

export type MultiSendRecipientClientType = {
  address: string;
  token: Token;
  amount: string;
};

export type ChainWorthType = {
  chain: string;
  chainID: ChainId;
  percentage: number;
  quotes: QuoteList<Quote>;
  usdValue: number;
};

export type TransactionPending = {
  hash: string;
  nonce: string;
};

export type Contact = {
  id: string;
  name: string;
  address: string;
};
