import { Search2Icon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Center, Flex, Heading, SimpleGrid } from "@chakra-ui/layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MINIMUM_LIQUIDITY,
  SUPPORTED_EARNING_CHAINS,
} from "src/config/constants/constants";
import { globalSelector } from "src/store/global";
import { useAppSelector } from "../../hooks/useStore";
import { usePrice } from "../../hooks/useTokens";
import { earnSelector } from "../../store/earn";
import { getBalanceNumber } from "../../utils/formatBalance";
import { formatNumber, shortenNumber } from "../../utils/helper";
import InputCustom from "../common/Input";
import { ChainIcon } from "../icons";

const EarnList = () => {
  const { chainId } = useAppSelector(globalSelector);
  const { earnList, earnBalances } = useAppSelector(earnSelector);
  const [searchKey, setSearchKey] = useState("");
  const { getPrice } = usePrice();

  useEffect(() => setSearchKey(""), [chainId]);

  const getTotalBalance = useCallback(
    (tokenAddress: string, decimals: number) => {
      const totalBalance = earnBalances.reduce((prevVal, item) => {
        const currentVal = item.balances.find(
          (b) => b.address.toLowerCase() === tokenAddress.toLowerCase()
        )?.supplyBalance;
        return prevVal + Number(currentVal || 0);
      }, 0);
      return +(
        getBalanceNumber(totalBalance, decimals) * getPrice(tokenAddress)
      ).toFixed(2);
    },
    [earnBalances, getPrice]
  );

  const filterEarnList = useMemo(() => {
    return earnList.filter(
      (token) =>
        token.symbol.toLowerCase().includes(searchKey.toLowerCase()) ||
        token.name.toLowerCase().includes(searchKey.toLowerCase()) ||
        token.address.toLowerCase().includes(searchKey.toLowerCase())
    );
  }, [earnList, searchKey]);

  return (
    <Box w="820px" maxW="100%" overflow="auto">
      <Flex justify="space-between">
        <Heading as="h2" size="lg" mb="10" fontWeight="semibold">
          Earn
        </Heading>
        <InputGroup w="auto">
          <InputCustom
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search"
            bg="gray.700"
            fontSize="sm"
          />
          <InputRightElement children={<Search2Icon />} />
        </InputGroup>
      </Flex>
      {!SUPPORTED_EARNING_CHAINS.includes(chainId) ? (
        <Flex alignItems="center" opacity="0.75">
          <ChainIcon chainId={chainId || 1} boxSize={20} />
          <Box ml="5">Coming soon</Box>
        </Flex>
      ) : (
        <>
          <Box color="whiteAlpha.700">
            Select the token you wish to{" "}
            <Box display="inline" fontWeight="bold" color="white">
              supply
            </Box>{" "}
            to{" "}
            <Box display="inline" fontWeight="bold" color="white">
              earn interest
            </Box>
            . Interest rate may change as per market dynamics.
          </Box>

          <Box minW="600px">
            <SimpleGrid
              columns={5}
              spacing={3}
              color="whiteAlpha.700"
              fontSize="sm"
              mt="10"
              mb="4"
              textAlign="center"
            >
              <Box pl="24px">TOKEN</Box>
              <Center>INTEREST</Center>
              <Center>TOTAL SUPPLY</Center>
              <Center>LIQUIDITY</Center>
              <Center>YOUR SUPPLY</Center>
            </SimpleGrid>

            {filterEarnList.map((token) => {
              const bestPlatform = token.overview[0];

              const isLowLiquidity =
                getBalanceNumber(bestPlatform?.liquidity || 0, token.decimals) <
                MINIMUM_LIQUIDITY;

              return (
                <SimpleGrid
                  key={token.address}
                  columns={5}
                  spacing={3}
                  bg="gray.700"
                  borderRadius="xl"
                  mt="3"
                  px="6"
                  py="3"
                  fontSize="lg"
                  cursor="pointer"
                  as={Link}
                  to={`/supply?chainId=${chainId}&address=${token.address}`}
                >
                  <Flex alignItems="center">
                    <Image src={token.logo} w="32px" borderRadius="full" />
                    <Box ml="3"> {token.symbol}</Box>
                  </Flex>
                  <Center>
                    {formatNumber(bestPlatform?.supplyRate * 100, 2)}%
                  </Center>
                  <Center>
                    $
                    {shortenNumber(
                      getBalanceNumber(
                        bestPlatform?.totalSupply,
                        token.decimals
                      )
                    )}
                  </Center>
                  <Center color={isLowLiquidity ? "red.400" : ""}>
                    $
                    {shortenNumber(
                      getBalanceNumber(bestPlatform?.liquidity, token.decimals)
                    )}
                  </Center>
                  <Center textAlign="right">
                    {getTotalBalance(token.address, token.decimals)
                      ? "$" + getTotalBalance(token.address, token.decimals)
                      : "-"}
                  </Center>
                </SimpleGrid>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default EarnList;
