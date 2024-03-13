import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TextDeep } from "src/theme";
import { ReactComponent as PigIconSVG } from "src/assets/images/icons/pig.svg";
import { NODE } from "src/config/constants/chain";
import { Platform, RateType, Token } from "src/config/types";
import { useSwapAndDeposit } from "src/hooks/useKrystalServices";
import { useAppSelector } from "src/hooks/useStore";
import { usePrice } from "src/hooks/useTokens";
import { globalSelector } from "src/store/global";
import { formatCurrency } from "src/utils/formatBalance";
import { calculateTxFee, formatNumber } from "src/utils/helper";
import GasSettings from "src/components/common/GasSettings";
import InfoField from "src/components/common/InfoField";
import TxModal from "src/components/common/TxModal";
import { ArrowDownIcon } from "src/components/icons";
import TokenLogo from "src/components/common/TokenLogo";
import { earnSelector } from "src/store/earn";

interface SupplyConfirmModalProps {
  srcToken?: Token;
  srcAmount: string;
  destToken?: Token;
  rate?: RateType;
  destAmount: string;
  slippage: string;
  priceDifference?: number;
  platform?: Platform;
  refPriceDOM: JSX.Element;
  render: (onOpen: () => void) => JSX.Element;
}

const SupplyConfirmModal = ({
  srcToken,
  srcAmount,
  destToken,
  destAmount,
  rate,
  platform,
  slippage,
  priceDifference,
  refPriceDOM,
  render,
}: SupplyConfirmModalProps) => {
  const { chainId } = useAppSelector(globalSelector);
  const { distributionBalance } = useAppSelector(earnSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSwapAnyway, setIsSwapAnyway] = useState(false);

  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();
  const [defaultGasLimit, setDefaultGasLimit] = useState("1000000");

  const { getPrice } = usePrice();

  const srcUsdPrice = getPrice(srcToken?.address);
  const destUsdPrice = getPrice(destToken?.address);
  const nativeUsdPrice = getPrice(NODE[chainId].address);

  useEffect(() => {
    if (!isSwapAnyway && isOpen) setIsSwapAnyway(!!priceDifference && priceDifference >= -20);
  }, [priceDifference, isOpen, isSwapAnyway]);

  const gasFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

  const isMaxNativeAmount = srcToken?.isNative && +srcToken.humanizeBalance <= +srcAmount + +gasFee * 1.05;

  const srcAmountToSend = useMemo(() => {
    return isMaxNativeAmount ? Number(srcAmount) - Number(gasFee) * 1.05 : srcAmount;
  }, [isMaxNativeAmount, srcAmount, gasFee]);

  const minDestAmount = useMemo(() => {
    let realDestAmount: string | number = destAmount;
    if (isMaxNativeAmount && rate) {
      realDestAmount = +srcAmountToSend * rate.humanizeRate;
    }
    return +realDestAmount - +realDestAmount * (+slippage / 100);
  }, [destAmount, srcAmountToSend, slippage, isMaxNativeAmount, rate]);

  const { buildTx, swap, loadingText, txHash, resetSwapState, error } = useSwapAndDeposit(
    srcAmountToSend,
    minDestAmount,
    platform,
    rate,
    srcToken,
    destToken,
    gasPrice,
    gasLimit,
    priorityFee,
  );

  useEffect(() => {
    if (isOpen) {
      buildTx()
        .then((data) => {
          setGasLimit(data.gasLimit);
          setDefaultGasLimit(data.gasLimit);
        })
        .catch(console.log);
    }
  }, [isOpen, buildTx]);

  const handleConfirm = useCallback(() => {
    swap();
  }, [swap]);

  const handleCloseModal = useCallback(() => {
    onClose();
    resetSwapState();
    setIsSwapAnyway(false);
  }, [onClose, resetSwapState]);

  useEffect(() => {
    if (txHash) handleCloseModal();
  }, [txHash, handleCloseModal]);

  const netAPY = useMemo(() => {
    if (platform) {
      return `${(platform.supplyRate * 100).toFixed(2)}%`;
    }
    return "";
  }, [platform]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size="full">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader textAlign="center" pt="8">
            Supply Confirmation
          </ModalHeader>
          <ModalCloseButton bg="transparent" border="0" color="white" />
          <ModalBody px="6" maxH="calc( 100vh - 250px )" overflowY="auto">
            <Box bg="gray.800" borderRadius="16" p="4" my="2" pt="4">
              <Box textAlign="center" fontSize="sm">
                <Text fontSize="xl">
                  {formatCurrency(srcAmount)} {srcToken?.symbol}
                </Text>
                {!!srcUsdPrice && <TextDeep>≈ {formatCurrency(srcUsdPrice * +srcAmount)} USD</TextDeep>}
                <Center my="2">
                  <ArrowDownIcon width="10px" />
                </Center>
                <Text fontSize="xl">
                  {formatCurrency(destAmount)} {destToken?.symbol}
                </Text>
                {!!destUsdPrice && <TextDeep>≈ {formatCurrency(destUsdPrice * +destAmount)} USD</TextDeep>}
              </Box>
            </Box>

            <Center my="5">
              <ArrowDownIcon />
            </Center>

            <Box bg="gray.800" borderRadius="16" p="6" my="4" pt="4">
              <Center mb="3" fontSize="lg">
                {platform?.name}
              </Center>
              <Flex justify="space-between" fontSize="lg">
                <Center>
                  <TokenLogo src={destToken?.logo} />
                  <Box ml="2">Supply APY</Box>
                </Center>
                {platform && <Box>{netAPY}</Box>}
              </Flex>

              {platform?.distributionSupplyRate && distributionBalance && (
                <Flex justify="space-between" fontSize="lg" mt="3">
                  <Center>
                    <TokenLogo src={distributionBalance.logo} />
                    <Box ml="2">Distribution APY</Box>
                  </Center>
                  {platform && <Box>{(platform.distributionSupplyRate * 100).toFixed(2)}%</Box>}
                </Flex>
              )}
            </Box>

            <Box bg="gray.800" borderRadius="16" p="6" my="4" pt="4">
              <InfoField
                content={
                  <GasSettings
                    gasPrice={gasPrice}
                    setGasPrice={setGasPrice}
                    gasLimit={gasLimit}
                    setGasLimit={setGasLimit}
                    priorityFee={priorityFee}
                    setPriorityFee={setPriorityFee}
                    defaultGasLimit={defaultGasLimit}
                  />
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
                      ≈ {formatNumber(+gasFee * nativeUsdPrice)} USD
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="sm">
                      {gasPrice} (Gas Price) * {gasLimit} (Gas Limit)
                    </Text>
                  </Flex>
                }
              />
            </Box>

            <Flex backgroundColor="#063f30" borderRadius="16" alignItems="center" paddingY="4" marginTop="4">
              <Flex justify="center" alignItems="center" w="24">
                <Flex justify="center" alignItems="center" bg="primary.200" boxSize="6" borderRadius="full">
                  <PigIconSVG />
                </Flex>
              </Flex>
              <Box color="primary.200" fontSize="sm" pr="4">
                Your transaction will be routed to{" "}
                <Text display="inline" fontStyle="capitalize">
                  {rate?.platform}
                </Text>
              </Box>
            </Flex>

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
          <ModalFooter py="6" justifyContent="space-evenly">
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
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TxModal
        txHash={txHash}
        txType="EARN"
        txDetail={() => (
          <Box mt="2">
            <Text>
              {formatCurrency(destAmount)} {destToken?.symbol} with {netAPY}
            </Text>
          </Box>
        )}
      />
    </>
  );
};

export default SupplyConfirmModal;
