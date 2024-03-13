import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
} from "@chakra-ui/modal";
import { Box, Text } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import useCustomToast from "src/hooks/useCustomToast";
import { useWallet } from "src/hooks/useWallet";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { keysSelector, setVault } from "src/store/keys";
import { sendMessage } from "src/services/extension";

const DeleteAccountConfirmModal = ({
  render,
  onCloseDetailModal,
}: {
  render: (onOpen: () => void) => JSX.Element;
  onCloseDetailModal: () => void;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { keyringController, accounts, accountsName } = useAppSelector(keysSelector);
  const { setAccountsAndSelectAccount, account } = useWallet();
  const dispatch = useAppDispatch();
  const toast = useCustomToast();

  const initialRef = useRef<any>();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmitAddAccount = useCallback(() => {
    if (accounts.length === 1) {
      toast({
        status: "error",
        title: "You must have at least one account.",
      });
      return;
    }
    if (accounts.length > 1 && keyringController) {
      keyringController.removeAccount(account).then(() => {
        const vault = keyringController.store.getState();
        dispatch(setVault(vault));
        sendMessage({ type: "store_vault", vault });
        toast({
          status: "success",
          title: "Delete account successfully.",
        });
        if (account) {
          setAccountsAndSelectAccount("DELETE", account);
        }
        handleClose();
        onCloseDetailModal();
      });
    }
  }, [
    account,
    accounts.length,
    dispatch,
    handleClose,
    keyringController,
    onCloseDetailModal,
    setAccountsAndSelectAccount,
    toast,
  ]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="full" initialFocusRef={initialRef}>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bg="black">
          <ModalHeader textAlign="center" pt="6" fontSize="xl">
            Remove account
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="10" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center">
            <Box borderRadius="16px" bg="gray.600" p={[4, 6]} w="100%" my={5}>
              <Text fontWeight="semibold">{accountsName[account || ""]}</Text>
              <Text color="whiteAlpha.700">{account}</Text>
            </Box>
            <Box>
              <Text color="#F2BE37" textAlign="center">
                This account will be removed from your wallet. Please make sure you have the original Secret Recovery
                Phrase or private key for this imported account before continuing. You can import or create accounts
                again from the account sidebar.
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter py="10" justifyContent="space-around" alignItems="center" display="flex" mx={4}>
            <Button colorScheme="gray" onClick={handleClose} color="white" w="150px" ref={initialRef}>
              No, keep wallet
            </Button>
            <Button onClick={handleSubmitAddAccount} w="150px" bgColor="#FF6E40" _hover={{ bgColor: "red.700" }}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteAccountConfirmModal;
