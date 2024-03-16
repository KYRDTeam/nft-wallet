import { useEffect } from "react";
import LocalStore from "src/background/local-store";
import { sendMessage } from "src/services/extension";
import {
  keysSelector,
  setAccounts,
  setLoading,
  setVault,
  setSelectedAccount,
  setAccountsName,
} from "src/store/keys";
import { useAppDispatch, useAppSelector } from "./useStore";
import { flatten } from "lodash";

const localStore = new LocalStore();

export const usePersistAccount = () => {
  const dispatch = useAppDispatch();
  const {
    keyringController,
    accounts,
    accountsName,
    accountsTBA,
    selectedAccount,
  } = useAppSelector(keysSelector);

  useEffect(() => {
    localStore.get().then((data) => {
      if (data.vault) dispatch(setVault(data));
    });
    if (
      selectedAccount &&
      (selectedAccount in accounts ||
        flatten(
          Object.values(accountsTBA).map((item) => item.map((i) => i.address))
        ).includes(selectedAccount?.toLowerCase()))
    ) {
      dispatch(setSelectedAccount(selectedAccount));
    }
  }, [accounts, accountsTBA, dispatch, selectedAccount]);

  useEffect(() => {
    if (keyringController) {
      dispatch(setLoading(true));
      sendMessage({ type: "get_password" })
        .then((password) => {
          if (password) {
            return keyringController.submitPassword(password);
          }
          return Promise.reject();
        })
        .then((res) => {
          const accounts: string[] = [];
          res.keyrings.forEach((keyring: any) => {
            accounts.push(...keyring.accounts);
          });
          dispatch(setAccounts(accounts));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  }, [dispatch, keyringController]);

  useEffect(() => {
    accounts.forEach((account) => {
      if (accountsName[account]) {
        dispatch(
          setAccountsName({ address: account, name: accountsName[account] })
        );
      } else {
        dispatch(
          setAccountsName({
            address: account,
            name: "Account " + accounts.indexOf(account),
          })
        );
      }
    });
  }, [accounts, accountsName, dispatch]);

  useEffect(() => {
    localStore.get().then((data) => {
      if (!data.vault) {
        dispatch(setAccounts([]));
        dispatch(setSelectedAccount(""));
      }
    });
  }, [dispatch]);
};
