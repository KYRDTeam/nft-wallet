import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AppSettingKey,
  ChainId,
  GasPrices,
  SupportedCurrencyType,
  TokenMarketType,
} from "../config/types";
import type { RootState } from "../store";
interface GlobalState {
  baseFee: string;
  chainId: ChainId;
  currency: SupportedCurrencyType;
  gasPrices?: GasPrices;
  isFetchingMarket: boolean;
  isPrivateMode: boolean;
  isShowChains: boolean;
  market: { [address: string]: TokenMarketType };
  priorityFees?: GasPrices;
  baseCurrencyRate: { [currency in SupportedCurrencyType]: number };
  appSettings: { [key in AppSettingKey]?: { key: string; content: string } };
}

const initialState: GlobalState = {
  baseFee: "0",
  chainId: 1,
  currency: "usd",
  gasPrices: undefined,
  isFetchingMarket: false,
  isPrivateMode: false,
  isShowChains: true,
  market: {},
  baseCurrencyRate: {
    usd: 1,
    btc: 1,
    matic: 1,
    bnb: 1,
    eth: 1,
    cro: 1,
    ftm: 1,
    avax: 1,
  },
  appSettings: {},
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setChainId: (state, action: PayloadAction<ChainId>) => {
      state.chainId = action.payload;
    },
    setGasPrices: (
      state,
      action: PayloadAction<
        | { baseFee: string; gasPrice: GasPrices; priorityFee: GasPrices }
        | undefined
      >
    ) => {
      state.gasPrices = action.payload?.gasPrice;
      state.baseFee = action.payload?.baseFee || "0";
      state.priorityFees = action.payload?.priorityFee;
    },
    setPrivateMode: (state, action: PayloadAction<boolean>) => {
      state.isPrivateMode = !!action.payload;
    },
    setMarket: (
      state,
      action: PayloadAction<{
        market: TokenMarketType[];
        isForceUpdate: boolean;
      }>
    ) => {
      const { market, isForceUpdate } = action.payload;
      let marketFormatted = isForceUpdate ? {} : { ...state.market };

      market.forEach((marketToken: TokenMarketType) => {
        marketFormatted[marketToken.address] = marketToken;
      });

      state.market = marketFormatted;
      return;
    },
    setFetchingMarket: (state, action: PayloadAction<boolean>) => {
      state.isFetchingMarket = action.payload;
    },
    setCurrency: (state, action: PayloadAction<SupportedCurrencyType>) => {
      state.currency = action.payload;
    },
    setBaseCurrencyRate: (
      state,
      action: PayloadAction<{ [currency in SupportedCurrencyType]: number }>
    ) => {
      state.baseCurrencyRate = { ...state.baseCurrencyRate, ...action.payload };
    },
    setAppSettings: (
      state,
      action: PayloadAction<{
        [key in AppSettingKey]?: { key: string; content: string };
      }>
    ) => {
      state.appSettings = action.payload;
    },
    toggleShowChains: (state, action: PayloadAction<boolean>) => {
      state.isShowChains = action.payload;
    },
  },
});

export const {
  setAppSettings,
  setBaseCurrencyRate,
  setChainId,
  setCurrency,
  setFetchingMarket,
  setGasPrices,
  setMarket,
  setPrivateMode,
  toggleShowChains,
} = globalSlice.actions;

export const globalSelector = (state: RootState) => state.global;

export default globalSlice.reducer;
