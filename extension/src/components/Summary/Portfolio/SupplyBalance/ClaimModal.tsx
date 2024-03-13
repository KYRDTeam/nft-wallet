import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
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
import { SlideFade } from "@chakra-ui/transition";
import { useCallback, useEffect, useMemo, useState } from "react";
import GasSettings from "src/components/common/GasSettings";
import InfoField from "src/components/common/InfoField";
import TxModal from "src/components/common/TxModal";
import { NODE } from "src/config/constants/chain";
import { useClaimEarnToken } from "src/hooks/useKrystalServices";
import { useAppSelector } from "src/hooks/useStore";
import { usePrice } from "src/hooks/useTokens";
import { globalSelector } from "src/store/global";
import { calculateTxFee, formatNumber } from "src/utils/helper";

interface ClaimModalProps {
  platform: string;
  balance: string | number;
  value: string | number;
  logo: string;
  render: (onOpen: () => void) => JSX.Element;
}

const ClaimModal = ({ platform, balance, value, logo, render }: ClaimModalProps) => {
  const { chainId } = useAppSelector(globalSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();
  const [defaultGasLimit, setDefaultGasLimit] = useState("1000000");
  const { getPrice } = usePrice();
  const nativeUsdPrice = getPrice(NODE[chainId].address);

  const { claim, loadingText, txHash, buildTx, resetState, error } = useClaimEarnToken(
    platform,
    gasPrice,
    gasLimit,
    priorityFee,
  );

  const gasFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

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
    claim();
  }, [claim]);

  const handleCloseModal = useCallback(() => {
    onClose();
    resetState();
  }, [onClose, resetState]);

  const openModal = useCallback(() => {
    onOpen();
  }, [onOpen]);

  return (
    <>
      {render(openModal)}

      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader textAlign="center" pt="8">
            Withdraw confirmation
          </ModalHeader>
          <ModalCloseButton bg="transparent" border="0" color="white" />
          <ModalBody px="10">
            <Flex justify="space-between">
              <Center gridGap="2">
                <Image src={logo} w="24px" />
                <Box>{balance}</Box>
              </Center>
              <Box>${value}</Box>
            </Flex>

            <Box background="gray.800" borderRadius="16" p="6" my="4" pt="4">
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

            <SlideFade in={!!error} offsetY="5px">
              <Center color="red.400" fontSize="sm" mt="3" textAlign="center">
                {error.slice(0, 80)}
              </Center>
            </SlideFade>
          </ModalBody>
          <ModalFooter py="10" justifyContent="space-evenly">
            <Button w="40" colorScheme="gray" mr={3} onClick={handleCloseModal} color="white">
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
        txType="CLAIM"
        txDetail={() => (
          <Box mt="2">
            <Center gridGap="2">
              <Image src={logo} w="24px" />
              <Box>{balance}</Box>
            </Center>
            <Box>${value}</Box>
          </Box>
        )}
      />
    </>
  );
};

export default ClaimModal;
