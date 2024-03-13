import { Box, Flex, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { SlideFade } from "@chakra-ui/transition";
import { EarnToken, Token } from "src/config/types";
import { formatCurrency } from "src/utils/formatBalance";
import InfoField from "./InfoField";

const SwapInfo = ({
  slippage,
  destAmount,
  destToken,
  refPriceDOM,
}: {
  slippage: string;
  destAmount: string;
  destToken?: Token | EarnToken;
  refPriceDOM: JSX.Element;
}) => {
  return (
    <SlideFade in={true} offsetY="50px">
      <Box mt="4">
        <InfoField title="Slippage" content={<Box>{slippage}%</Box>} />
        <InfoField
          title="Minimum received"
          tooltip="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
          content={
            <Flex>
              <Tooltip label={formatCurrency(+destAmount - +destAmount * (+slippage / 100))} placement="top" hasArrow>
                <Text maxW="100px" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                  {formatCurrency(+destAmount - +destAmount * (+slippage / 100))}
                </Text>
              </Tooltip>
              <Text ml="1">{destToken?.symbol}</Text>
            </Flex>
          }
        />
        <InfoField
          title="Price impact"
          tooltip="There is a difference between the estimated price for your swap amount and the reference price. Note: Estimated price depends on your swap amount. Reference price is from Coingecko"
          content={refPriceDOM}
        />
      </Box>
    </SlideFade>
  );
};

export default SwapInfo;
