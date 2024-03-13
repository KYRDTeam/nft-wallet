import React, { useCallback } from "react";
import { AutoSizer, List } from "react-virtualized";
import { Token } from "src/config/types";
import { TokenItem } from "./TokenItem";

export const TokenList = ({ tokens }: { tokens: Token[] }) => {
  const renderRow = useCallback(
    ({ index, key, style }: { index: number; key: any; style: any }) => (
      <TokenItem
        key={tokens[index].address}
        style={style}
        data={tokens[index]}
      />
    ),
    [tokens]
  );

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <List
            width={width}
            height={height}
            rowHeight={64}
            rowRenderer={renderRow}
            rowCount={tokens.length}
          />
        );
      }}
    </AutoSizer>
  );
};
