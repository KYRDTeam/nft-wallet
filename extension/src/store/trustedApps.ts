import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendMessage } from "src/services/extension";
import type { RootState } from "src/store";

export interface IPage {
  title?: string;
  domain?: string;
  icon?: string;
}

type trustedApps = { [key: string]: IPage[] };

interface trustedAppsState {
  trustedApps: trustedApps;
}

const initialState: trustedAppsState = {
  trustedApps: {},
};

export const trustedAppsSlice = createSlice({
  name: "trustedApps",
  initialState,
  reducers: {
    setTrustedApps: (state, action: PayloadAction<{ address: string; page: IPage }>) => {
      const addressKey = action.payload.address as keyof typeof state.trustedApps;
      if (!state.trustedApps[addressKey]) {
        state.trustedApps[addressKey] = [];
      }
      if (!state.trustedApps[addressKey].find((page: IPage) => page.domain === action.payload.page.domain)) {
        state.trustedApps[addressKey].push(action.payload.page);
      }
    },
    revokeTrustedApp: (state, action: PayloadAction<{ address: string; domain: string }>) => {
      const addressKey = action.payload.address as keyof typeof state.trustedApps;
      state.trustedApps[addressKey] = state.trustedApps[addressKey].filter(
        (page: IPage) => page.domain !== action.payload.domain,
      );
      sendMessage({ type: "revoke_trusted_app", address: action.payload.address, domain: action.payload.domain });
    },
  },
});

export const { setTrustedApps, revokeTrustedApp } = trustedAppsSlice.actions;

export const trustedAppsSelector = (state: RootState) => state.trustedApps;

export default trustedAppsSlice.reducer;
