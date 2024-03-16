import { isEmpty, union, uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NODE } from "../config/constants/chain";
import { Token, Balance } from "../config/types";

import { globalSelector } from "../store/global";
import { addCustomTokens, setLoading, setTokens } from "../store/tokens";
import { syncHiddenWorth } from "../store/wallets";
import { fetchTokenBalances, fetchTokenList } from "../utils/krystalService";
import useRefresh from "./useRefresh";
import { useAppDispatch, useAppSelector } from "./useStore";
import { useChainTokenSelector } from "./useTokenSelector";
import { useWallet } from "./useWallet";

export const useFetchTokens = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);
  const { customTokens } = useChainTokenSelector();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [chainTokens, setChainTokens] = useState<Token[]>([]);
  const { account } = useWallet();
  const { fastRefresh } = useRefresh();

  const internalStateFetchingTokenRef = useRef(false);

  const fetchTokenMarket = useCallback(async () => {
    try {
      internalStateFetchingTokenRef.current = true;
      setChainTokens([]);
      const tokenList = await fetchTokenList(chainId);
      setChainTokens(tokenList || []);
    } catch (e) {
      throw e;
    }
    internalStateFetchingTokenRef.current = false;
  }, [chainId]);

  // Fetch support tokens list
  useEffect(() => {
    fetchTokenMarket();
  }, [fetchTokenMarket]);

  const currentChainId = useRef(chainId);
  const currentAccount = useRef(account);

  const fetchBalance = useCallback(async () => {
    try {
      internalStateFetchingTokenRef.current = true;
      const balanceList = await fetchTokenBalances(chainId, account);
      const availableTokenList = uniqBy(
        union(
          (balanceList || []).map((b) => {
            return {
              ...b.token,
              balance: b.balance,
              quotes: b.quotes,
            };
          }),
          chainTokens
        ),
        "address"
      ).map((token: Token) => ({
        ...token,
        isNative:
          token.address.toLowerCase() === NODE[chainId].address.toLowerCase(),
      }));

      dispatch(
        setTokens({
          tokens: availableTokenList,
          chainId,
        })
      );

      setBalances(balanceList || []);

      dispatch(syncHiddenWorth({ chainId }));
      dispatch(setLoading(false));
    } catch (e) {
      dispatch(setLoading(false));
      throw e;
    }

    dispatch(setLoading(false));
    internalStateFetchingTokenRef.current = false;
  }, [chainId, chainTokens, account, dispatch]);

  // Fetch tokens balances
  useEffect(() => {
    if (
      currentChainId.current !== chainId ||
      currentAccount.current !== account
    ) {
      dispatch(setLoading(true));
    }

    currentChainId.current = chainId;
    currentAccount.current = account;

    fetchBalance();
  }, [chainId, account, dispatch, fastRefresh, fetchBalance]);

  const isAddedCustomToken = useMemo(() => {
    if (!chainId) return false;
    if (!customTokens) return false;

    return !isEmpty(customTokens);
  }, [chainId, customTokens]);

  useEffect(() => {
    if (!customTokens || isEmpty(customTokens)) return;

    const customTokensWithBalance = customTokens.map((token: Token) => {
      const balance = balances.find((b) => {
        return b.token.address.toLowerCase() === token.address.toLowerCase();
      });

      if (balance) {
        return {
          ...token,
          balance: balance.balance,
          quotes: balance.quotes,
        };
      }

      return { ...token, balance: "0", formattedBalance: "0" };
    });

    dispatch(
      addCustomTokens({
        chainId,
        tokens: [...customTokensWithBalance],
        isOverride: true,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances, chainId, isAddedCustomToken, dispatch]);
};
