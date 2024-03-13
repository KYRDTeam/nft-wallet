import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendMessage } from "src/services/extension";
import type { RootState } from "../store";

const KeyringController = require("eth-keyring-controller");
interface KeysState {
  password: string;
  isLoading: boolean;
  vault?: { vault: string };
  keyringController?: any;
  selectedAccount?: string;
  accounts: string[];
  accountsName: { [key: string]: string };
}

const initialState: KeysState = {
  password: "",
  isLoading: false,
  accounts: [],
  accountsName: {},
  selectedAccount: "",
};

export const keysSlice = createSlice({
  name: "keys",
  initialState,
  reducers: {
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setVault: (state, action: PayloadAction<{ vault: string }>) => {
      state.vault = action.payload;
      if (!state.keyringController) {
        const keyringController = new KeyringController({
          initState: action.payload,
        });
        state.keyringController = keyringController;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAccounts: (state, action: PayloadAction<string[]>) => {
      const accounts = action.payload;
      state.accounts = accounts;
      if (!state.selectedAccount) {
        state.selectedAccount = accounts[0];
        sendMessage({ type: "set_selected_account", selectedAccount: accounts[0] });
      }
    },
    setAccountsName: (
      state,
      action: PayloadAction<{
        address: string;
        name: string;
      }>,
    ) => {
      console.log(action)
      const addressKey = action.payload.address as keyof typeof state.accountsName;
      state.accountsName[addressKey] = action.payload.name;
    },
    deleteAccountsName: (state, action: PayloadAction<string>) => {
      const addressKey = action.payload as keyof typeof state.accountsName;
      let newAccountsName = {};
      for (const key in state.accountsName) {
        if (key !== addressKey) {
          // @ts-ignore
          newAccountsName[key] = state.accountsName[key];
        }
      }
      state.accountsName = { ...newAccountsName };
    },
    resetState: () => initialState,
    resetKeyringController: (state, action: PayloadAction<{ vault: string }>) => {
      state.vault = action.payload;
      const keyringController = new KeyringController({
        initState: action.payload,
      });
      state.keyringController = keyringController;
    },
    setSelectedAccount: (state, action: PayloadAction<string>) => {
      console.log(action.payload)
      state.selectedAccount = action.payload;
      sendMessage({ type: "set_selected_account", selectedAccount: action.payload });
    },
    lock: (state) => {
      state.password = "";
      state.accounts = [];
      state.keyringController.setLocked();
      sendMessage({ type: "set_password", password: "" });
    },
  },
});

export const {
  setPassword,
  setVault,
  setLoading,
  setAccounts,
  setSelectedAccount,
  lock,
  setAccountsName,
  deleteAccountsName,
  resetState,
  resetKeyringController,
} = keysSlice.actions;

export const keysSelector = (state: RootState) => state.keys;

export default keysSlice.reducer;