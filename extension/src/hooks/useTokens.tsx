import { get } from "lodash";
import { useCallback } from "react";
import { globalSelector } from "../store/global";
import { useAppSelector } from "./useStore";
import { useChainTokenSelector } from "./useTokenSelector";

export const usePrice = () => {
  const { tokens } = useChainTokenSelector();
  const { market } = useAppSelector(globalSelector);

  const getPrice = useCallback(
    (address?: string): number => {
      const token = tokens?.find((t) => t.address === address);
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
