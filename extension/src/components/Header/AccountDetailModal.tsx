import { Button } from "@chakra-ui/button";
import { useClipboard, useDisclosure } from "@chakra-ui/hooks";
import { Box, Center, Link, Flex } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { CheckIcon, CopyIcon, DeleteIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import QRCode from "qrcode.react";
import { useCallback, useEffect, useRef, useState } from "react";
import useCustomToast from "src/hooks/useCustomToast";
import { useWallet } from "src/hooks/useWallet";
import ExportSecret from "./ExportSecret";
import { NODE } from "src/config/constants/chain";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { FormControl, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { useAppDispatch } from "../../hooks/useStore";
import { keysSelector, setAccountsName } from "src/store/keys";
import DeleteAccountConfirmModal from "./DeleteAccountConfirmModal";

const AccountDetailModal = ({ render }: { render: (onOpen: () => void) => JSX.Element }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { account } = useWallet();
  const { accountsName } = useAppSelector(keysSelector);
  const { chainId } = useAppSelector(globalSelector);
  const { hasCopied, onCopy } = useClipboard(account || "");
  const accountKey = account as keyof typeof accountsName;
  const [newAccountName, setNewAccountName] = useState(accountsName[accountKey] || "");
  const [errMsg, setErrMsg] = useState("");
  const toast = useCustomToast();
  const dispatch = useAppDispatch();

  const initialRef = useRef<any>();

  const handleClose = useCallback(() => {
    onClose();
    setNewAccountName(accountsName[accountKey]);
    setErrMsg("");
  }, [accountsName, accountKey, onClose]);

  const handleChangeAccountName = useCallback(() => {
    if (newAccountName === "") {
      setErrMsg("Account name cannot be empty");
      return;
    }
    if (account) {
      dispatch(setAccountsName({ address: account, name: newAccountName }));
    }
    toast({
      status: "success",
      title: "Change account name successfully.",
    });
    handleClose();
  }, [newAccountName, account, toast, handleClose, dispatch]);

  const handleChange = useCallback((e) => {
    setNewAccountName(e.target.value);
    setErrMsg("");
  }, []);

  const handleEnter = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleChangeAccountName();
      }
    },
    [handleChangeAccountName],
  );

  useEffect(() => {
    if (hasCopied) {
      toast({
        status: "success",
        title: "Copied!",
      });
    }
  }, [hasCopied, toast]);

  useEffect(() => {
    if (accountsName[accountKey]) {
      setNewAccountName(accountsName[accountKey]);
    }
  }, [accountKey, accountsName, setNewAccountName]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="full" initialFocusRef={initialRef}>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bg="black">
          <ModalHeader textAlign="center" pt="4" fontSize="xl">
            Wallet Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="8" display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
            <FormControl>
              <Text mx={2}>Change Wallet title</Text>
              <InputGroup size="md" mx={2}>
                <Input
                  type="text"
                  placeholder="Enter new wallet name..."
                  value={newAccountName}
                  onChange={(e: any) => {
                    handleChange(e);
                  }}
                  mt={2}
                  mr={4}
                  bg="gray.700"
                  color="#F3F8F7"
                  fontSize="16px"
                  ref={initialRef}
                  onKeyPress={(e: any) => handleEnter(e)}
                />
                <InputRightElement mt={2}>
                  <Button onClick={handleChangeAccountName} bg="#0F0F0F" borderRadius="10px" px={2} h="30px" mr={10}>
                    <CheckIcon color="primary.300" />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {errMsg && <Text color="red.500">{errMsg}</Text>}
            <Center flexDir="column" w="100%">
              <Box as={QRCode} value={account || ""} p="3" bg="white" borderRadius="xl" mb={6} mt={8} />
              <Box
                p={2}
                w="95%"
                borderRadius={16}
                _hover={{ bg: "gray.500" }}
                cursor="pointer"
                onClick={onCopy}
                fontSize="18px"
                transition="all .3s ease 0s"
              >
                {account} <CopyIcon mx={1} />{" "}
                <Link href={`${NODE[chainId].scanUrl}/address/${account}`} isExternal textDecoration="none !important">
                  <ExternalLinkIcon />
                </Link>
              </Box>
            </Center>
            <Flex justifyContent="center" alignItems="center" flexDirection="column" display="flex" w="100%" mb={6}>
              {/* <Button w="95%" colorScheme="gray" color="white">
                <Link href={`${NODE[chainId].scanUrl}/address/${account}`} isExternal textDecoration="none !important">
                  View on {NODE[chainId].scanName}
                </Link>
              </Button> */}
              <ExportSecret
                render={(onOpen) => (
                  <Button
                    w="95%"
                    bgColor="gray.500"
                    onClick={() => {
                      onOpen();
                      setNewAccountName(accountsName[accountKey]);
                    }}
                    mt={4}
                    fontSize="16px"
                    height="50px"
                    _focus={{ outline: "none" }}
                  >
                    Export Private Key
                  </Button>
                )}
                type="PK"
              />
              <DeleteAccountConfirmModal
                render={(onOpen) => (
                  <Button
                    w="95%"
                    onClick={onOpen}
                    mt={4}
                    _hover={{ color: "red.700", bgColor: "transparent" }}
                    _focus={{ outline: "none" }}
                    color="#FF6E40"
                    fontSize="16px"
                    bgColor="transparent"
                    py={3}
                    height="50px"
                  >
                    <DeleteIcon />
                    Delete Wallet
                  </Button>
                )}
                onCloseDetailModal={handleClose}
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AccountDetailModal;
