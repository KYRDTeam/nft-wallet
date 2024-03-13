import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChainId, ChainWorthType, Quote, QuoteList } from "src/config/types";
import type { RootState } from "../store";

interface Wallet {
  name: string;
  address: string;
}

interface WalletsState {
  wallets: Wallet[];
  currentWallet?: string;
  isForceFetchingTotalBalance: boolean;
  isCacheFetchingTotalBalance: boolean;
  totalNetWorth: QuoteList<Quote> | undefined;
  chainWorth: ChainWorthType[];
  hiddenWorth: { [chainId in ChainId]: QuoteList<number> | {} };
}

const initialState: WalletsState = {
  wallets: [],
  currentWallet: undefined,
  totalNetWorth: undefined,
  chainWorth: [],
  hiddenWorth: {
    [ChainId.ARBITRUM]: {},
    [ChainId.BSC]: {},
    [ChainId.AVALANCHE]: {},
    [ChainId.BSC_TESTNET]: {},
    [ChainId.MAINNET]: {},
    [ChainId.POLYGON]: {},
    [ChainId.CRONOS]: {},
    [ChainId.FANTOM]: {},
    [ChainId.ROPSTEN]: {},
  },
  isForceFetchingTotalBalance: false,
  isCacheFetchingTotalBalance: false,
};

export const walletsSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    addWallet: (state, action: PayloadAction<Wallet>) => {
      const { address } = action.payload;
      const wallets = [...state.wallets];
      if (wallets.findIndex((w) => w.address === address) === -1) {
        wallets.push(action.payload);
        state.wallets = wallets;
        state.currentWallet = address;
      }
    },
    removeWallet: (state, action: PayloadAction<string>) => {
      const address = action.payload;
      const wallets = [...state.wallets];
      const addressIndex = wallets.findIndex((w) => w.address === address);
      if (addressIndex >= 0) {
        wallets.splice(addressIndex, 1);
        state.wallets = wallets;
        state.currentWallet = wallets[0]?.address;
      }
    },
    editWallet: (state, action: PayloadAction<Wallet>) => {
      const { address } = action.payload;
      const wallets = [...state.wallets];
      const addressIndex = wallets.findIndex((w) => w.address === address);
      if (addressIndex >= 0) {
        wallets[addressIndex] = action.payload;
        state.wallets = wallets;
      }
    },
    selectWallet: (state, action: PayloadAction<string | undefined>) => {
      state.currentWallet = action.payload?.toLowerCase();
    },
    setNetWorth: (
      state,
      action: PayloadAction<{
        totalNetWorth: QuoteList<Quote>;
        chainWorth: {
          chain: string;
          chainID: ChainId;
          percentage: number;
          quotes: QuoteList<Quote>;
          usdValue: number;
        }[];
      }>,
    ) => {
      state.totalNetWorth = action.payload.totalNetWorth;
      state.chainWorth = action.payload.chainWorth;
    },
    fetchNetWorth: (state, action: PayloadAction<{ address: string; isForceSync: boolean }>) => {},
    setHiddenWorth: (state, action: PayloadAction<{ chainId: ChainId; quote: QuoteList<number> }>) => {
      const { chainId, quote } = action.payload;
      state.hiddenWorth[chainId] = quote;
    },
    syncHiddenWorth: (state, action: PayloadAction<{ chainId: ChainId }>) => {},
    setCacheFetchingTotalBalanceState: (state, action: PayloadAction<boolean>) => {
      state.isCacheFetchingTotalBalance = action.payload;
    },
    setForceFetchingTotalBalanceState: (state, action: PayloadAction<boolean>) => {
      state.isForceFetchingTotalBalance = action.payload;
    },
  },
});

export const {
  addWallet,
  removeWallet,
  editWallet,
  selectWallet,
  setNetWorth,
  fetchNetWorth,
  setHiddenWorth,
  syncHiddenWorth,
  setCacheFetchingTotalBalanceState,
  setForceFetchingTotalBalanceState,
} = walletsSlice.actions;

export const walletsSelector = (state: RootState) => state.wallets;

export default walletsSlice.reducer;
