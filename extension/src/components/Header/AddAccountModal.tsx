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
import { Checkbox, FormControl, Input, InputGroup, Link, Text } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import useCustomToast from "src/hooks/useCustomToast";
import { useWallet } from "src/hooks/useWallet";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { keysSelector, setVault } from "src/store/keys";
import { sendMessage } from "src/services/extension";

const AddAccountModal = ({
  render,
  onCloseDrawer,
}: {
  render: (onOpen: () => void) => JSX.Element;
  onCloseDrawer: () => void;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { keyringController, accounts } = useAppSelector(keysSelector);
  const { setAccountsAndSelectAccount } = useWallet();
  const [errorMessage, setErrorMessage] = useState("");
  const [accountName, setAccountName] = useState("Account " + accounts.length);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const dispatch = useAppDispatch();
  const toast = useCustomToast();

  const initialRef = useRef<any>();

  const handleClose = useCallback(() => {
    setErrorMessage("");
    onClose();
  }, [onClose]);

  const handleSubmitAddAccount = useCallback(() => {
    if (keyringController) {
      sendMessage({ type: "get_password" }).then((password) => {
        keyringController.submitPassword(password).then(() => {
          const keyring = keyringController.keyrings[0];
          keyringController
            .addNewAccount(keyring)
            .then(() => {
              const vault = keyringController.store.getState();
              dispatch(setVault(vault));
              sendMessage({ type: "store_vault", vault });
              toast({
                status: "success",
                title: "Add account successfully.",
              });
              setAccountsAndSelectAccount("CREATE", accountName);
              handleClose();
              setAccountName("Account " + (accounts.length + 1));
            })
            .catch((error: any) => {
              setErrorMessage(error.message);
            });
        });
      });
    }
    onCloseDrawer();
  }, [
    accountName,
    accounts.length,
    dispatch,
    handleClose,
    keyringController,
    onCloseDrawer,
    setAccountsAndSelectAccount,
    toast,
  ]);

  const handleEnter = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSubmitAddAccount();
      }
    },
    [handleSubmitAddAccount],
  );

  return (
    <>
      {render(onOpen)}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
        size="full"
        initialFocusRef={initialRef}
      >
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bg="#0F1010">
          <ModalHeader pt="6" fontSize="xl">
            Create New Account
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            px="6"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            mt={3}
          >
            <Text>Label of your Account (optional)</Text>
            <FormControl my={3}>
              <InputGroup size="md">
                <Input
                  placeholder="Insert your account name..."
                  height="12"
                  value={accountName}
                  fontSize="lg"
                  errorBorderColor="red.300"
                  onChange={(e: any) => setAccountName(e.target.value)}
                  type={accountName ? "text" : "password"}
                  onKeyPress={(e: any) => handleEnter(e)}
                  bgColor="gray.800"
                  color="#F3F8F7"
                  ref={initialRef}
                />
              </InputGroup>
              <Checkbox
                colorScheme="primary"
                isChecked={acceptTerms}
                onChange={(e: any) => setAcceptTerms(e.target.checked)}
                mt={3}
              >
                I accept
                <Link
                  href="https://files.krystal.app/terms.pdf"
                  target="_blank"
                  color="primary.200"
                  display="inline"
                  marginX="1"
                >
                  Terms of Use
                </Link>
                and
                <Link
                  href="https://files.krystal.app/privacy.pdf"
                  target="_blank"
                  color="primary.200"
                  display="inline"
                  marginX="1"
                >
                  Privacy Policy
                </Link>
                .
              </Checkbox>
            </FormControl>
          </ModalBody>
          {errorMessage && (
            <Text color="red.500" fontSize="sm">
              {errorMessage}
            </Text>
          )}
          <ModalFooter
            py="6"
            justifyContent="space-between"
            alignItems="center"
            display="flex"
            mx={4}
          >
            <Button
              colorScheme="gray"
              onClick={handleClose}
              color="white"
              minW="150px"
            >
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              onClick={handleSubmitAddAccount}
              minW="150px"
              disabled={!acceptTerms}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAccountModal;
