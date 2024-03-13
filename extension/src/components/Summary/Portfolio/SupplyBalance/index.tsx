import { Image } from "@chakra-ui/image";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import { useMemo } from "react";
import { useAppSelector } from "src/hooks/useStore";
import { usePriceByBaseCurrency } from "src/hooks/useTokens";
import { earnSelector } from "src/store/earn";
import { getBalanceNumber } from "src/utils/formatBalance";
import { formatNumber, formatNumberV2 } from "src/utils/helper";
import { ReactComponent as EarnSVG } from "src/assets/images/icons/earn-sum.svg";
import { Button } from "@chakra-ui/button";
import { NavLink } from "react-router-dom";
import WithdrawModal from "./WithdrawModal";
import { transparentize } from "@chakra-ui/theme-tools";
import ClaimModal from "./ClaimModal";
import { PrivatePrice } from "src/components/common/PrivatePrice";
import { globalSelector } from "src/store/global";
import { DEFAULT_DECIMAL_FOR_DISPLAY } from "src/config/constants/constants";

const SupplyBalance = () => {
  const { currency } = useAppSelector(globalSelector);
  const { earnBalances, distributionBalance } = useAppSelector(earnSelector);

  const { getPrice } = usePriceByBaseCurrency();

  const mappedEarnData = useMemo(() => {
    return earnBalances.map((data) => {
      const balances = data.balances;
      const sum = balances.reduce((sum, nextItem) => {
        const balance = getBalanceNumber(
          nextItem.supplyBalance,
          nextItem.decimals
        );
        const value = getPrice(nextItem.address) * balance;
        return sum + value;
      }, 0);
      return { ...data, total: sum };
    });
  }, [earnBalances, getPrice]);

  const distributionVal = useMemo(() => {
    if (!distributionBalance) return 0;
    const balance = getBalanceNumber(
      distributionBalance.unclaimed,
      distributionBalance.decimals
    );
    return getPrice(distributionBalance.address) * balance;
  }, [distributionBalance, getPrice]);

  const totalValue = useMemo(() => {
    return (
      mappedEarnData.reduce((preVal, nextVal) => preVal + nextVal.total, 0) +
      distributionVal
    );
  }, [mappedEarnData, distributionVal]);

  const minimumValueForDisplayed = Math.pow(
    10,
    -DEFAULT_DECIMAL_FOR_DISPLAY[currency]
  );

  return (
    <Box pos="relative">
      <Box pos="absolute" right="6" top="-12" fontSize="lg">
        <PrivatePrice
          value={formatNumberV2(
            totalValue,
            DEFAULT_DECIMAL_FOR_DISPLAY[currency]
          )}
          currency={currency}
        />
      </Box>
      <Box
        maxHeight={{ base: "calc( 100vh - 400px )" }}
        overflowY="auto"
        px="6"
        pt="2"
        pb="4"
      >
        {totalValue > 0 ? (
          <>
            {mappedEarnData.map((earnBalance) => {
              const availableEarnBalance = earnBalance.balances.filter(
                (token) => {
                  const balance = getBalanceNumber(
                    token.supplyBalance,
                    token.decimals
                  );
                  const value = getPrice(token.address) * balance;
                  return value >= minimumValueForDisplayed;
                }
              );
              if (availableEarnBalance.length === 0) return null;

              return (
                <Box fontWeight="500" mb="10" key={earnBalance.name}>
                  <Flex justify="space-between" px="3">
                    <Text textTransform="uppercase">{earnBalance.name}</Text>
                    <PrivatePrice
                      value={formatNumberV2(
                        earnBalance.total,
                        DEFAULT_DECIMAL_FOR_DISPLAY[currency]
                      )}
                      currency={currency}
                    />
                  </Flex>

                  {availableEarnBalance.map((token) => {
                    const balance = getBalanceNumber(
                      token.supplyBalance,
                      token.decimals
                    );
                    const value = getPrice(token.address) * balance;

                    return (
                      <WithdrawModal
                        key={token.address}
                        token={token}
                        platform={earnBalance.name}
                        render={(onOpen) => (
                          <Flex
                            justify="space-between"
                            alignItems="center"
                            bg="gray.800"
                            px="3"
                            py="2"
                            mt="3"
                            height="12"
                            borderRadius="2xl"
                            _hover={{
                              cursor: "pointer",
                              bg: transparentize("primary.200", 0.1),
                            }}
                            onClick={onOpen}
                          >
                            <Center gridGap="2">
                              <Image src={token.logo} w="24px" />
                              <Box>{formatNumber(balance, 4)}</Box>
                              <Box>{token.symbol}</Box>
                              <Tag
                                colorScheme="primary"
                                fontSize="xs"
                                borderRadius="xl"
                              >
                                {(token.supplyRate * 100).toFixed(2)}%
                              </Tag>
                            </Center>
                            <Box>
                              <PrivatePrice
                                value={formatNumberV2(
                                  value,
                                  DEFAULT_DECIMAL_FOR_DISPLAY[currency]
                                )}
                                currency={currency}
                              />
                            </Box>
                          </Flex>
                        )}
                      />
                    );
                  })}
                </Box>
              );
            })}

            {distributionBalance &&
              distributionVal > minimumValueForDisplayed &&
              (() => {
                const balance = getBalanceNumber(
                  distributionBalance.unclaimed,
                  distributionBalance.decimals
                );
                return (
                  <Box fontWeight="500">
                    <Flex justify="space-between" px="3">
                      <Text textTransform="uppercase">OTHER</Text>
                      <PrivatePrice
                        value={formatNumberV2(
                          distributionVal,
                          DEFAULT_DECIMAL_FOR_DISPLAY[currency]
                        )}
                        currency={currency}
                      />
                    </Flex>
                    <ClaimModal
                      platform={distributionBalance.name}
                      balance={formatNumber(balance)}
                      value={formatNumber(distributionVal, 2)}
                      logo={distributionBalance.logo}
                      render={(onOpen) => (
                        <Flex
                          justify="space-between"
                          bg="gray.800"
                          px="3"
                          py="2"
                          mt="3"
                          borderRadius="2xl"
                          _hover={{
                            cursor: "pointer",
                            bg: transparentize("primary.200", 0.1),
                          }}
                          onClick={onOpen}
                        >
                          <Center gridGap="2">
                            <Image src={distributionBalance.logo} w="24px" />
                            <Box>{formatNumber(balance)}</Box>
                          </Center>
                          <Box>
                            <PrivatePrice
                              value={formatNumberV2(
                                distributionVal,
                                DEFAULT_DECIMAL_FOR_DISPLAY[currency]
                              )}
                              currency={currency}
                            />
                          </Box>
                        </Flex>
                      )}
                    />
                  </Box>
                );
              })()}
          </>
        ) : (
          <Center flexDir="column" py="10">
            <EarnSVG />
            <Box w="70%" textAlign="center" my="8" opacity="0.75">
              You’ve not supplied any token to earn interest.
            </Box>
            <Button
              as={NavLink}
              to="/earn"
              color="whiteAlpha.700"
              variant="outline"
            >
              Supply tokens to earn interest
            </Button>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default SupplyBalance;
