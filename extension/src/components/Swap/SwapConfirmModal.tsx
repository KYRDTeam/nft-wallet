import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { useDisclosure, usePrevious } from "@chakra-ui/hooks";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Divider, Flex, Link, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NODE } from "../../config/constants/chain";
import { RateType, Token } from "../../config/types";
import { useSwap } from "../../hooks/useKrystalServices";
import { useAppSelector } from "../../hooks/useStore";
import { usePrice } from "../../hooks/useTokens";
import { globalSelector } from "../../store/global";
import { formatCurrency } from "../../utils/formatBalance";
import { calculateTxFee, formatNumber } from "../../utils/helper";
import GasSettings from "../common/GasSettings";
import InfoField from "../common/InfoField";
import Rate from "../common/Rate/Rate";
import TxModal from "../common/TxModal";
import { transparentize } from "@chakra-ui/theme-tools";
import { get } from "lodash";
import { NavLink } from "react-router-dom";
import { DEFAULT_GAS_LIMIT } from "src/config/constants/constants";

interface SwapConfirmModalProps {
  srcToken?: Token;
  srcAmount: string;
  destToken?: Token;
  rate?: RateType;
  destAmount: string;
  slippage: string;
  priceDifference?: number;
  refPriceDOM: JSX.Element;
  render: (onOpen: () => void) => JSX.Element;
  callbackSuccess?: () => void;
}

