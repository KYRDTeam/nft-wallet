import { Button } from "@chakra-ui/button";
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
import { NODE } from "src/config/constants/chain";
import { Platform, Token } from "src/config/types";
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
  token?: Token;
  amount: string;
  platform?: Platform;
  render: (onOpen: () => void) => JSX.Element;
}

const SupplyConfirmModal = ({ token, amount, platform, render }: SupplyConfirmModalProps) => {
  const { chainId } = useAppSelector(globalSelector);
  const { distributionBalance } = useAppSelector(earnSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();
  const [defaultGasLimit, setDefaultGasLimit] = useState("1000000");

  const { getPrice } = usePrice();

  const srcUsdPrice = getPrice(token?.address);
  const nativeUsdPrice = getPrice(NODE[chainId].address);

  const gasFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

  const isMaxNativeAmount = token?.isNative && +token.humanizeBalance <= +amount + +gasFee * 1.05;

  const amountToSend = useMemo(() => {
    return isMaxNativeAmount ? Number(amount) - Number(gasFee) * 1.05 : amount;
  }, [isMaxNativeAmount, amount, gasFee]);

  const { buildTx, swap, loadingText, txHash, resetSwapState, error } = useSwapAndDeposit(
    amountToSend,
    +amountToSend,
    platform,
    undefined,
    token,
    token,
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
          <ModalBody px="10" maxH="calc( 100vh - 250px )" overflowY="auto">
            <Box bg="gray.800" borderRadius="16" p="6" my="4" pt="4">
              <Box textAlign="center" fontSize="sm">
                <Text fontSize="xl">
                  {formatCurrency(amount)} {token?.symbol}
                </Text>
                {!!srcUsdPrice && <TextDeep>≈ {formatCurrency(srcUsdPrice * +amount)} USD</TextDeep>}
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
                  <TokenLogo src={token?.logo} />
                  <Box ml="2">Supply APY</Box>
                </Center>
                {platform && <Box>{(platform.supplyRate * 100).toFixed(2)}%</Box>}
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
                title="Net APY"
                tooltip="Positive APY means you will receive interest and negative means you will pay interest."
                content={<Box>{netAPY}</Box>}
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

            {error && (
              <Text color="red.400" textAlign="center" fontSize="sm" mt="2">
                {error.slice(0, 80)}
              </Text>
            )}
          </ModalBody>
          <ModalFooter py="10" justifyContent="space-evenly">
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
              disabled={loadingText !== ""}
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
              {formatCurrency(amount)} {token?.symbol} with {netAPY} APY
            </Text>
          </Box>
        )}
      />
    </>
  );
};

export default SupplyConfirmModal;
