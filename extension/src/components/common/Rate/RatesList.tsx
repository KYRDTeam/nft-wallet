import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box, Center, Divider, Flex } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useMemo } from "react";
import { RateType, Token } from "../../../config/types";
import Rate from "./Rate";
import { useAppSelector } from "../../../hooks/useStore";
import {
  getTokenPrice,
  calculateTxFee,
  formatNumber,
  multiplyOfTwoNumber,
  roundNumber,
} from "../../../utils/helper";
import { NODE } from "../../../config/constants/chain";
import { globalSelector } from "../../../store/global";
import { NiceScroll } from "../../../theme";
import { formatCurrency } from "../../../utils/formatBalance";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";

const RatesList = ({
  srcToken,
  destToken,
  srcAmount,
  rates,
  choseRate,
  setChoseRate,
}: {
  srcToken: Token;
  destToken: Token;
  srcAmount: string;
  rates?: RateType[];
  choseRate: RateType;
  setChoseRate: (rate: RateType) => void;
}) => {
  const { chainId, gasPrices } = useAppSelector(globalSelector);
  const { tokens } = useChainTokenSelector();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const nativeCoinPrice = useMemo(
    () => getTokenPrice(tokens, NODE[chainId].address),
    [tokens, chainId]
  );

  const destTokenPrice = useMemo(
    () => getTokenPrice(tokens, destToken.address),
    [tokens, destToken.address]
  );

  const bestPlatform = rates ? rates[0] : undefined;
  const secondPlatform = rates ? rates[1] : undefined;
  const saveAmountUsd = useMemo(() => {
    if (!secondPlatform || !destTokenPrice || !bestPlatform) return 0;
    return roundNumber(
      (Number(bestPlatform.humanizeRate) -
        Number(secondPlatform.humanizeRate)) *
        Number(srcAmount) *
        destTokenPrice
    );
  }, [bestPlatform, secondPlatform, destTokenPrice, srcAmount]);

  if (!rates) return null;

  return (
    <Box fontWeight="500">
      <Center cursor="pointer" onClick={onOpen}>
        <Image src={choseRate?.platformIcon} w="18px" mr="1" />
        <Box color="primary.300" fontSize="xs">
          {choseRate?.platformShort}
        </Box>
      </Center>
      <Modal onClose={onClose} isOpen={isOpen} size="md" isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader mt="4" fontSize="lg" textAlign="center">
            Choose Rate and Gas fee
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="10" pb="8" fontSize="xs" fontWeight="500">
            <NiceScroll maxH="375">
              {rates.map((rate, index) => (
                <Flex
                  key={rate.platformShort}
                  alignItems="flex-start"
                  p="4"
                  bgColor={
                    rate.platform === choseRate?.platform
                      ? "#28433d"
                      : "gray.800"
                  }
                  mt="3"
                  borderRadius="2xl"
                  border="1px solid transparent"
                  cursor="pointer"
                  _hover={{ borderColor: "primary.200" }}
                  onClick={() => {
                    setChoseRate(rate);
                    onClose();
                  }}
                >
                  <Image src={rate.platformIcon} w="24px" mr="3" />
                  <Box flex="1">
                    <Flex justify="space-between">
                      {rate.platform}
                      <Box>
                        {index === 0 && secondPlatform && (
                          <Box
                            bg="#28433d"
                            color="primary.300"
                            px="2"
                            borderRadius="md"
                          >
                            {saveAmountUsd > 0.1 ? (
                              <>Save ${formatCurrency(saveAmountUsd)}</>
                            ) : (
                              "Best"
                            )}
                          </Box>
                        )}
                      </Box>
                    </Flex>
                    <Divider
                      borderStyle="dashed"
                      borderColor="whiteAlpha.500"
                      mt="1"
                      mb="4"
                    />
                    <Flex justify="space-between">
                      <Box>Rate:</Box>
                      <Rate
                        srcToken={srcToken}
                        destToken={destToken}
                        rate={rate}
                      />
                    </Flex>
                    <Flex justify="space-between" opacity="0.5">
                      <Box>Max gas fee:</Box>
                      <Box>
                        {formatNumber(
                          calculateTxFee(
                            gasPrices?.standard || 0,
                            rate.estimatedGas
                          )
                        )}{" "}
                        {NODE[chainId].currencySymbol} ~ $
                        {formatNumber(
                          multiplyOfTwoNumber(
                            calculateTxFee(
                              gasPrices?.standard || 0,
                              rate.estimatedGas
                            ),
                            nativeCoinPrice
                          ),
                          2
                        )}
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              ))}
            </NiceScroll>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RatesList;
