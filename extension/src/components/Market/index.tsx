import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import {
  OrderByType,
  QuickFilterEnum,
  QuickFilterType,
} from "src/config/types";
import {
  TopGainersIllus,
  TopLosersIllus,
  TrendingIllus,
} from "../common/icons";
import { Header } from "./Header";
import { MarketList } from "./MarketList";

const Market = () => {
  const [keyword, setKeyword] = useState("");
  const [orderBy, setOrderBy] = useState<{
    [field: string]: OrderByType;
  }>({});
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>(null);

  const handleQuickFilter = useCallback(
    (type: QuickFilterType) => {
      if (type === quickFilter) {
        setQuickFilter(null);
        return;
      }
      setQuickFilter(type);
    },
    [quickFilter]
  );

  const checkSelectedQuickFilter = useCallback(
    (type: QuickFilterType) => {
      return type === quickFilter;
    },
    [quickFilter]
  );

  return (
    <Container maxW="container.xl" my="8">
      <Header keyword={keyword} setKeyword={setKeyword} />
      <Box mt="2">
        <Flex
          gap={4}
          mt="6"
          flexWrap="nowrap"
          direction={{ base: "column-reverse", xl: "row" }}
        >
          <Box
            flex="1.75"
            borderRadius="16"
            bg="gray.700"
            mr={{ base: 0, xl: 6 }}
          >
            <MarketList
              keyword={keyword}
              orderBy={orderBy}
              quickFilter={quickFilter}
              onOrderBy={(orderByChanged: { [field: string]: OrderByType }) =>
                setOrderBy(orderByChanged)
              }
            />
          </Box>
          <Flex
            direction="column"
            flex="1"
            borderRadius="16"
            mt={{ base: 6, xl: 0 }}
            height="fit-content"
            display={{ base: "none", xl: "flex" }}
          >
            <Button
              h="20"
              mb="6"
              fontSize="xl"
              borderWidth="1px"
              borderColor={
                checkSelectedQuickFilter(QuickFilterEnum.TOP_GAINERS)
                  ? "primary.300"
                  : "transparent"
              }
              onClick={() => {
                handleQuickFilter(QuickFilterEnum.TOP_GAINERS);
              }}
              display="flex"
              justifyContent="space-between"
            >
              Top Gainers
              <TopGainersIllus boxSize="20" />
            </Button>
            <Button
              h="20"
              mb="6"
              fontSize="xl"
              borderWidth="1px"
              borderColor={
                checkSelectedQuickFilter(QuickFilterEnum.TOP_LOSERS)
                  ? "primary.300"
                  : "transparent"
              }
              onClick={() => {
                handleQuickFilter(QuickFilterEnum.TOP_LOSERS);
              }}
              display="flex"
              justifyContent="space-between"
            >
              Top Losers
              <TopLosersIllus boxSize="16" />
            </Button>
            <Button
              h="20"
              mb="6"
              fontSize="xl"
              borderWidth="1px"
              borderColor={
                checkSelectedQuickFilter(QuickFilterEnum.TRENDING)
                  ? "primary.300"
                  : "transparent"
              }
              onClick={() => {
                handleQuickFilter(QuickFilterEnum.TRENDING);
              }}
              display="flex"
              justifyContent="space-between"
            >
              Trending
              <TrendingIllus boxSize="16" />
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Market;
