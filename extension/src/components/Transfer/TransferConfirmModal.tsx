import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Center, Divider, Flex, Text } from "@chakra-ui/layout";
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
import { NODE } from "src/config/constants/chain";
import { Token } from "src/config/types";
import { useTransfer } from "src/hooks/useSendTx";
import { useAppSelector } from "src/hooks/useStore";
import { usePrice } from "src/hooks/useTokens";
import { globalSelector } from "src/store/global";
import { getTransferTokenObj } from "src/utils/erc20";
import { ellipsis, formatCurrency } from "src/utils/formatBalance";
import { calculateTxFee, formatNumber, toBigAmount } from "src/utils/helper";
import { estimateGas } from "src/utils/web3";
import GasSettings from "../common/GasSettings";
import InfoField from "../common/InfoField";
import TxModal from "../common/TxModal";
import Gravatar from "react-gravatar";
import { useWallet } from "src/hooks/useWallet";
import { GAS_LIMIT_DEFAULT } from "src/config/constants/constants";
import { keysSelector } from "src/store/keys";
import { contactSelector } from "src/store/contact";

interface TransferConfirmModalProps {
  token?: Token;
  recipientAddr: string;
  amount: string;
  render: (onOpen: () => void) => JSX.Element;
  callBackSuccess?: () => void;
}

const TransferConfirmModal = ({ token, amount, recipientAddr, render, callBackSuccess }: TransferConfirmModalProps) => {
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();
  const [defaultGasLimit, setDefaultGasLimit] = useState(GAS_LIMIT_DEFAULT);
  const { accountsName } = useAppSelector(keysSelector);
  const { contacts } = useAppSelector(contactSelector);

  const { transfer, loadingText, txHash, resetTransferState, error } = useTransfer(gasPrice, gasLimit, priorityFee);

  const { getPrice } = usePrice();
  const srcUsdPrice = getPrice(token?.address);
  const nativeUsdPrice = getPrice(NODE[chainId].address);

  const recipientName = useMemo(() => {
    const accExist = contacts.find((contact: any) => contact.address === recipientAddr);

    if (!!accExist) {
      return accExist.name;
    }
    return accountsName[recipientAddr] || "Recipient Address:";
  }, [accountsName, contacts, recipientAddr]);

  useEffect(() => {
    if (isOpen && token && gasPrice && gasLimit === defaultGasLimit) {
      const data = getTransferTokenObj(chainId, token.address, recipientAddr, toBigAmount(amount, token.decimals));
      estimateGas(chainId, {
        from: account,
        to: token.isNative ? recipientAddr : token.address,
        data,
        gasPrice,
      })
        .then((gas) => {
          const val = (gas * 1.2).toFixed();
          setGasLimit(val);
          setDefaultGasLimit(val);
        })
        .catch(console.log);
    }
  }, [isOpen, defaultGasLimit, token, gasPrice, account, amount, recipientAddr, chainId, gasLimit]);

  const gasFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

  const handleConfirm = useCallback(async () => {
    transfer(recipientAddr, amount, token);
  }, [token, amount, transfer, recipientAddr]);

  const handleCloseModal = useCallback(() => {
    onClose();
    resetTransferState();
  }, [onClose, resetTransferState]);

  useEffect(() => {
    if (txHash) {
      handleCloseModal();
    }
  }, [txHash, handleCloseModal]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size="full">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bgColor="gray.900">
          <ModalHeader p="7">Transfer Confirmation</ModalHeader>
          <ModalCloseButton top="27px" right="17px" bg="transparent" border="0" color="white" />
          <ModalBody px="7" maxH="calc( 100vh - 180px )" overflowY="auto">
            <Flex alignItems="center" wordBreak="break-word">
              <Box as={Gravatar} email={recipientAddr} size={30} mr="2" borderRadius="50%" protocol="http://" />
              <Box>
                <Text noOfLines={1} title={recipientName} color="#F3F8F7">
                  {recipientName}
                </Text>
                <Box opacity="0.75" fontSize="sm" color="#A9AEAD">
                  {ellipsis(recipientAddr, 30, 5)}
                </Box>
              </Box>
            </Flex>
            <Box mt="5" color="yellow.400" fontSize="xs">
              Please sure this address supports {NODE[chainId].name} network. You will lose your assets if this address
              doesn't support {NODE[chainId].name} compatible retrieval.
            </Box>
            <Divider my="5" />
            <Flex justify="space-between">
              <Box>Amount to Transfer</Box>
              <Box textAlign="right">
                <Box>
                  {formatCurrency(amount)} {token?.symbol}
                </Box>
                {!!srcUsdPrice && (
                  <Text ml="1" color="whiteAlpha.700" fontSize="sm">
                    ≈ {formatCurrency(srcUsdPrice * +amount)} USD
                  </Text>
                )}
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
          <ModalFooter justifyContent="space-evenly" pb="5">
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
        txDetail={() => (
          <Box mt="2">
            <Text>
              {formatCurrency(amount)} {token?.symbol} to {ellipsis(recipientAddr, 18, 5)}
            </Text>
          </Box>
        )}
        resetData={callBackSuccess}
      />
    </>
  );
};

export default TransferConfirmModal;
