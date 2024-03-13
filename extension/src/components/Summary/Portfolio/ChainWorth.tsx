import { Box, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { ChainIcon } from "src/components/icons";
import { DEFAULT_DECIMAL_FOR_DISPLAY } from "src/config/constants/constants";
import { ChainId } from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import _get from "lodash/get";
import { NODE } from "src/config/constants/chain";
import { globalSelector } from "src/store/global";
import { PrivatePrice } from "src/components/common/PrivatePrice";
import { formatNumberV2 } from "src/utils/helper";
import { walletsSelector } from "src/store/wallets";

export const ChainWorth = ({
  chainId,
  balance,
  isSelected,
  onSelect,
  totalBalance,
}: {
  chainId: ChainId;
  balance: any;
  totalBalance: number;
  isSelected: boolean;
  onSelect: (chainId: ChainId) => void;
}) => {
  const { currency } = useAppSelector(globalSelector);
  const { hiddenWorth } = useAppSelector(walletsSelector);

  const hiddenValue = useMemo(
    () => Number(_get(hiddenWorth, `${chainId}.${currency}`, 0)),
    [chainId, currency, hiddenWorth]
  );

  const balanceForDisplay = useMemo(() => {
    const totalChainWorth = _get(balance, `quotes.${currency}.value`, 0);

    return totalChainWorth > hiddenValue
      ? totalChainWorth - hiddenValue
      : totalChainWorth;
  }, [balance, currency, hiddenValue]);

  const allocationPercentage = useMemo(() => {
    if (totalBalance === 0) return "";
    const alloc = (balanceForDisplay / totalBalance) * 100;
    return formatNumberV2(alloc, 2);
  }, [balanceForDisplay, totalBalance]);

  return (
    <Flex
      bg={isSelected ? "rgb(0 226 164 / 30%)" : "gray.700"}
      borderRadius="16"
      minHeight="16"
      alignItems="center"
      px="3"
      py="1"
      borderWidth="1px"
      borderColor={isSelected ? "primary.300" : "transparent"}
      _hover={{ borderColor: "primary.300" }}
      cursor="pointer"
      onClick={() => {
        if (isSelected) return;
        onSelect(chainId);
      }}
    >
      <ChainIcon chainId={chainId} boxSize="6" />
      <Box ml="2" fontSize="sm">
        <Box>
          <Text
            display={{ base: "block", lg: "inline" }}
            color="whiteAlpha.600"
            mr="2"
          >
            {NODE[chainId]?.name}
          </Text>
          <Text
            display={{ base: "block", lg: "inline" }}
            color="whiteAlpha.800"
          >
            {allocationPercentage}%
          </Text>
        </Box>

        <Box>
          <PrivatePrice
            fontWeight="semibold"
            value={formatNumberV2(
              balanceForDisplay,
              DEFAULT_DECIMAL_FOR_DISPLAY[currency]
            )}
            currency={currency}
          />
        </Box>
      </Box>
    </Flex>
  );
};
