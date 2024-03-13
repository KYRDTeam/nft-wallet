import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { PrivatePrice } from "src/components/common/PrivatePrice";
import { formatNumberV2 } from "src/utils/helper";
import { ChainId } from "src/config/types";
import { NODE } from "src/config/constants/chain";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";
import { getBalanceNumber } from "src/utils/formatBalance";
import { SupportedCurrencyType } from "../../../config/types/index";

export const Header = ({ keyword, setKeyword }: { keyword: string; setKeyword: (keyword: string) => void }) => {
  const { chainId } = useAppSelector(globalSelector);
  const { tokens, isLoadingBalance } = useChainTokenSelector();

  const nativeToken = useMemo(() => {
      return tokens.find((token) => token.address === NODE[chainId as ChainId].address) || null;
  }, [chainId, tokens]);

  const nativeBalance = useMemo(() => {
    if (nativeToken) {
      return formatNumberV2(getBalanceNumber(nativeToken.balance, nativeToken.decimals || 18), 4);
    } else return "0";
  }, [nativeToken]);

  return (
    <Flex alignItems="flex-start" justifyContent="space-between" direction="column">
      <Box alignItems="center" position="relative" w="100%">
        <Flex alignItems="center" justifyContent="center">
          <Box p="4" bg="gray.600" w="100%" borderRadius={16} h="150px">
            <Flex direction="column" h="100%" justifyContent="flex-end">
              <Flex fontSize="5xl" mr="2" alignItems="center" justifyContent="center" direction="column">
                {isLoadingBalance && <Spinner size="xl" mb={2} />}
                {!isLoadingBalance && (
                  <Flex justifyContent="center" alignItems="center" position="relative" fontSize="4xl" mb={3}>
                    <PrivatePrice
                      value={nativeBalance}
                      currency={NODE[chainId as ChainId].currencySymbol.toLowerCase() as SupportedCurrencyType}
                    />
                  </Flex>
                )}
              </Flex>
              <Flex alignItems="center" justifyContent="space-around" mt={3}>
                <Button
                  w="100%"
                  maxW="132px"
                  height="38px"
                  fontSize="15px"
                  color="#0f0f0f"
                  fontWeight="700"
                  borderRadius={16}
                  colorScheme="primary"
                  as={NavLink}
                  to="/transfer"
                >
                  Transfer
                </Button>
                <Button
                  w="100%"
                  maxW="132px"
                  height="38px"
                  fontSize="15px"
                  color="#0f0f0f"
                  fontWeight="700"
                  borderRadius={16}
                  colorScheme="primary"
                  as={NavLink}
                  to="/swap"
                >
                  Swap
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
