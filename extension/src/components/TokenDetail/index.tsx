import { Button } from "@chakra-ui/button";
import {
  Box,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { Tag } from "@chakra-ui/tag";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import {
  Token,
  TokenChartData,
  TokenDetail as TokenDetailType,
} from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { getBalanceNumber } from "src/utils/formatBalance";
import { formatNumber, getColorFromPriceChanged } from "src/utils/helper";
import {
  fetchTokenDetail,
  fetchTokenPriceSeries,
} from "src/utils/krystalService";
import TokenTag from "../common/TokenTag";
import { ArrowBackIcon } from "../icons";
import TokenChart from "./TokenChart";
import { useSetTokenUrl } from "./useSetTokenUrl";
import { transparentize } from "@chakra-ui/theme-tools";
import TokenStats from "./TokenStats";
import { earnSelector } from "src/store/earn";

const TokenDetail = () => {
  const { chainId } = useAppSelector(globalSelector);
  const { earnList } = useAppSelector(earnSelector);

  const [token, setToken] = useState<Token>();
  const [tokenDetail, setTokenDetail] = useState<TokenDetailType>();
  const [chart, setChart] = useState<TokenChartData[]>([]);
  const [chartDays, setChartDays] = useState(1);
  const [isChartLoading, setChartLoading] = useState(false);

  useSetTokenUrl({ setToken });

  useEffect(() => {
    if (token?.address) {
      fetchTokenDetail(chainId, token?.address)
        .then((data) => {
          setTokenDetail(data);
        })
        .catch(console.log);
    }
  }, [token?.address, chainId]);

  useEffect(() => {
    async function getTokenPrices() {
      if (!token?.address) return;

      setChartLoading(true);

      const priceSeries = await fetchTokenPriceSeries(
        chainId,
        token?.address,
        chartDays,
        "usd"
      );

      // let priceChange = NaN;

      if (!!priceSeries && priceSeries.length) {
        // const firstPrice: any = priceSeries[0].price;
        // const lastPrice: any = priceSeries[priceSeries.length - 1].price;

        // if (firstPrice && lastPrice) {
        //   priceChange = ((lastPrice - firstPrice) * 100) / firstPrice;
        // }

        setChart(priceSeries);
      }

      // @ts-ignore
      // setInfo((info) => {
      //   if (info) return { ...info, priceChange };
      //   return { priceChange };
      // });

      setChartLoading(false);
    }

    getTokenPrices();
  }, [token?.address, chartDays, chainId]);

  const priceChangeData = useMemo(() => {
    const usdData = tokenDetail?.markets?.usd;
    let color = getColorFromPriceChanged(usdData?.priceChange24hPercentage);
    let change = usdData?.priceChange24hPercentage;
    let isIncrease = usdData ? usdData.priceChange24hPercentage >= 0 : true;
    if (usdData) {
      switch (chartDays) {
        case 7:
          color = getColorFromPriceChanged(usdData?.priceChange7dPercentage);
          isIncrease = usdData?.priceChange7dPercentage >= 0;
          change = usdData?.priceChange7dPercentage;
          break;
        case 30:
          color = getColorFromPriceChanged(usdData?.priceChange30dPercentage);
          isIncrease = usdData?.priceChange30dPercentage >= 0;
          change = usdData?.priceChange30dPercentage;
          break;
        case 90:
          color = getColorFromPriceChanged(usdData?.priceChange200dPercentage);
          isIncrease = usdData?.priceChange200dPercentage >= 0;
          change = usdData?.priceChange200dPercentage;
          break;
        case 365:
          color = getColorFromPriceChanged(usdData?.priceChange1yPercentage);
          isIncrease = usdData?.priceChange1yPercentage >= 0;
          change = usdData?.priceChange1yPercentage;
          break;
        default:
          break;
      }
    }
    return { color, isIncrease, change };
  }, [chartDays, tokenDetail]);

  const isAvailableToEarn = useMemo(() => {
    return !!earnList.find(
      (earnToken) => earnToken.address.toLowerCase() === token?.address
    );
  }, [earnList, token?.address]);

  const history = useHistory();

  return (
    <Container
      mt="12"
      maxW={{ base: "full", lg: "container.xl" }}
      px={{ base: 2, lg: 10 }}
      pb="12"
    >
      <Flex
        w="full"
        gap={4}
        mt="2"
        flexWrap="wrap"
        direction={{ base: "column", xl: "row" }}
      >
        <Box flex="1.75" mr={{ base: 0, xl: 6 }}>
          <Flex alignItems="center" mb="10">
            <Box
              cursor="pointer"
              onClick={() => {
                history.goBack();
              }}
            >
              <ArrowBackIcon />
            </Box>
            <Center fontSize="2xl" ml="5">
              <Box mr="3">{token?.symbol || "UNKNOWN"}/USD</Box>
              <TokenTag type={token?.tag} />
            </Center>
          </Flex>
        </Box>
      </Flex>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(5, 1fr)" }}
        gap={6}
      >
        <GridItem colSpan={{ base: 1, lg: 3 }}>
          <Box borderRadius="16" bg="gray.700" px="6" py="8">
            <Flex justify="space-between" mb="5">
              <Box>
                <Box color="whiteAlpha.800">Price</Box>
                <Flex alignItems="baseline">
                  <Box fontSize="xl" color="white" fontWeight="semibold">
                    ${tokenDetail?.markets?.usd.price}
                  </Box>
                  <Box color={priceChangeData.color} ml="3" fontSize="sm">
                    {formatNumber(priceChangeData.change, 2)}%
                  </Box>
                </Flex>
                <Box color="whiteAlpha.800" mt="5">
                  24h vol
                </Box>
                <Box color="white" fontWeight="semibold">
                  ${tokenDetail?.markets?.usd?.volume24h?.toLocaleString()}
                </Box>
              </Box>
              <Box textAlign="right">
                <Box color="whiteAlpha.800">Balance</Box>
                <Box fontSize="xl" color="white" fontWeight="semibold">
                  {getBalanceNumber(
                    token?.balance || 0,
                    token?.decimals
                  ).toLocaleString()}{" "}
                  {token?.symbol}
                </Box>
                <Box>${token?.quotes?.usd?.value?.toLocaleString()}</Box>
              </Box>
            </Flex>
            <HStack mb="5" fontSize="sm" cursor="pointer">
              <Tag
                colorScheme={
                  chartDays === 1
                    ? `${priceChangeData.isIncrease ? "primary" : "orange"}`
                    : "gray"
                }
                onClick={() => setChartDays(1)}
              >
                24h
              </Tag>
              <Tag
                colorScheme={
                  chartDays === 7
                    ? `${priceChangeData.isIncrease ? "primary" : "orange"}`
                    : "gray"
                }
                onClick={() => setChartDays(7)}
              >
                7D
              </Tag>
              <Tag
                colorScheme={
                  chartDays === 30
                    ? `${priceChangeData.isIncrease ? "primary" : "orange"}`
                    : "gray"
                }
                onClick={() => setChartDays(30)}
              >
                1M
              </Tag>
              <Tag
                colorScheme={
                  chartDays === 90
                    ? `${priceChangeData.isIncrease ? "primary" : "orange"}`
                    : "gray"
                }
                onClick={() => setChartDays(90)}
              >
                3M
              </Tag>
              <Tag
                colorScheme={
                  chartDays === 365
                    ? `${priceChangeData.isIncrease ? "primary" : "orange"}`
                    : "gray"
                }
                onClick={() => setChartDays(365)}
              >
                1Y
              </Tag>
            </HStack>
            <Skeleton isLoaded={!isChartLoading} h="250px" mt="0">
              {!!chart.length ? (
                <TokenChart
                  data={chart}
                  chartDays={chartDays}
                  color={priceChangeData.color}
                />
              ) : (
                <Center h="250px" bg="gray.800" borderRadius="xl">
                  No data
                </Center>
              )}
            </Skeleton>

            <Center mt="8" gridGap={4}>
              <Button
                as={NavLink}
                to={`/transfer?tokenAddress=${token?.address}`}
                w="24"
                color="gray.900"
                bg={priceChangeData.color}
                _hover={{
                  bg: transparentize(priceChangeData.color, 0.7) as any,
                }}
              >
                Transfer
              </Button>
              <Button
                as={NavLink}
                to={`/swap?srcAddress=${token?.address}`}
                w="24"
                color="gray.900"
                bg={priceChangeData.color}
                _hover={{
                  bg: transparentize(priceChangeData.color, 0.7) as any,
                }}
              >
                Swap
              </Button>
              {isAvailableToEarn && (
                <Button
                  as={NavLink}
                  to={`/supply?chainId=${chainId}&address=${token?.address}`}
                  w="24"
                  color="gray.900"
                  bg={priceChangeData.color}
                  _hover={{
                    bg: transparentize(priceChangeData.color, 0.7) as any,
                  }}
                >
                  Earn
                </Button>
              )}
            </Center>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TokenStats tokenDetail={tokenDetail} />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default TokenDetail;
