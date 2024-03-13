import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sortBy, uniqBy } from "lodash";
import { TransactionPending } from "../config/types";
import type { RootState } from "../store";

interface HashState {
  hashList: TransactionPending[];
}

const initialState: HashState = {
  hashList: [],
};

export const hashSlice = createSlice({
  name: "hash",
  initialState,
  reducers: {
    getHashList: (state, action: PayloadAction<any[]>) => {
      state.hashList = [...action.payload];
    },
    updateHashList: (state, action: PayloadAction<any>) => {
      const newList = [...state.hashList].filter((e: any) => e.nonce !== action.payload.nonce);

      state.hashList = sortBy(uniqBy([...newList, { ...action.payload, isNew: true }], "hash"), ["nonce"]);
    },
    clearHashListByAccount: (state, action: PayloadAction<any>) => {
      const accountId = action.payload;
      const newHashList = [...state.hashList].filter((e: any) => e.account !== accountId);

      state.hashList = newHashList;
    },
    updateHashItem: (state, action: PayloadAction<any>) => {
      const currentHash = [...state.hashList].map((e: any) => {
        if (e.hash === action.payload) {
          return { ...e, isNew: false };
        }
        return e;
      });
      state.hashList = currentHash;
    },
    removeHashItem: (state, action: PayloadAction<any>) => {
      const hashId = action.payload;
      const newList = [...state.hashList].filter((e: any) => e.hash !== hashId);
      state.hashList = [...newList];
    },
  },
});

export const { getHashList, updateHashList, clearHashListByAccount, removeHashItem, updateHashItem } =
  hashSlice.actions;

export const hashSelector = (state: RootState) => state.hash;

export default hashSlice.reducer;
