import { Flex, Text } from "@chakra-ui/react";
import { SortBy } from "src/components/common/SortBy";
import { SORT_KEY_FILTER } from "src/config/constants/constants";

export default function TokenTableHead({
  isMobile,
  filter,
  onFilter,
}: {
  isMobile: boolean;
  filter: any;
  onFilter: (params: any) => void;
}) {
  return (
    <>
      {!isMobile && (
        <Flex height="10" alignItems="center" paddingX="4" pr="0" flex="1">
          <Flex flex="2">
            <SortBy
              label="Asset"
              sortType={filter.symbol}
              onClick={() => {
                onFilter({
                  symbol: filter.symbol === "desc" ? "asc" : "desc",
                });
              }}
            />
          </Flex>
          <Flex flex="1" mr="2" justifyContent="flex-end">
            <SortBy
              label="Price"
              sortType={filter[SORT_KEY_FILTER.price]}
              onClick={() => {
                onFilter({
                  [SORT_KEY_FILTER.price]:
                    filter[SORT_KEY_FILTER.price] === "desc" ? "asc" : "desc",
                });
              }}
            />
          </Flex>
          <Flex flex="1.5" mr="2" justifyContent="flex-end">
            <SortBy
              label="Holdings"
              sortType={filter[SORT_KEY_FILTER.value]}
              onClick={() => {
                onFilter({
                  [SORT_KEY_FILTER.value]:
                    filter[SORT_KEY_FILTER.value] === "desc" ? "asc" : "desc",
                });
              }}
            />
          </Flex>
          <Text
            flex="1.5"
            mr="2"
            color="whiteAlpha.600"
            fontSize="md"
            textAlign="center"
          >
            Chart (7d)
          </Text>
        </Flex>
      )}
      {!!isMobile && (
        <Flex height="10" alignItems="center" flex="1">
          <Flex w="120px">
            <SortBy
              label="Asset"
              sortType={filter.symbol}
              onClick={() => {
                onFilter({
                  symbol: filter.symbol === "desc" ? "asc" : "desc",
                });
              }}
            />
          </Flex>
          <Flex flex="1.6" justifyContent="flex-end">
            <SortBy
              label="Price"
              sortType={filter[SORT_KEY_FILTER.price]}
              onClick={() => {
                onFilter({
                  [SORT_KEY_FILTER.price]:
                    filter[SORT_KEY_FILTER.price] === "desc" ? "asc" : "desc",
                });
              }}
            />
          </Flex>
          <Flex flex="2" mr="-2" justifyContent="flex-end">
            <SortBy
              label="Holdings"
              sortType={filter[SORT_KEY_FILTER.value]}
              onClick={() => {
                onFilter({
                  [SORT_KEY_FILTER.value]:
                    filter[SORT_KEY_FILTER.value] === "desc" ? "asc" : "desc",
                });
              }}
            />
          </Flex>
        </Flex>
      )}
    </>
  );
}
