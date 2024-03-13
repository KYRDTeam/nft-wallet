import { get } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { EarnToken } from "../config/types";
import { LENDING_PLATFORM } from "../config/constants/constants";
import {
  setDistributionBalance,
  setEarn,
  setEarnBalances,
  setPoolBalances,
} from "../store/earn";
import { globalSelector } from "../store/global";
import {
  fetchDistributionBalance,
  fetchLendingBalances,
  fetchLendingOverview,
  fetchPoolBalances,
} from "../utils/krystalService";
import { useAppDispatch, useAppSelector } from "./useStore";
import { useChainTokenSelector } from "./useTokenSelector";
import { useWallet } from "./useWallet";

export const useFetchEarnList = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);
  const { tokens } = useChainTokenSelector();
  const { account } = useWallet();
  const [earnList, setEarnList] = useState<EarnToken[]>([]);

  useEffect(() => {
    fetchLendingOverview(chainId)
      .then((data) => {
        setEarnList(data || []);
      })
      .catch((e) => {
        throw e;
      });
  }, [chainId, dispatch]);

  useEffect(() => {
    const earnListWithBalance = earnList.map((t) => {
      const foundToken = tokens.find(
        (token) => token.address.toLowerCase() === t.address.toLowerCase()
      );
      return {
        ...t,
        balance: foundToken?.balance,
        humanizeBalance: foundToken?.humanizeBalance,
        formattedBalance: foundToken?.formattedBalance,
        isNative: foundToken?.isNative,
      };
    });
    dispatch(setEarn(earnListWithBalance as EarnToken[]));
  }, [earnList, tokens, dispatch]);

  // Fetch tokens balances
  useEffect(() => {
    fetchLendingBalances(chainId, account)
      .then((data) => {
        dispatch(setEarnBalances(data || []));
      })
      .catch((e) => {
        throw e;
      });
  }, [chainId, account, dispatch]);

  // Fetch fetch distribution balance
  useEffect(() => {
    fetchDistributionBalance(chainId, LENDING_PLATFORM[chainId], account)
      .then((data) => {
        dispatch(setDistributionBalance(data));
      })
      .catch((e) => {
        dispatch(setDistributionBalance());
        throw e;
      });
  }, [chainId, account, dispatch]);

  // Fetch fetch lp balances
  useEffect(() => {
    fetchPoolBalances(chainId, account)
      .then((data) => {
        if (data) {
          dispatch(setPoolBalances(data));
        }
      })
      .catch((e) => {
        throw e;
      });
  }, [chainId, account, dispatch]);
};

export const usePrice = () => {
  const { tokens } = useChainTokenSelector();
  const { market } = useAppSelector(globalSelector);

  const getPrice = useCallback(
    (address?: string): number => {
      const token = tokens.find((t) => t.address === address);
      return (
        get(token, "quotes.usd.price") ||
        get(token, "quotes.usd.rate") ||
        get(market, `${token?.address}.quotes.usd.price`) ||
        0
      );
    },
    [market, tokens]
  );

  return { getPrice };
};

export const usePriceByBaseCurrency = () => {
  const { tokens } = useChainTokenSelector();
  const { currency } = useAppSelector(globalSelector);
  const { market } = useAppSelector(globalSelector);

  const getPrice = useCallback(
    (address?: string): number => {
      const token = tokens.find((t) => t.address === address);
      return (
        get(token, `quotes.${currency}.price`) ||
        get(token, `quotes.${currency}.rate`) ||
        get(market, `${token?.address}.quotes.${currency}.price`) ||
        0
      );
    },
    [currency, market, tokens]
  );

  return { getPrice };
};
