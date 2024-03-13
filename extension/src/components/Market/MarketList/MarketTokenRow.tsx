import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { get } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { DefaultTokenIcon, StarIcon } from "src/components/common/icons";
import { PercentageFormat } from "src/components/common/PercentageFormat";
import TokenChart from "src/components/common/TokenChart";
import TokenTag from "src/components/common/TokenTag";
import { DEFAULT_DECIMAL_FOR_DISPLAY } from "src/config/constants/constants";
import { TokenMarketType } from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";
import { globalSelector } from "src/store/global";
import { setFavoriteTokens } from "src/store/tokens";
import {
  concatValueWithCurrency,
  formatNumberV2,
  shortenNumber,
  valueWithCurrency,
} from "src/utils/helper";

export const TokenChangedPercentage = React.memo(
  ({ address }: { address: string }) => {
    const { market, currency } = useAppSelector(globalSelector);
    let value: any = get(
      market,
      `${address}.quotes.${currency}.price24hChangePercentage`,
      "--"
    );

    if (value === "--") return <Text>{value}</Text>;

    value = Number(value);

    return <PercentageFormat percentage={value} />;
  },
  (prevProps, nextProps) => prevProps.address !== nextProps.address
);

export const MarketTokenRow = ({
  isMobile,
  data,
  ...props
}: {
  isMobile?: boolean;
  data: TokenMarketType;
  [restProp: string]: any;
}) => {
  const dispatch = useDispatch();

  const { chainId, currency } = useAppSelector(globalSelector);
  const { favoriteTokens } = useChainTokenSelector();

  const tokenPrice = useMemo(() => {
    const rawValue = get(data, `quotes.${currency}.price`, 0);
    return valueWithCurrency(
      formatNumberV2(rawValue, DEFAULT_DECIMAL_FOR_DISPLAY[currency]),
      currency
    );
  }, [currency, data]);

  const isFavorite = useMemo(() => {
    return favoriteTokens?.includes(data.address.toLowerCase());
  }, [data.address, favoriteTokens]);

  const handleFavoriteToken = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(setFavoriteTokens(data.address.toLowerCase()));
    },
    [data.address, dispatch]
  );

  const vol24h = useMemo(() => {
    return concatValueWithCurrency(
      shortenNumber(get(data, `quotes.${currency}.volume24h`) || 0),
      currency
    );
  }, [currency, data]);

  if (isMobile) {
    return (
      <>
        <Flex
          as={NavLink}
          to={`/token?chainId=${chainId}&address=${data.address}`}
          alignItems="center"
          flex="1"
          paddingX="2"
          paddingRight="4"
          ml="1"
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
          cursor="pointer"
          {...props}
        >
          <Flex alignItems="center" mr="2" flex="2">
            <Box mr="2" boxSize="7">
              <Image
                boxSize="7"
                src={data.logo}
                fallback={<DefaultTokenIcon stroke="#fff" boxSize="7" />}
              />
            </Box>

            <Box w="100px">
              <Text
                fontSize="sm"
                maxW="100px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                color="whiteAlpha.600"
              >
                {data.name}
              </Text>
              <Text
                fontSize="lg"
                fontWeight="bold"
                maxW="100px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {data.symbol}
              </Text>
            </Box>
          </Flex>
          <Text
            flex="2"
            mr="2"
            color="whiteAlpha.600"
            fontSize="sm"
            textAlign="right"
          >
            <Text color="whiteAlpha.900">{tokenPrice}</Text>
            <TokenChangedPercentage address={data.address} />
          </Text>
          <Flex flex="2" direction="column" alignItems="flex-end">
            {vol24h}
          </Flex>
          <Flex flex={0.5} direction="column" alignItems="flex-end">
            <Button
              bg="transparent"
              px="4"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              onClick={handleFavoriteToken}
            >
              <StarIcon boxSize="5" isActive={isFavorite} />
            </Button>
          </Flex>
        </Flex>
      </>
    );
  }

  return (
    <Flex
      as={NavLink}
      to={`/token?chainId=${chainId}&address=${data.address}`}
      alignItems="center"
      paddingX="6"
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      cursor="pointer"
      width="full"
      _hover={{ bg: "gray.800" }}
      {...props}
    >
      <Flex flex="2" alignItems="center">
        <Image
          boxSize="7"
          src={data.logo}
          borderRadius="full"
          fallback={<DefaultTokenIcon stroke="#fff" boxSize="8" />}
        />

        <Box ml="3">
          <Box>
            <Text
              fontSize="sm"
              maxW="90px"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              color="whiteAlpha.600"
              title={data.name}
            >
              {data.name}
            </Text>
            <Flex
              alignItems="center"
              fontSize="lg"
              fontWeight="bold"
              maxW="150px"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              <Box mr="2">{data.symbol}</Box>
              <TokenTag type={data.tag || undefined} />
            </Flex>
          </Box>
        </Box>
      </Flex>

      <Box flex="2" mr="2" textAlign="right">
        <Text>{tokenPrice}</Text>
        <TokenChangedPercentage address={data.address} />
      </Box>
      <Box flex="2" textAlign="right">
        {vol24h}
      </Box>

      <Box flex="2" mr="2" textAlign="right">
        {currency === "usd" && <TokenChart address={data.address} />}
      </Box>
      <Flex flex={1} justifyContent="flex-end">
        <Button
          bg="transparent"
          px={{ base: 4, md: 0 }}
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
          onClick={handleFavoriteToken}
        >
          <StarIcon boxSize="5" isActive={isFavorite} />
        </Button>
      </Flex>
    </Flex>
  );
};
