import { Button } from "@chakra-ui/button";
import { useClipboard, useDisclosure } from "@chakra-ui/hooks";
import { Box, Center } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import QRCode from "qrcode.react";
import { NODE } from "src/config/constants/chain";
import { useAppSelector } from "src/hooks/useStore";
import { useWallet } from "src/hooks/useWallet";
import { globalSelector } from "src/store/global";

const QrCodeModal = ({ render }: { render: (onOpen: () => void) => JSX.Element }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { hasCopied, onCopy } = useClipboard(account || "");

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader textAlign="center" pt="8">
            Receive
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="10">
            <Center flexDir="column" textAlign="center">
              <Box as={QRCode} value={account || ""} p="3" bg="white" borderRadius="xl" mb="5" />
              {account}
              <Box opacity="0.75" mt="10" fontSize="sm">
                <Box>
                  Only transfer {NODE[chainId].currencySymbol} or any {NODE[chainId].standard} token to this address
                </Box>
                <Box>*Transferring any other tokens may result in loss of your funds</Box>
              </Box>
            </Center>
          </ModalBody>

          <ModalFooter py="10" justifyContent="space-evenly">
            <Button w="40" colorScheme="gray" mr={3} onClick={onClose} color="white">
              Cancel
            </Button>
            <Button w="40" colorScheme="primary" onClick={onCopy}>
              {hasCopied ? "Copied!" : "Copy"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QrCodeModal;
