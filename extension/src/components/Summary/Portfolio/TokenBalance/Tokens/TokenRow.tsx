import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { get } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { DefaultTokenIcon } from "src/components/common/icons";
import { PercentageFormat } from "src/components/common/PercentageFormat";
import { PrivatePrice } from "src/components/common/PrivatePrice";
import { DEFAULT_DECIMAL_FOR_DISPLAY } from "src/config/constants/constants";
import { Token } from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { getBalanceNumber } from "src/utils/formatBalance";
import {
  formatNumberV2,
  getNumberDecimalSupportedToDisplay,
  valueWithCurrency,
} from "src/utils/helper";

export const TokenChangedPercentage = React.memo(
  ({ value }: { address: string; value: string }) => {
    if (value === "--") return <Text>{value}</Text>;

    return <PercentageFormat percentage={Number(value)} />;
  },
  (prevProps, nextProps) => prevProps.address !== nextProps.address
);

export const TokenRow = ({
  isMobile,
  data,
  ...props
}: {
  isMobile?: boolean;
  data: Token;
  [restProp: string]: any;
}) => {
  const { chainId, currency } = useAppSelector(globalSelector);
  const history = useHistory();

  const tokenPrice = useMemo(() => {
    const rawValue = get(data, `quotes.${currency}.price`, 0);
    return valueWithCurrency(
      formatNumberV2(
        rawValue,
        getNumberDecimalSupportedToDisplay(rawValue),
        true
      ),
      currency
    );
  }, [currency, data]);

  // const handleToHideToken = useCallback(
  //   (event) => {
  //     event.stopPropagation();
  //     dispatch(setHideToken({ tokenAddress: data.address, isHidden: true }));
  //     dispatch(syncHiddenWorth({ chainId }));
  //   },
  //   [chainId, data.address, dispatch]
  // );

  const balanceValue = useMemo(() => {
    const rawValue = get(data, `quotes.${currency}.value`, 0);
    return formatNumberV2(rawValue, DEFAULT_DECIMAL_FOR_DISPLAY[currency]);
  }, [currency, data]);

  const balance = useMemo(
    () =>
      formatNumberV2(getBalanceNumber(data.balance, data.decimals || 18), 4),
    [data]
  );

  const goToDetail = useCallback(() => {
    history.push(`/token?chainId=${chainId}&address=${data.address}`);
  }, [chainId, data.address, history]);

  if (!data.address) {
    return <Flex alignItems="center" paddingX="6" width="full" {...props} />;
  }

  return (
    <>
      <Flex
        alignItems="center"
        flex="1"
        paddingX="2"
        paddingRight="2"
        ml="1"
        borderBottom="1px solid"
        borderColor="whiteAlpha.50"
        cursor="pointer"
        onClick={goToDetail}
        {...props}
      >
        <Flex alignItems="center" mr="2" w="150px">
          <Box mr="2" display="block" borderRadius="full" overflow="hidden">
            <Image
              boxSize="7"
              src={data.logo}
              fallback={<DefaultTokenIcon stroke="#fff" boxSize="7" />}
            />
          </Box>

          <Box flex="1" fontSize="sm">
            <Text
              fontSize="lg"
              maxW="110px"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {data.symbol}
            </Text>
            <PrivatePrice
              color="whiteAlpha.600"
              maxW="120px"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              value={balance}
            />
          </Box>
        </Flex>

        <Flex flex="2" justifyContent="flex-end">
          <Flex direction="column" alignItems="flex-end" w="100%" fontSize="lg">
            <PrivatePrice value={balanceValue} currency={currency} />

            <Flex fontSize="sm">
              <TokenChangedPercentage
                address={data.address}
                value={get(
                  data,
                  `quotes.${currency}.priceChange24hPercentage`,
                  0
                )}
              />
              <Text color="whiteAlpha.900" ml={1}>
                {tokenPrice}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
