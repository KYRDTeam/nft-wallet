import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  EarnToken,
  EarnBalance,
  DistributionBalance,
  PoolBalances,
} from "../config/types";
import type { RootState } from "../store";
interface EarnState {
  earnList: EarnToken[];
  earnBalances: EarnBalance[];
  poolBalances: PoolBalances;
  distributionBalance?: DistributionBalance;
}

const initialState: EarnState = {
  earnList: [],
  earnBalances: [],
  poolBalances: {},
};

export const earnSlice = createSlice({
  name: "earn",
  initialState,
  reducers: {
    setEarn: (state, action: PayloadAction<EarnToken[]>) => {
      state.earnList = [...action.payload];
    },
    setEarnBalances: (state, action: PayloadAction<EarnBalance[]>) => {
      state.earnBalances = [...action.payload];
    },
    setDistributionBalance: (
      state,
      action: PayloadAction<DistributionBalance | undefined>
    ) => {
      state.distributionBalance = action.payload;
    },
    setPoolBalances: (state, action: PayloadAction<PoolBalances>) => {
      state.poolBalances = action.payload;
    },
  },
});

export const {
  setEarn,
  setEarnBalances,
  setDistributionBalance,
  setPoolBalances,
} = earnSlice.actions;

export const earnSelector = (state: RootState) => state.earn;

export default earnSlice.reducer;