const SwapConfirmModal = ({
  srcToken,
  srcAmount,
  destToken,
  destAmount,
  rate,
  slippage,
  priceDifference,
  refPriceDOM,
  render,
  callbackSuccess,
}: SwapConfirmModalProps) => {
  const { chainId, appSettings } = useAppSelector(globalSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rateUpdated, setRateUpdated] = useState(false);
  const [isSwapAnyway, setIsSwapAnyway] = useState(false);

  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();

  const prevDestAmount = usePrevious(destAmount);
  const { getPrice } = usePrice();

  const srcUsdPrice = getPrice(srcToken?.address);
  const destUsdPrice = getPrice(destToken?.address);
  const nativeUsdPrice = getPrice(NODE[chainId].address);

  useEffect(() => {
    if (!isSwapAnyway && isOpen) setIsSwapAnyway(!!priceDifference && priceDifference >= -20);
  }, [priceDifference, isOpen, isSwapAnyway]);

  useEffect(() => {
    if (isOpen) {
      if (!rateUpdated) setRateUpdated(prevDestAmount !== destAmount);
    }
  }, [isOpen, rateUpdated, prevDestAmount, destAmount]);

  const { swap, loadingText, txHash, resetSwapState, error } = useSwap(gasPrice, gasLimit, priorityFee);

  const minDestAmount = useMemo(() => +destAmount - +destAmount * (+slippage / 100), [destAmount, slippage]);

  const gasFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

  const gasLimitAsFail = rate?.estimatedGas === "50000000";

  const handleConfirm = useCallback(() => {
    swap(srcAmount, destAmount, slippage, srcToken, destToken, rate);
  }, [rate, srcToken, destToken, destAmount, srcAmount, slippage, swap]);

  const handleCloseModal = useCallback(() => {
    onClose();
    resetSwapState();
    setRateUpdated(false);
    setIsSwapAnyway(false);
  }, [onClose, resetSwapState]);

  useEffect(() => {
    if (txHash) {
      handleCloseModal();
    }
  }, [txHash, handleCloseModal]);

  const messageCampaign = useMemo(() => {
    if (get(appSettings, "APP_SWAP_SUCCESS.content")) {
      return (
        <Box
          w="full"
          minH="50px"
          mt="4"
          borderRadius="12"
          py="4"
          className="alert-banner"
          bg={transparentize("primary.300", 0.3) as any}
          wordBreak="break-word"
          mb="2"
          dangerouslySetInnerHTML={{
            __html: get(appSettings, "APP_SWAP_SUCCESS.content"),
          }}
          px={{ base: 4, md: 8 }}
        />
      );
    }
    return null;
  }, [appSettings]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} size="full" onClose={handleCloseModal}>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bgColor="gray.900">
          <ModalHeader px="7" py="5" fontSize="md">
            <Box mb="4" fontSize="xl">
              Swap Confirmation
            </Box>
            <Flex justifyContent="space-between" align="center">
              <Flex justify="center" align="flex-start" direction="column">
                <Flex fontSize="lg" fontWeight={400}>
                  <Tooltip label={formatNumber(srcAmount, 4)} placement="top" hasArrow>
                    <Text maxW="100px" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                      {formatNumber(srcAmount, 4)}
                    </Text>
                  </Tooltip>
                  <Text ml="1">{srcToken?.symbol}</Text>
                </Flex>
                {!!srcUsdPrice && (
                  <Text ml="1" color="whiteAlpha.700" fontSize="sm">
                    ≈ {formatCurrency(srcUsdPrice * +srcAmount, 2)} USD
                  </Text>
                )}
              </Flex>
              <ArrowForwardIcon boxSize="6" opacity="0.5" />
              <Flex justify="center" align="flex-end" direction="column">
                <Flex fontSize="lg" fontWeight={400}>
                  <Tooltip label={formatNumber(destAmount, 4)} placement="top" hasArrow>
                    <Text maxW="100px" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                      {formatNumber(destAmount, 4)}
                    </Text>
                  </Tooltip>
                  <Text ml="1">{destToken?.symbol}</Text>
                </Flex>
                {!!destUsdPrice && (
                  <Text ml="1" color="whiteAlpha.700" fontSize="sm">
                    ≈ {formatCurrency(destUsdPrice * +destAmount, 2)} USD
                  </Text>
                )}
              </Flex>
            </Flex>
            <Divider my="5" background="#fff7f71f" />
            <Flex justify="space-between">
              <Text color="whiteAlpha.700">Rate:</Text>
              <Rate srcToken={srcToken} destToken={destToken} rate={rate} showReverse={true} />
            </Flex>
            {rateUpdated && (
              <Flex justify="flex-end" align="center">
                <Text color="primary.200" fontSize="sm" mr="1">
                  Rate has been changed!
                </Text>
              </Flex>
            )}
          </ModalHeader>
          <ModalCloseButton bg="transparent" border="0" color="white" top="18px" right="18px" />
          <ModalBody maxH="calc(100vh - 290px)" overflowY="auto" px="0" py="0">
            <Box background="gray.700" px="7" py="6">
              <InfoField
                content={
                  <GasSettings
                    gasPrice={gasPrice}
                    setGasPrice={setGasPrice}
                    gasLimit={gasLimit}
                    setGasLimit={setGasLimit}
                    priorityFee={priorityFee}
                    setPriorityFee={setPriorityFee}
                    defaultGasLimit={
                      gasLimitAsFail
                        ? DEFAULT_GAS_LIMIT.SWAP_ARBITRUM
                        : rate?.estimatedGas || DEFAULT_GAS_LIMIT.SWAP_ARBITRUM
                    }
                  />
                }
              />
              <InfoField
                title="Minimum received"
                tooltip="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
                content={
                  <Text>
                    {formatCurrency(minDestAmount)} {destToken?.symbol}
                  </Text>
                }
              />
              <InfoField
                title="Price impact"
                tooltip="There is a difference between the estimated price for your swap amount and the reference price. Note: Estimated price depends on your swap amount. Reference price is from Coingecko"
                content={refPriceDOM}
              />

              <InfoField
                title="Maximum gas fee"
                tooltip="The actual cost of the transaction is generally lower than the maximum estimated cost."
                content={
                  <Text>
                    {formatNumber(gasFee)} {NODE[chainId].currencySymbol}
                  </Text>
                }
              />
              <InfoField
                content={
                  <Flex direction="column" alignItems="flex-end">
                    <Text color="whiteAlpha.700" fontSize="sm">
                      ≈ {formatNumber(+gasFee * nativeUsdPrice, 2)} USD
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="sm">
                      {gasPrice} (Gas Price) * {gasLimit} (Gas Limit)
                    </Text>
                  </Flex>
                }
              />
            </Box>

            {(!priceDifference || priceDifference < -20) && (
              <Flex justify="center" align="center" direction="column" mt="4">
                {priceDifference && priceDifference < -20 && (
                  <Text color="red.400" textAlign="center" fontSize="sm">
                    Price impact is high. You may want to reduce your swap amount for a better rate.
                  </Text>
                )}
                {!priceDifference && (
                  <Text color="red.400" textAlign="center" fontSize="sm">
                    Missing price impact. Please swap with caution.
                  </Text>
                )}
                <Checkbox
                  isChecked={isSwapAnyway}
                  onChange={(e) => setIsSwapAnyway(e.target.checked)}
                  marginTop="2"
                  colorScheme="primary"
                >
                  Swap anyway
                </Checkbox>
              </Flex>
            )}
            {error && (
              <Text color="red.400" textAlign="center" fontSize="sm" mt="2">
                {error.slice(0, 80)}
              </Text>
            )}
          </ModalBody>
          <ModalFooter justifyContent="space-evenly" mb="5">
            <Button
              w="40"
              colorScheme="gray"
              mr={3}
              onClick={() => {
                handleCloseModal();
              }}
              color="white"
            >
              Cancel
            </Button>
            <Button
              w="40"
              colorScheme="primary"
              loadingText={loadingText}
              disabled={!isSwapAnyway || loadingText !== ""}
              isLoading={loadingText !== ""}
              className="confirm-swap-btn"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TxModal
        txHash={txHash}
        messageSuccess={messageCampaign}
        txType="SWAP"
        txDetail={() => (
          <Box mt="2">
            <Text>
              {formatCurrency(srcAmount)} {srcToken?.symbol} to {formatCurrency(destAmount)} {destToken?.symbol}
            </Text>
          </Box>
        )}
        txRating={true}
        resetData={callbackSuccess}
        renderBottom={(receipt, onClose) => (
          <>
            {/* {!receipt && (
              <Button onClick={onClose} w="120px" colorScheme="primary">
                Close
              </Button>
            )} */}
            {receipt && receipt.status && (
              <>
                <Button as={NavLink} to="/transfer" w="120px" mr="5" colorScheme="primary">
                  Transfer
                </Button>
                <Button onClick={onClose} w="120px" colorScheme="primary">
                  New Swap
                </Button>
              </>
            )}
            {receipt && !receipt.status && (
              <>
                <Button
                  onClick={() => {
                    onClose && onClose();
                  }}
                  w="120px"
                  mr="5"
                  colorScheme="primary"
                >
                  Cancel
                </Button>
                <Button as={Link} href="https://t.me/KrystalDefi" w="120px" target="_blank" colorScheme="primary">
                  Go to Support
                </Button>
              </>
            )}
          </>
        )}
      />
    </>
  );
};

export default SwapConfirmModal;
