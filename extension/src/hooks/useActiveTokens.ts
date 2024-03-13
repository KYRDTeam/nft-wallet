import { isEmpty, uniqBy } from "lodash";
import { useMemo } from "react";
import { Token } from "src/config/types";
import { useChainTokenSelector } from "./useTokenSelector";

export default function useActiveTokens({
  tokensList,
}: {
  tokensList?: Token[];
}) {
  const {
    tokens: allTokens,
    customTokens,
    hiddenList,
  } = useChainTokenSelector();

  const list = useMemo(() => {
    // @ts-ignore
    let availableTokenList: Token[] = (() => {
      if (!isEmpty(tokensList)) return tokensList;

      if (!customTokens || isEmpty(customTokens)) return allTokens;
      return [...allTokens, ...customTokens];
    })();

    if (isEmpty(availableTokenList)) return [];

    return availableTokenList.filter((token: Token) => {
      if (isEmpty(hiddenList)) return true;
      return !hiddenList.includes(token.address);
    });
  }, [allTokens, customTokens, hiddenList, tokensList]);

  const deactiveTokens = useMemo(() => {
    let deactiveTokenList = (() => {
      if (tokensList) return tokensList;
      if (!customTokens || isEmpty(customTokens)) return allTokens;
      return [...allTokens, ...customTokens];
    })();

    return deactiveTokenList.filter((token: Token) => {
      if (isEmpty(hiddenList)) return true;
      return hiddenList.includes(token.address);
    });
  }, [allTokens, customTokens, hiddenList, tokensList]);

  return {
    activeTokens: uniqBy(list, "address"),
    deactiveTokens: uniqBy(deactiveTokens, "address"),
  };
}
