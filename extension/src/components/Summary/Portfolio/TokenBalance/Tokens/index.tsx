import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Skeleton,
  Switch,
  Text,
} from "@chakra-ui/react";
import { get, isEmpty, orderBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Token } from "src/config/types";
import BigNumber from "bignumber.js";
import TokenList from "./TokenList";
import { TokenNotFoundIllus } from "src/components/common/icons";
import { MINIMUM_BALANCE_VALUE_TO_DISPLAY } from "src/config/constants/constants";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";

export const Tokens = ({ keyword }: { keyword: string }) => {
  const { tokens, isLoadingBalance, hiddenList } = useChainTokenSelector();

  // const { currency } = useAppSelector(globalSelector);

  const [isShowAllToken, setShowAllToken] = useState(false);
  const [filter, setFilter] = useState<{
    [key: string]: "asc" | "desc";
  }>({});

  useEffect(() => {
    setFilter({});
  }, [keyword]);

  const tokenAvailableToDisplay = useMemo(() => {
    const keywordLowercase = keyword.toLowerCase();

    let tokenCloned = [...tokens].filter((token: Token) => {
      const balance = new BigNumber(get(token, "balance", 0)).dividedBy(
        new BigNumber(10).pow(token.decimals || 18)
      );
      return (
        !hiddenList.includes(token.address.toLowerCase()) &&
        balance.isGreaterThan(0) &&
        (token.name.toLowerCase().includes(keywordLowercase) ||
          token.address.toLowerCase().includes(keywordLowercase) ||
          token.symbol.toLowerCase().includes(keywordLowercase))
      );
    });

    // the filter small value is disabled when has searching and off show all.
    if (!keyword && !isShowAllToken) {
      tokenCloned = tokenCloned.filter(
        (token: Token) =>
          get(token, "quotes.usd.value", 0) > MINIMUM_BALANCE_VALUE_TO_DISPLAY
      );
    }

    return orderBy(
      tokenCloned,
      Object.keys(filter)[0],
      Object.values(filter)[0]
    );
  }, [filter, hiddenList, isShowAllToken, keyword, tokens]);

  // const currentWorth: number = useMemo(() => {
  //   return tokenAvailableToDisplay.reduce((total: number, currentToken: Token) => {
  //     return total + get(currentToken, `quotes.${currency}.value`, 0);
  //   }, 0);
  // }, [currency, tokenAvailableToDisplay]);

  // const value24hChanged = useMemo(() => {
  //   return tokenAvailableToDisplay.reduce((total: number, currentToken: Token) => {
  //     const currentWorth: number = get(currentToken, `quotes.${currency}.value`, 0);
  //     return (
  //       total +
  //       (currentWorth * +get(market, `${currentToken.address}.quotes.${currency}.price24hChangePercentage`, 1)) / 100
  //     );
  //   }, 0);
  // }, [currency, market, tokenAvailableToDisplay]);

  return (
    <>
      {/* <Flex
        alignItems={{ base: "center", md: "center" }}
        direction={{ base: "row", md: "row" }}
        justifyContent={{
          base: "space-between",
          md: "space-between",
        }}
      >
        <Text color="whiteAlpha.600" fontSize="md" mt={1} ml={2}>
          Total:
        </Text>
        <PrivatePrice
          fontSize="xl"
          mr={{ base: 1, md: 1 }}
          ml={{ base: 2, md: 2 }}
          value={formatNumberV2(currentWorth, DEFAULT_DECIMAL_FOR_DISPLAY[currency])}
          currency={currency}
        />
      </Flex> */}

      <Box height={{ base: "calc( 100vh - 375px )" }}>
        {isLoadingBalance && (
          <>
            <Skeleton height="64px" mt="2" mb="2" mx={{ base: 2, md: 6 }} />
            <Skeleton height="64px" mt="0" mb="2" mx={{ base: 2, md: 6 }} />
            <Skeleton height="64px" mt="0" mb="2" mx={{ base: 2, md: 6 }} />
          </>
        )}
        {!isLoadingBalance && !isEmpty(tokenAvailableToDisplay) && (
          <TokenList tokens={tokenAvailableToDisplay} />
        )}
        {!isLoadingBalance && isEmpty(tokenAvailableToDisplay) && (
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            height="full"
          >
            <TokenNotFoundIllus boxSize="40" mt={6} />
            <Text color="whiteAlpha.600" mt={4}>
              No asset found.
            </Text>
          </Flex>
        )}
      </Box>
      <Flex height="50px" alignItems="center" mt={{ base: 0, xl: 0 }} ml={2}>
        {!keyword && (
          <FormControl
            display="flex"
            alignItems="center"
            mb={{ base: 0, xl: 10 }}
          >
            <Switch
              id="show-all-token"
              mr="2"
              colorScheme="primary"
              isChecked={isShowAllToken}
              onChange={() => {
                setShowAllToken(!isShowAllToken);
              }}
              size="sm"
            />
            <FormLabel
              htmlFor="show-all-token"
              mb="0"
              color="whiteAlpha.600"
              fontSize="sm"
            >
              Show All
            </FormLabel>
          </FormControl>
        )}
      </Flex>
    </>
  );
};
