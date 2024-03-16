import { Button } from "@chakra-ui/button";
import { useClipboard, useDisclosure } from "@chakra-ui/hooks";
import { ArrowBackIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Center, Text, Flex } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { CopyIcon } from "@chakra-ui/icons";
import { useEffect, useState, useCallback, useRef } from "react";
import useCustomToast from "src/hooks/useCustomToast";
import { useWallet } from "src/hooks/useWallet";
import { FormControl, Input, InputGroup } from "@chakra-ui/react";
import QRCode from "qrcode.react";

interface ExportSecretProps {
  render: (onOpen: () => void) => JSX.Element;
  type: "SRP" | "PK";
}

const ExportSecret = ({ render, type }: ExportSecretProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { keyringController } = useWallet();
  const [insertPassword, setInsertPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { hasCopied, onCopy } = useClipboard(secret || "");
  const toast = useCustomToast();

  const initialRef = useRef<any>();

  const handleSubmitPassword = () => {
    if (type === "PK") {
      keyringController
        .submitPassword(insertPassword)
        .then((res: any) => {
          return keyringController.exportAccount(res.keyrings[0].accounts[0]);
        })
        .then((res: string) => {
          setSecret(res);
          setErrorMessage("");
        })
        .catch((error: any) => {
          setErrorMessage(error.message);
        });
    } else {
      keyringController
        .submitPassword(insertPassword)
        .then(() => {
          setSecret(keyringController.keyrings[0].mnemonic);
          setErrorMessage("");
        })
        .catch((error: any) => {
          setErrorMessage(error.message);
        });
    }
  };
  const handleCloseModal = useCallback(() => {
    setSecret("");
    setErrorMessage("");
    setInsertPassword("");
    onClose();
  }, [onClose, setErrorMessage, setInsertPassword]);
  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      handleSubmitPassword();
    }
  };
  useEffect(() => {
    if (hasCopied) {
      toast({
        status: "success",
        title: "Copied!",
      });
    }
  }, [hasCopied, toast]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size="full" initialFocusRef={initialRef}>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bg="#0F1010">
          <Text
            color="gray.100"
            onClick={handleCloseModal}
            cursor="pointer"
            mt={3}
            ml={6}
            fontSize="lg"
            w="fit-content"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <ArrowBackIcon mr={2} w={4} h={4} />
            Back
          </Text>
          <ModalHeader textAlign="center" pt={secret ? 2 : 4} fontSize="xl">
            {type === "PK" ? "Export Private Key" : "Reveal Secret Recovery Phrase"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="10">
            <Box mt={secret ? 0 : 2}>
              <Flex
                fontSize="sm"
                bgColor="#F4553233"
                borderRadius="16px"
                justifyContent="space-around"
                alignItems="flex-start"
                p={6}
              >
                <WarningTwoIcon color="#FF6E40" w="20px" h="20px" mt={1.5} mr={4} />
                <Text>
                  {type === "PK"
                    ? "Warning: NEVER share Keystore/Private Key/Mnemonic with anyone (including Krystal Wallet). These data grant access to all your funds and they may get stolen."
                    : "DO NOT share this phrase with anyone! These words can be used to steal all your accounts."}
                </Text>
              </Flex>
              {!secret && (
                <>
                  <Text my={2} fontSize="md">
                    Enter password to continue
                  </Text>
                  <FormControl my={3}>
                    <InputGroup size="md">
                      <Input
                        placeholder="Enter password"
                        height="12"
                        value={insertPassword}
                        errorBorderColor="red.300"
                        onChange={(e: any) => setInsertPassword(e.target.value)}
                        type={secret ? "text" : "password"}
                        onKeyPress={(e: any) => handleEnter(e)}
                        fontSize="25px"
                        letterSpacing={1}
                        bg="gray.700"
                        color="#F3F8F7"
                        _placeholder={{
                          fontSize: "md",
                          letterSpacing: "unset",
                        }}
                        ref={initialRef}
                      />
                    </InputGroup>
                  </FormControl>
                  {errorMessage && (
                    <Text color="red.500" fontSize="sm">
                      {errorMessage}
                    </Text>
                  )}
                </>
              )}
              {!!secret && (
                <>
                  <Text my={2} fontSize="md">
                    {type === "PK" ? "Your private key" : "Your Secret Recovery Phrase"}
                  </Text>
                  <Center flexDir="column" textAlign="center" w="100%">
                    <Box as={QRCode} value={secret || ""} p="3" bg="white" borderRadius="xl" my={2} />
                    <Box
                      bg="gray.600"
                      py={2}
                      px={3}
                      borderRadius={16}
                      _hover={{ bg: "gray.500" }}
                      cursor="pointer"
                      onClick={onCopy}
                      m={2}
                      w="100%"
                    >
                      {secret} <CopyIcon />
                    </Box>
                  </Center>
                </>
              )}
            </Box>
          </ModalBody>
          {!secret && (
            <ModalFooter justifyContent="space-around" alignItems="center" display="flex" mb={4}>
              <Button colorScheme="gray" onClick={handleCloseModal} color="white" minW="150px">
                Cancel
              </Button>
              <Button colorScheme="primary" onClick={handleSubmitPassword} minW="150px">
                Next
              </Button>
            </ModalFooter>
          )}
          {!!secret && (
            <ModalFooter justifyContent="space-around" alignItems="center" display="flex" mx={4} pt={2} mb={4}>
              <Button colorScheme="primary" onClick={handleCloseModal} w="100%">
                Done
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExportSecret;
