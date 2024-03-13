import { Box, Flex } from "@chakra-ui/layout";
import { useAppSelector } from "src/hooks/useStore";
import { earnSelector } from "src/store/earn";
import { formatNumberV2 } from "src/utils/helper";
import TokenLogo from "src/components/common/TokenLogo";
import { getBalanceNumber } from "src/utils/formatBalance";
import { useMemo } from "react";
import { globalSelector } from "src/store/global";
import { PrivatePrice } from "src/components/common/PrivatePrice";
import { DEFAULT_DECIMAL_FOR_DISPLAY } from "src/config/constants/constants";

const PoolBalances = () => {
  const { poolBalances } = useAppSelector(earnSelector);
  const { baseCurrencyRate, currency } = useAppSelector(globalSelector);

  const currencyRate = useMemo(
    () => 1 / baseCurrencyRate[currency],
    [baseCurrencyRate, currency]
  );

  const totalLpVal = useMemo(() => {
    return Object.values(poolBalances).reduce(
      (sum, item) => sum + item.value * currencyRate,
      0
    );
  }, [currencyRate, poolBalances]);

  const minimumValueForDisplayed = Math.pow(
    10,
    -DEFAULT_DECIMAL_FOR_DISPLAY[currency]
  );

  return (
    <Box pos="relative">
      <Box pos="absolute" right="6" top="-12" fontSize="lg">
        <PrivatePrice
          value={formatNumberV2(
            totalLpVal,
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
      >
        {Object.keys(poolBalances)
          .sort((x, y) => poolBalances[y].value - poolBalances[x].value)
          .map((project) => (
            <Box mb="10" key={project}>
              <Flex px="3" justify="space-between" fontSize="lg">
                {project}

                <Box>
                  <PrivatePrice
                    value={formatNumberV2(
                      poolBalances[project].value * currencyRate,
                      DEFAULT_DECIMAL_FOR_DISPLAY[currency]
                    )}
                    currency={currency}
                  />
                </Box>
              </Flex>

              {poolBalances[project].pools.map((pool, i) => {
                const token1 = pool.underlying[0];
                const token2 = pool.underlying[1];
                if (pool.value < minimumValueForDisplayed) return null;
                return (
                  <Flex
                    key={i}
                    bg="gray.800"
                    mt="3"
                    borderRadius="lg"
                    alignItems="center"
                    px="3"
                    py="1"
                  >
                    <Box mt="3">
                      <TokenLogo src={token1.token.logo} boxSize="5" />
                      <TokenLogo
                        src={token2.token.logo}
                        boxSize="5"
                        pos="relative"
                        top="-10px"
                        right="-15px"
                      />
                    </Box>
                    <Box ml="7">
                      <Box>
                        {formatNumberV2(
                          getBalanceNumber(
                            token1.balance,
                            token1.token.decimals
                          ),
                          4
                        )}{" "}
                        {token1.token.symbol}
                      </Box>
                      <Box>
                        {formatNumberV2(
                          getBalanceNumber(
                            token2.balance,
                            token2.token.decimals
                          ),
                          4
                        )}{" "}
                        {token2.token.symbol}
                      </Box>
                    </Box>
                    <Box fontSize="lg" ml="auto">
                      <PrivatePrice
                        value={formatNumberV2(
                          pool.value * currencyRate,
                          DEFAULT_DECIMAL_FOR_DISPLAY[currency]
                        )}
                        currency={currency}
                      />
                    </Box>
                  </Flex>
                );
              })}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default PoolBalances;
