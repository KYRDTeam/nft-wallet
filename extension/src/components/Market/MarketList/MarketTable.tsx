import { useAppSelector } from "src/hooks/useStore";

import { Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AutoSizer, List } from "react-virtualized";
import { MarketTokenRow } from "./MarketTokenRow";
import {
  OrderByType,
  QuickFilterEnum,
  QuickFilterType,
  TokenMarketType,
} from "src/config/types";
import { debounce, get, orderBy } from "lodash";
import { globalSelector } from "src/store/global";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";

export default function MarketTable({
  filter,
}: {
  filter: {
    orderBy: { [field: string]: OrderByType };
    keyword: string;
    quickFilter: QuickFilterType;
    onlyFavorite: boolean;
  };
}) {
  const [isMobile] = useMediaQuery("(max-width: 720px)");
  const { favoriteTokens } = useChainTokenSelector();
  const { market } = useAppSelector(globalSelector);
  const [syncKeyword, setSyncKeyword] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    debounce(() => {
      setTimeout(() => {
        setSyncKeyword(filter.keyword);
      });
    }, 500),
    [filter.keyword]
  );

  const marketTokens = useMemo(() => {
    const keywordLowercase = syncKeyword.toLowerCase();

    let tokenFiltered = Object.keys(market).map((tokenAddress: string) => {
      return market[tokenAddress];
    });

    tokenFiltered = tokenFiltered.filter((token) =>
      ["PROMOTION", "VERIFIED"].includes(token.tag)
    );

    if (filter.quickFilter) {
      switch (filter.quickFilter) {
        case QuickFilterEnum.TOP_GAINERS:
          tokenFiltered = orderBy(
            tokenFiltered,
            (token: TokenMarketType) =>
              get(token, `quotes.usd.price24hChangePercentage`, 0),
            ["desc"]
          );
          break;
        case QuickFilterEnum.TOP_LOSERS:
          tokenFiltered = orderBy(
            tokenFiltered,
            (token: TokenMarketType) =>
              get(token, `quotes.usd.price24hChangePercentage`, 0),
            ["asc"]
          );
          break;
        case QuickFilterEnum.TRENDING:
          tokenFiltered = orderBy(
            tokenFiltered,
            (token: TokenMarketType) => get(token, `quotes.usd.volume24h`, 0),
            ["desc"]
          );
          break;
        default:
          break;
      }
      tokenFiltered = tokenFiltered.slice(0, 10);
    }

    if (filter.onlyFavorite) {
      tokenFiltered = tokenFiltered.filter((token: TokenMarketType) =>
        favoriteTokens.includes(token.address)
      );
    }

    tokenFiltered = tokenFiltered.filter(
      (token: TokenMarketType) =>
        token.name.toLowerCase().includes(keywordLowercase) ||
        token.address.toLowerCase().includes(keywordLowercase) ||
        token.symbol.toLowerCase().includes(keywordLowercase)
    );

    if (Object.keys(filter.orderBy)[0] === "symbol") {
      return orderBy(
        tokenFiltered,
        [(token: TokenMarketType) => token.symbol.toLowerCase()],
        Object.values(filter.orderBy)[0] || false
      );
    }

    return orderBy(
      tokenFiltered,
      Object.keys(filter.orderBy)[0],
      Object.values(filter.orderBy)[0] || false
    );
  }, [
    favoriteTokens,
    filter.onlyFavorite,
    filter.orderBy,
    filter.quickFilter,
    market,
    syncKeyword,
  ]);

  const renderRow = useCallback(
    ({
      style,
      index,
    }: {
      index: number;
      key: any;
      columnIndex: any;
      parent: any;
      style: any;
    }) => (
      <MarketTokenRow
        key={marketTokens[index].address}
        style={style}
        data={marketTokens[index]}
        isMobile={isMobile}
      />
    ),
    [isMobile, marketTokens]
  );

  if (marketTokens.length === 0) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="400px"
        color="whiteAlpha.500"
        fontStyle="italic"
      >
        <Text>No token found.</Text>
      </Flex>
    );
  }

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <List
            width={width}
            height={height}
            rowHeight={72}
            overscanRowCount={8}
            rowRenderer={renderRow}
            rowCount={marketTokens.length}
            // @ts-ignore
            style={{ overflowY: "overlay" }}
          />
        );
      }}
    </AutoSizer>
  );
}
