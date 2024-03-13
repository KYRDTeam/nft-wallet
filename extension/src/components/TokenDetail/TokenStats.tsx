import { Box, Divider, Flex } from "@chakra-ui/layout";
import { useState } from "react";

import { TokenDetail as TokenDetailType } from "src/config/types";
import { shortenNumber } from "src/utils/helper";
import SocialLink from "./SocialLink";

const TokenStats = ({ tokenDetail }: { tokenDetail?: TokenDetailType }) => {
  const [isShowAllText, setShowAllText] = useState(false);

  return (
    <Box flex="1" borderRadius="16" bg="gray.700" mt={{ base: 6, lg: 0 }} p="6">
      <Box fontSize="xl">Stats</Box>
      <Divider my="3" />
      <Flex justify="space-between">
        <Box>
          <Box color="whiteAlpha.600" fontSize="sm">
            Market Cap
          </Box>
          <Box my="3">
            ${shortenNumber(tokenDetail?.markets?.usd.marketCap || 0)}
          </Box>
        </Box>
        <Box>
          <Box color="whiteAlpha.600" fontSize="sm">
            All Time Low
          </Box>
          <Box my="3">${shortenNumber(tokenDetail?.markets?.usd.atl || 0)}</Box>
        </Box>
        <Box>
          <Box color="whiteAlpha.600" fontSize="sm">
            All Time High
          </Box>
          <Box my="3">${shortenNumber(tokenDetail?.markets?.usd.ath || 0)}</Box>
        </Box>
      </Flex>
      <Box color="whiteAlpha.700" fontSize="sm">
        <Box
          display="inline"
          dangerouslySetInnerHTML={{
            __html:
              tokenDetail?.description.slice(
                0,
                isShowAllText ? tokenDetail?.description.length : 400
              ) || "",
          }}
          css={{ a: { color: "#23a7b5" } }}
        />
        ...
        <Box
          display="inline"
          color="primary.300"
          cursor="pointer"
          onClick={() => setShowAllText(!isShowAllText)}
        >
          View <Box display="inline">{isShowAllText ? "less" : "more"}</Box>
        </Box>
      </Box>

      <Box>
        <SocialLink
          tokenAddr={tokenDetail?.address}
          links={tokenDetail?.links}
        />
      </Box>
    </Box>
  );
};

export default TokenStats;
