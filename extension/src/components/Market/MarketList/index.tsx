import {
  Box,
  Button,
  Flex,
  Skeleton,
  Tab,
  TabList,
  Tabs,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { StarIcon } from "src/components/common/icons";
import { SortBy } from "src/components/common/SortBy";
import { BASE_CURRENCY, SORT_KEY_FILTER } from "src/config/constants/constants";
import {
  OrderByType,
  QuickFilterType,
  SupportedCurrencyType,
} from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector, setCurrency } from "src/store/global";
import MarketTable from "./MarketTable";

export const MarketList = ({
  keyword,
  orderBy,
  onOrderBy,
  quickFilter,
}: {
  keyword: string;
  orderBy: {
    [field: string]: OrderByType;
  };
  quickFilter: QuickFilterType;
  onOrderBy: (orderBy: { [field: string]: OrderByType }) => void;
}) => {
  const dispatch = useDispatch();

  const [isMobile] = useMediaQuery("(max-width: 720px)");

  const [onlyFavorite, setOnlyFavorite] = useState<boolean>(false);
  const { chainId, currency, isFetchingMarket } =
    useAppSelector(globalSelector);

  const [tabIndex, setTabIndex] = useState(
    BASE_CURRENCY[chainId].findIndex(
      (baseCurrency: SupportedCurrencyType) => baseCurrency === currency
    )
  );

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  useEffect(() => {
    setTabIndex(
      BASE_CURRENCY[chainId].findIndex(
        (baseCurrency: SupportedCurrencyType) => baseCurrency === currency
      )
    );
  }, [chainId, currency]);

  return (
    <>
      <Box p="6" pb="4">
        <Flex
          height="10"
          alignItems="center"
          paddingX="4"
          pr="0"
          flex="1"
          w="full"
          bg="gray.800"
          borderRadius="16"
        >
          <Tabs variant="unstyled" index={tabIndex} onChange={handleTabsChange}>
            <TabList>
              {BASE_CURRENCY[chainId].map((currency: SupportedCurrencyType) => (
                <Tab
                  key={currency}
                  _selected={{ color: "white" }}
                  color="whiteAlpha.700"
                  fontWeight="bold"
                  textTransform="uppercase"
                  onClick={() => {
                    dispatch(setCurrency(currency));
                  }}
                >
                  {currency}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Flex>
      </Box>

      <Box px={{ base: 3, md: 6 }}>
        <Flex height="10" alignItems="center" pr="0" flex="1">
          <Box
            mr={{ base: 10, md: -5 }}
            flex={{ base: 3, md: 2 }}
            display={{ base: "flex" }}
            ml={{ base: 9, md: 10 }}
          >
            <SortBy
              label="Token"
              sortType={orderBy.symbol}
              onClick={() => {
                onOrderBy({
                  symbol: orderBy.symbol === "desc" ? "asc" : "desc",
                });
              }}
            />
          </Box>
          <Flex flex="2" mr="2" justifyContent="flex-end">
            <SortBy
              label="Price"
              sortType={orderBy[SORT_KEY_FILTER.price]}
              onClick={() => {
                onOrderBy({
                  [SORT_KEY_FILTER.price]:
                    orderBy[SORT_KEY_FILTER.price] === "desc" ? "asc" : "desc",
                });
              }}
            />
          </Flex>
          <Flex
            flex="2"
            color="whiteAlpha.600"
            fontSize="md"
            justifyContent="flex-end"
          >
            <SortBy
              label={isMobile ? "Vol 24h" : "Volume 24h"}
              sortType={orderBy[SORT_KEY_FILTER.volume24h]}
              onClick={() => {
                onOrderBy({
                  [SORT_KEY_FILTER.volume24h]:
                    orderBy[SORT_KEY_FILTER.volume24h] === "desc"
                      ? "asc"
                      : "desc",
                });
              }}
            />
          </Flex>
          {!isMobile && (
            <Text
              flex="2"
              mr="2"
              w="100px"
              color="whiteAlpha.600"
              fontSize="md"
              textAlign="center"
            >
              Chart (7d)
            </Text>
          )}
          <Flex
            flex={{ base: 0.5, md: 1 }}
            fontSize="md"
            justifyContent="flex-end"
          >
            <Button
              px={{ base: 4, md: 0 }}
              bg="transparent"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              onClick={() => {
                setOnlyFavorite(!onlyFavorite);
              }}
            >
              <StarIcon boxSize="5" isActive={onlyFavorite} />
            </Button>
          </Flex>
        </Flex>
      </Box>
      <Box
        w="full"
        height={{ base: "calc( 100vh - 389px )", md: "calc( 100vh - 280px )" }}
      >
        {isFetchingMarket && (
          <>
            <Skeleton height="64px" mt="0" mb="2" mx={{ base: 2, md: 6 }} />
            <Skeleton height="64px" mt="0" mb="2" mx={{ base: 2, md: 6 }} />
            <Skeleton height="64px" mt="0" mb="2" mx={{ base: 2, md: 6 }} />
          </>
        )}
        {!isFetchingMarket && (
          <MarketTable
            filter={{ orderBy, keyword, quickFilter, onlyFavorite }}
          />
        )}
      </Box>
      <Box height="6" />
    </>
  );
};
