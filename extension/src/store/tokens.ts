import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { get, isArray, uniq, uniqBy } from "lodash";
import { formatNumber } from "src/utils/helper";
import { ChainId, Token } from "../config/types";
import type { RootState } from "../store";
import { getFullDisplayBalance } from "../utils/formatBalance";
interface TokensState {
  tokens: {
    [chainId in ChainId]: Token[];
  };
  customTokens: {
    [chainId in ChainId]: Token[];
  };
  favoriteTokens: string[];
  isLoadingBalance: boolean;
  hiddenList: string[];
}

const initialState: TokensState = {
  tokens: {
    [ChainId.ARBITRUM]: [],
    [ChainId.BSC]: [],
    [ChainId.AVALANCHE]: [],
    [ChainId.BSC_TESTNET]: [],
    [ChainId.MAINNET]: [],
    [ChainId.POLYGON]: [],
    [ChainId.CRONOS]: [],
    [ChainId.FANTOM]: [],
    [ChainId.ROPSTEN]: [],
    [ChainId.LINEA]: [],
    [ChainId.POLYGON_ZKEVM]: [],
  },
  customTokens: {
    [ChainId.ARBITRUM]: [],
    [ChainId.BSC]: [],
    [ChainId.AVALANCHE]: [],
    [ChainId.BSC_TESTNET]: [],
    [ChainId.MAINNET]: [],
    [ChainId.POLYGON]: [],
    [ChainId.CRONOS]: [],
    [ChainId.FANTOM]: [],
    [ChainId.ROPSTEN]: [],
    [ChainId.LINEA]: [],
    [ChainId.POLYGON_ZKEVM]: [],
  },
  isLoadingBalance: false,
  favoriteTokens: [],
  hiddenList: [],
};

export const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ chainId: ChainId; tokens: Token[] }>
    ) => {
      const { tokens, chainId } = action.payload;

      const sortedTokens = tokens
        .map((token, i: number) => {
          const newTokenObj = { ...token };
          let balance = token.balance || "0";
          newTokenObj.balance = balance;
          newTokenObj.humanizeBalance = getFullDisplayBalance(
            balance,
            token.decimals
          );

          newTokenObj.formattedBalance = `${formatNumber(
            getFullDisplayBalance(balance, token.decimals),
            4
          )}`;

          return newTokenObj;
        })
        .sort(
          (tokenA, tokenB) =>
            get(tokenB, "quotes.usd.value", 0) -
            get(tokenA, "quotes.usd.value", 0)
        );

      state.tokens[chainId] = sortedTokens;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingBalance = action.payload;
    },
    setHideToken: (
      state,
      action: PayloadAction<{ tokenAddress: string; isHidden: boolean }>
    ) => {
      const { tokenAddress, isHidden } = action.payload;
      const tokenAddressLowercase = tokenAddress.toLowerCase();

      if (isHidden) {
        state.hiddenList = !isArray(state.hiddenList)
          ? [tokenAddressLowercase]
          : uniq([...state.hiddenList, tokenAddressLowercase]);
      } else {
        state.hiddenList = state.hiddenList.filter(
          (address: string) => address !== tokenAddressLowercase
        );
      }
    },
    addCustomTokens: (
      state,
      action: PayloadAction<{
        chainId: ChainId;
        tokens: Token[];
        isOverride?: boolean;
        callbackSuccess?: () => void;
      }>
    ) => {
      const { chainId, tokens, isOverride, callbackSuccess } = action.payload;

      const formattedTokens = tokens.map((token) => {
        const newTokenObj = { ...token };
        let balance = token.balance || "0";
        newTokenObj.balance = balance;
        newTokenObj.humanizeBalance = getFullDisplayBalance(
          balance,
          token.decimals
        );
        newTokenObj.formattedBalance = `${formatNumber(
          getFullDisplayBalance(balance, token.decimals)
        )}`;

        return newTokenObj;
      });

      if (isOverride) {
        state.customTokens[chainId as ChainId] = formattedTokens;
        callbackSuccess && callbackSuccess();
        return;
      }

      state.customTokens[chainId as ChainId] = uniqBy(
        [...state.customTokens[chainId], ...formattedTokens],
        "address"
      );
      callbackSuccess && callbackSuccess();
    },
    removeCustomTokens: (
      state,
      action: PayloadAction<{ chainId: ChainId; tokenAddresses: string[] }>
    ) => {
      const { chainId, tokenAddresses } = action.payload;
      state.customTokens[chainId] = state.customTokens[chainId].filter(
        (token: Token) => !tokenAddresses.includes(token.address)
      );
    },
    setFavoriteTokens: (state, action: PayloadAction<string>) => {
      if (state.favoriteTokens.includes(action.payload)) {
        state.favoriteTokens = state.favoriteTokens.filter(
          (address: string) => address !== action.payload
        );
        return;
      }
      state.favoriteTokens = uniq([...state.favoriteTokens, action.payload]);
    },
  },
});

export const {
  setTokens,
  setHideToken,
  setLoading,
  addCustomTokens,
  removeCustomTokens,
  setFavoriteTokens,
} = tokensSlice.actions;

export const tokensSelector = (state: RootState) => state.tokens;

export default tokensSlice.reducer;
