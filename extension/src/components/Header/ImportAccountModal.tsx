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
import { useState, useCallback, useRef } from "react";
import { useWallet } from "src/hooks/useWallet";
import { setVault, keysSelector } from "src/store/keys";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import useCustomToast from "src/hooks/useCustomToast";
import { sendMessage } from "src/services/extension";

const ImportAccountModal = ({
  render,
  onCloseDrawer,
}: {
  render: (onOpen: () => void) => JSX.Element;
  onCloseDrawer: () => void;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { keyringController, accounts } = useAppSelector(keysSelector);
  const { setAccountsAndSelectAccount } = useWallet();
  const [privateKey, setPrivateKey] = useState("");
  const [errorPrivateKeyMessage, setErrorPrivateKeyMessage] = useState("");
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [walletName, setWalletName] = useState("Account " + accounts.length);
  const dispatch = useAppDispatch();
  const toast = useCustomToast();

  const initialRef = useRef<any>();

  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      handleSubmitPrivateKey();
    }
  };
  const handleCloseModal = useCallback(() => {
    setPrivateKey("");
    setErrorPrivateKeyMessage("");
    setErrorNameMessage("");
    onClose();
  }, [onClose]);

  const handleChangePrivateKey = useCallback(
    (e) => {
      setPrivateKey(e.target.value);
      setErrorPrivateKeyMessage("");
    },
    [setPrivateKey, setErrorPrivateKeyMessage],
  );

  const handleChangeName = useCallback(
    (e) => {
      setWalletName(e.target.value);
      setErrorNameMessage("");
    },
    [setWalletName, setErrorNameMessage],
  );

  const handleSubmitPrivateKey = useCallback(() => {
    if (walletName === "") {
      setErrorNameMessage("Wallet name cannot be empty");
      return;
    }
    if (keyringController && !errorPrivateKeyMessage) {
      keyringController
        .addNewKeyring("Simple Key Pair", [privateKey])
        .then(() => {
          const vault = keyringController.store.getState();
          dispatch(setVault(vault));
          sendMessage({ type: "store_vault", vault });
          toast({
            status: "success",
            title: "Import account successfully.",
          });
          setAccountsAndSelectAccount("IMPORT", walletName);
          setWalletName("Account " + (accounts.length + 1));
          handleCloseModal();
        })
        .then(() => {
          onCloseDrawer();
        })
        .catch((error: any) => {
          setErrorPrivateKeyMessage(error.message);
        });
    }
  }, [
    keyringController,
    errorPrivateKeyMessage,
    onCloseDrawer,
    privateKey,
    dispatch,
    toast,
    setAccountsAndSelectAccount,
    walletName,
    accounts.length,
    handleCloseModal,
  ]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size="full" initialFocusRef={initialRef}>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bg="black">
          <ModalHeader pt="6" fontSize="xl">
            Import Account
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="6" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
            <Text>
              Imported accounts will not be associated with your originally created account with Secret Recovery Phrase.
            </Text>
            <FormControl my={3}>
              <Text mt={4} fontSize="md">
                Label of your Account (optional)
              </Text>
              <InputGroup size="md">
                <Input
                  placeholder="Insert import wallet name..."
                  height="12"
                  value={walletName}
                  fontSize="lg"
                  errorBorderColor="red.300"
                  onChange={(e: any) => handleChangeName(e)}
                  type="text"
                  onKeyPress={(e: any) => handleEnter(e)}
                  bgColor="gray.800"
                  color="#F3F8F7"
                  mt={2}
                />
              </InputGroup>
              {errorNameMessage && (
                <Text color="red.500" fontSize="sm">
                  {errorNameMessage}
                </Text>
              )}
              <Text mt={4} fontSize="md">
                Wallet private key
              </Text>
              <InputGroup size="md">
                <Input
                  placeholder="Insert wallet private key..."
                  height="12"
                  value={privateKey}
                  fontSize="lg"
                  errorBorderColor="red.300"
                  onChange={(e: any) => handleChangePrivateKey(e)}
                  type={privateKey ? "text" : "password"}
                  onKeyPress={(e: any) => handleEnter(e)}
                  ref={initialRef}
                  bgColor="gray.800"
                  color="#F3F8F7"
                  mt={2}
                />
              </InputGroup>
              <Checkbox
                colorScheme="primary"
                isChecked={acceptTerms}
                onChange={(e: any) => setAcceptTerms(e.target.checked)}
                mt={4}
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
            {errorPrivateKeyMessage && (
              <Text color="red.500" fontSize="sm">
                {errorPrivateKeyMessage}
              </Text>
            )}
          </ModalBody>
          <ModalFooter py="6" justifyContent="space-between" alignItems="center" display="flex" mx={4}>
            <Button colorScheme="gray" onClick={handleCloseModal} color="white" minW="150px">
              Cancel
            </Button>
            <Button colorScheme="primary" onClick={handleSubmitPrivateKey} disabled={!acceptTerms} minW="150px">
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImportAccountModal;
