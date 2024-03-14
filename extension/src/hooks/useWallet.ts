import { ChainId } from "../config/types";
import { useAppDispatch, useAppSelector } from "./useStore";
import {
  keysSelector,
  setAccounts,
  setSelectedAccount,
  setAccountsName,
  deleteAccountsName,
} from "src/store/keys";
import { useCallback } from "react";
import { globalSelector } from "src/store/global";
import { formatTxParams } from "src/utils/web3";
import { TransactionFactory } from "@ethereumjs/tx";
import Common from "@ethereumjs/common";
import { sendMessage } from "src/services/extension";
import { fetchNetWorth } from "src/store/wallets";
import { NODE } from "../config/constants/chain";
import { flatten } from "lodash";

export function useWallet() {
  const { selectedAccount, keyringController, accounts, accountsTBA } =
    useAppSelector(keysSelector);
  const { chainId } = useAppSelector(globalSelector);
  const dispatch = useAppDispatch();

  const signTransaction = useCallback(
    async (txObj: any, address: string, opts = {}) => {
      const obj = await formatTxParams(chainId, txObj);
      const common = Common.custom({ chainId });
      let tx = TransactionFactory.fromTxData(obj);
      if (!NODE[chainId].EIP1559) {
        tx = TransactionFactory.fromTxData(obj, {
          common,
        });
      }
      const signedTx = await keyringController.signTransaction(
        tx,
        address,
        opts
      );
      return "0x" + signedTx.serialize().toString("hex");
    },
    [chainId, keyringController]
  );

  const setAccountsAndSelectAccount = useCallback(
    async (type: "IMPORT" | "CREATE" | "DELETE", name?: string) => {
      sendMessage({ type: "get_password" })
        .then((password: string) => {
          return keyringController.submitPassword(password);
        })
        .then((res: any) => {
          const accountsRes: string[] = [];
          const selectedAccount =
            type === "IMPORT"
              ? res.keyrings.at(-1).accounts[0]
              : type === "CREATE"
              ? res.keyrings[0].accounts.at(-1)
              : res.keyrings[0].accounts.at(0);
          res.keyrings.forEach((keyring: any) => {
            keyring.accounts.forEach((account: string) => {
              accountsRes.push(account);
            });
          });
          dispatch(setAccounts(accountsRes));
          dispatch(setSelectedAccount(selectedAccount));
          if ((type === "CREATE" || type === "IMPORT") && name) {
            dispatch(setAccountsName({ address: selectedAccount, name: name }));
          }
          if (type === "DELETE" && name) {
            dispatch(deleteAccountsName(name));
          }
          dispatch(
            fetchNetWorth({ address: selectedAccount, isForceSync: false })
          );
        });
    },
    [dispatch, keyringController]
  );

  return {
    account:
      selectedAccount &&
      (accounts.includes(selectedAccount) ||
        flatten(
          Object.values(accountsTBA).map((item) => item.map((i) => i.address))
        ).includes(selectedAccount))
        ? selectedAccount
        : undefined,
    activate: (a?: any, b?: (e?: any) => {}) => {},
    keyringController,
    signTransaction: signTransaction,
    active: false,
    chainId: chainId,
    connector: undefined,
    deactivate: () => {},
    error: "",
    ethereum: undefined,
    switchChain: (a: ChainId) => {},
    tried: false,
    setAccountsAndSelectAccount: setAccountsAndSelectAccount,
  };
}
