import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
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
import { useCallback, useEffect, useMemo, useRef } from "react";
import { NODE } from "src/config/constants/chain";
import { Token } from "src/config/types";
import { useMultiSend } from "src/hooks/useMultiSend";
import { useAppSelector } from "src/hooks/useStore";
import { usePrice } from "src/hooks/useTokens";
import { useWallet } from "src/hooks/useWallet";
import { globalSelector } from "src/store/global";
import { formatCurrency, getBalanceDecimal } from "src/utils/formatBalance";
import { formatNumber } from "src/utils/helper";
import GasSettings from "../common/GasSettings";
import InfoField from "../common/InfoField";
import TxModal from "../common/TxModal";
import { useGasSetting } from "src/hooks/useGasSetting";
import TokenLogo from "../common/TokenLogo";
import { toChecksumAddress } from "web3-utils";

interface MultiSendConfirmModalProps {
  recipients: any[];
  tokenSummary: any[];
  render: (onOpen: () => void, loadingText: string) => JSX.Element;
  callbackSuccess: () => void;
  callbackClose: () => void;
}

const MultiSendConfirmModal = ({
  recipients,
  tokenSummary,
  callbackSuccess,
  callbackClose,
  render,
}: MultiSendConfirmModalProps) => {
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { gasPrice, priorityFee, gasLimit, gasFee, setGasPrice, setGasLimit, setPriorityFee } = useGasSetting();

  const recipientsRefForTxModalDetail = useRef<any[]>([]);

  const { transfer, loadingText, txHash, error, resetSwapState, buildTx } = useMultiSend(
    gasPrice,
    gasLimit,
    priorityFee,
    (gasLimit: any) => {
      setGasLimit(gasLimit);
    },
  );

  const openConfirmModal = useCallback(async () => {
    const sends = recipients.map(({ address, token, amount }: { address: string; token: Token; amount: string }) => ({
      toAddress: toChecksumAddress(address).toLowerCase(),
      tokenAddress: token.address,
      amount: getBalanceDecimal(amount, token.decimals),
    }));

    await buildTx({ senderAddress: account || "", sends });
    onOpen();
  }, [account, buildTx, onOpen, recipients]);

  const { getPrice } = usePrice();
  const nativeUsdPrice = getPrice(NODE[chainId].address);

  const netValueToSend = useMemo(() => {
    return tokenSummary.reduce((prevToken, currentToken) => {
      const tokenPrice = getPrice(currentToken.token.address);
      return prevToken + tokenPrice * currentToken.amount;
    }, 0);
  }, [getPrice, tokenSummary]);

  const renderTableRecipient = useCallback((recipients: any[]) => {
    return (
      <Box maxHeight="500px" minHeight="100px" w="full" overflowY="auto">
        <Table variant="simple">
          <Thead pos="sticky" top="0" zIndex="1" bg="gray.700">
            <Tr>
              <Th borderColor="whiteAlpha.200">No.</Th>
              <Th borderColor="whiteAlpha.200">Address</Th>
              <Th borderColor="whiteAlpha.200">Token</Th>
              <Th borderColor="whiteAlpha.200" isNumeric>
                Amount
              </Th>
            </Tr>
          </Thead>
          <Tbody borderColor="white">
            {recipients.map((recipient, index) => {
              return (
                <Tr key={index}>
                  <Td borderColor="whiteAlpha.200">{index + 1}.</Td>
                  <Td borderColor="whiteAlpha.200">{recipient.address}</Td>
                  <Td borderColor="whiteAlpha.200">
                    <Flex alignItems="center">
                      <TokenLogo mr="2" src={recipient?.token?.logo} />
                      <Text>{recipient?.token?.symbol}</Text>
                    </Flex>
                  </Td>
                  <Td borderColor="whiteAlpha.200" isNumeric>
                    {recipient.amount}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    );
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!account) return;
    recipientsRefForTxModalDetail.current = recipients;
    transfer();
  }, [account, recipients, transfer]);

  const handleCloseModal = useCallback(() => {
    onClose();
    callbackClose && callbackClose();
    resetSwapState();
  }, [callbackClose, onClose, resetSwapState]);

  const prevTxHash = useRef("");

  useEffect(() => {
    if (!txHash) return;

    if (!prevTxHash.current || prevTxHash.current !== txHash) {
      handleCloseModal();
      callbackSuccess && callbackSuccess();
      prevTxHash.current = txHash;
    }
  }, [txHash, handleCloseModal, callbackSuccess]);

  return (
    <>
      {render(openConfirmModal, loadingText)}
      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size="full">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bgColor="gray.900">
          <ModalHeader textAlign="left" p="8">
            Transfer Confirmation
          </ModalHeader>
          <ModalCloseButton bg="transparent" border="0" color="white" top="30px" right="22px" />
          <ModalBody px="8" maxH="calc( 100vh - 200px )" overflowY="auto">
            <Box color="yellow.400" fontSize="sm">
              Please sure all recipient address supports {NODE[chainId].name} network. You will lose your assets if any
              recipient address doesn't support{" "}
              <Text display="inline" fontWeight="bold" fontStyle="italic" textDecoration="underline">
                {NODE[chainId].name}
              </Text>{" "}
              compatible retrieval.
            </Box>
            <Divider my="2" />
            <Accordion allowToggle>
              <AccordionItem border="unset">
                <AccordionButton px="0">
                  <Flex alignItems="center" justifyContent="space-between" w="full">
                    <Box>Number Recipients:</Box>
                    <Flex opacity="0.75" fontSize="sm" alignItems="center">
                      <Text fontSize="lg">{recipients.length}</Text>
                      <Button variant="link" colorScheme="primary" ml="1">
                        Show
                      </Button>
                      <AccordionIcon />
                    </Flex>
                  </Flex>
                </AccordionButton>
                <AccordionPanel pb={4} px="0">
                  {renderTableRecipient(recipients)}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Flex justify="space-between" mt="2">
              <Box>Amount to Transfer:</Box>
              <Box textAlign="right">
                {tokenSummary.map(({ token, amount }: { token: Token; amount: number }) => (
                  <Text key={token.address}>
                    {formatCurrency(amount)} {token.symbol}
                  </Text>
                ))}
                <Text color="whiteAlpha.500">≈ ${formatCurrency(netValueToSend)}</Text>
              </Box>
            </Flex>

            <Box background="gray.700" borderRadius="16" p="6" mt="4" pt="4">
              <InfoField
                content={
                  <GasSettings
                    gasPrice={gasPrice}
                    setGasPrice={setGasPrice}
                    gasLimit={gasLimit}
                    setGasLimit={setGasLimit}
                    priorityFee={priorityFee}
                    setPriorityFee={setPriorityFee}
                    defaultGasLimit={(gasLimit || "1000000").toString()}
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
                      ≈ {formatNumber(+gasFee * nativeUsdPrice)} USD
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
        txType="TRANSFER"
        callbackSuccess={callbackSuccess}
        txDetail={() => <Box mt="2">{/* {renderTableRecipient(recipientsRefForTxModalDetail.current)} */}</Box>}
      />
    </>
  );
};

export default MultiSendConfirmModal;
