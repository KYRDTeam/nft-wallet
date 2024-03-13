import { useMediaQuery } from "@chakra-ui/react";
import { max } from "lodash";
import { useCallback } from "react";
import { AutoSizer, List } from "react-virtualized";
import { Token } from "src/config/types";
import { TokenRow } from "./TokenRow";

export default function TokenList({ tokens }: { tokens: Token[] }) {
  const [isMobile] = useMediaQuery("(max-width: 720px)");

  const renderRow = useCallback(
    ({ index, key, style }: { index: number; key: any; style: any }) => (
      <TokenRow key={tokens[index]?.address || ""} style={style} data={tokens[index] || {}} isMobile={isMobile} />
    ),
    [isMobile, tokens],
  );

  return (
    <AutoSizer defaultHeight={300}>
      {({ width, height }) => {
        return (
          <List
            width={width}
            height={height}
            rowHeight={72}
            rowRenderer={renderRow}
            // @ts-ignore
            rowCount={max([tokens.length])}
          />
        );
      }}
    </AutoSizer>
  );
}
