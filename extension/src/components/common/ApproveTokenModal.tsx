import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Center, Flex } from "@chakra-ui/layout";
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
import { useWallet } from "src/hooks/useWallet";
import { estimateGas } from "src/utils/web3";
import { NODE } from "../../config/constants/chain";
import { SMART_WALLET_PROXY } from "../../config/constants/contracts";
import { Token } from "../../config/types";
import { useSendTx } from "../../hooks/useSendTx";
import { useAppSelector } from "../../hooks/useStore";
import { usePrice } from "../../hooks/useTokens";
import { globalSelector } from "../../store/global";
import { getApproveTokenObj } from "../../utils/erc20";
import { calculateTxFee, formatNumber } from "../../utils/helper";
import GasSettings from "./GasSettings";
import TxModal from "./TxModal";

interface ApprovalModalProps {
  srcToken?: Token;
  srcAmount?: string;
  spender?: string;
  render: (onOpen: () => void) => JSX.Element;
  onSuccess?: () => void;
  resetData?: () => void;
}

const ApproveTokenModal = ({ srcToken, render, spender, onSuccess, resetData }: ApprovalModalProps) => {
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();
  const [defaultGasLimit, setDefaultGasLimit] = useState("70000");
  const { getPrice } = usePrice();
  const nativeUsdPrice = getPrice(NODE[chainId].address);

  const { send, loadingText, txHash, resetState, error } = useSendTx();

  const gasFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

  useEffect(() => {
    if (isOpen && srcToken && spender && gasPrice && gasLimit === defaultGasLimit) {
      const data = getApproveTokenObj(chainId, srcToken.address, spender);
      estimateGas(chainId, {
        from: account,
        to: srcToken.isNative ? spender : srcToken.address,
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
  }, [isOpen, defaultGasLimit, srcToken, gasPrice, account, spender, chainId, gasLimit]);

  const handleConfirm = useCallback(async () => {
    if (srcToken?.address) {
      const data = getApproveTokenObj(chainId, srcToken?.address, spender || SMART_WALLET_PROXY[chainId]);
      send({
        to: srcToken.address,
        data: data,
        gasPrice,
        gasLimit,
        priorityFee,
      });
    }
  }, [srcToken?.address, chainId, gasPrice, gasLimit, priorityFee, send, spender]);

  const handleCloseModal = useCallback(() => {
    onClose();
    resetState();
  }, [onClose, resetState]);

  useEffect(() => {
    if (txHash) handleCloseModal();
  }, [txHash, handleCloseModal]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader textAlign="center" pt="8">
            Approve Token
          </ModalHeader>
          <ModalCloseButton bg="transparent" border="0" color="white" />
          <ModalBody px="10">
            <Box>You need to approve Krystal to spend {srcToken?.symbol}:</Box>
            <Box background="gray.800" borderRadius="16" p="6" my="4" pt="4">
              {spender || SMART_WALLET_PROXY[chainId]}
            </Box>
            <Flex justify="space-between">
              <Box opacity="0.75">Gas Fee</Box>
              <Box textAlign="right">
                {formatNumber(gasFee)} {NODE[chainId].currencySymbol} ({formatNumber(+gasFee * nativeUsdPrice)} USD)
                <GasSettings
                  gasPrice={gasPrice}
                  setGasPrice={setGasPrice}
                  gasLimit={gasLimit}
                  setGasLimit={setGasLimit}
                  priorityFee={priorityFee}
                  setPriorityFee={setPriorityFee}
                  defaultGasLimit={defaultGasLimit}
                />
              </Box>
            </Flex>

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
      <TxModal txHash={txHash} callbackSuccess={onSuccess} resetData={resetData} />
    </>
  );
};

export default ApproveTokenModal;
