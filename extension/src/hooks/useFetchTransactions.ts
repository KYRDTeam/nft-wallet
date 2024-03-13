import { useState, useCallback, useEffect, useMemo } from "react";
import { orderBy, get, uniq } from "lodash";
import moment from "moment";
import { Token, Transaction } from "src/config/types";
import { KRYSTAL_API } from "src/config/constants/constants";
import { useAppSelector } from "./useStore";
import { globalSelector } from "src/store/global";
import { useChainTokenSelector } from "./useTokenSelector";
import { useWallet } from "./useWallet";

type Filter = {
  from?: string | null;
  to?: string | null;
  types?: Array<string>;
  displayedTokens?: Array<string>;
  status: string;
};
export const defaultFilter = {
  from: "",
  to: "",
  types: [],
  displayedTokens: [],
  status: "complete",
};

export default function useFetchTransactions() {
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { tokens: allTokens } = useChainTokenSelector();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<Filter>(defaultFilter);

  const allSupportedTokenSymbols = useMemo(() => {
    const allTokenSymbols: string[] = uniq(allTokens.map((token: Token) => token.symbol));
    return allTokenSymbols;
  }, [allTokens]);

  const fetchTransaction = useCallback(async () => {
    if (!account) return;
    try {
      setLoading(true);
      const url = KRYSTAL_API[chainId];
      const result = await fetch(`${url}/v1/account/transactions?address=${account}`);
      const data = await result.json();
      if (data.transactions) {
        const orderByTimestamp = orderBy(data.transactions, ["timestamp"], ["desc"]);
        setTransactions(orderByTimestamp);
      }
      setLoading(false);
    } catch (e: any) {
      setError(e);
      setLoading(false);
    }
  }, [chainId, account]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  const transactionFiltered = useMemo(() => {
    if (loading) return [];
    return transactions.filter((transaction: Transaction) => {
      if (filter.status === "complete" && transaction.status === "pending") {
        return false;
      }

      if (filter.status === "pending" && transaction.status !== "pending") {
        return false;
      }

      if (filter.from && moment.unix(transaction.timestamp).isSameOrBefore(filter.from)) {
        return false;
      }

      if (filter.to && moment.unix(transaction.timestamp).isSameOrAfter(filter.to)) {
        return false;
      }

      let matchStatuses = false;
      let matchTokens = false;
      if (filter.types?.length === 0 || filter.types?.includes(transaction.type)) {
        matchStatuses = true;
      }

      let filteredInListSymbol = allSupportedTokenSymbols;
      if (filter.displayedTokens && filter.displayedTokens.length > 0) {
        filteredInListSymbol = filter.displayedTokens;
      }

      const sendTokenSymbol = get(transaction, "extraData.sendToken.symbol", "");
      const receiveTokenSymbol = get(transaction, "extraData.receiveToken.symbol", "");
      const tokenSymbol = get(transaction, "extraData.token.symbol", "");

      let isExisted =
        (sendTokenSymbol && filteredInListSymbol.includes(sendTokenSymbol)) ||
        (receiveTokenSymbol && filteredInListSymbol.includes(receiveTokenSymbol)) ||
        (tokenSymbol && filteredInListSymbol.includes(tokenSymbol));

      if (filter.displayedTokens?.length === 0 || isExisted) {
        matchTokens = true;
      }

      return matchStatuses && matchTokens;
    });
  }, [
    allSupportedTokenSymbols,
    filter.displayedTokens,
    filter.from,
    filter.status,
    filter.to,
    filter.types,
    loading,
    transactions,
  ]);

  const onFilter = useCallback(
    (filtered: Filter) => {
      setFilter({ ...filter, ...filtered });
    },
    [filter],
  );

  return {
    loading,
    transactions: transactionFiltered,
    filter,
    onFilter,
    error,
  };
}
