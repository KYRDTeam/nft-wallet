import { Box, Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useState } from "react";
import { RateType, Token } from "../../../config/types";
import { ReactComponent as SwapRateSVG } from "../../../assets/images/icons/swap-rate.svg";
import { roundNumber } from "../../../utils/helper";

const Rate = ({
  srcToken,
  destToken,
  rate,
  isLoading,
  showReverse,
}: {
  srcToken?: Token;
  destToken?: Token;
  rate?: RateType;
  isLoading?: boolean;
  showReverse?: boolean;
}) => {
  const [isReverseRate, setIsReverseRate] = useState(false);

  return (
    <>
      {srcToken && destToken && (isLoading || rate) && (
        <Center>
          <Box>
            1 {isReverseRate ? destToken.symbol : srcToken.symbol} ={" "}
            {isLoading && (
              <Spinner size="xs" color="primary.200" speed="0.8s" />
            )}{" "}
            {rate &&
              roundNumber(
                isReverseRate ? 1 / rate.humanizeRate : rate.humanizeRate
              )}{" "}
            {isReverseRate ? srcToken.symbol : destToken.symbol}
          </Box>
          {showReverse && (
            <Box
              as={SwapRateSVG}
              onClick={() => setIsReverseRate(!isReverseRate)}
              ml="1"
              opacity="0.75"
              cursor="pointer"
            />
          )}
        </Center>
      )}
    </>
  );
};
export default Rate;
