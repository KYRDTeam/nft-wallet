import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  Image,
  Box,
  Text,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { Token } from "src/config/types";
import { DefaultTokenIcon } from "../icons";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { useDispatch } from "react-redux";
import { addCustomTokens } from "src/store/tokens";
import useCustomToast from "src/hooks/useCustomToast";

export default function ImportConfirm({
  isOpen,
  token,
  onClose,
  onCloseParentModal,
  onCallbackSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCloseParentModal: () => void;
  onCallbackSuccess?: () => void;
  token: Token;
}) {
  const dispatch = useDispatch();

  const [confirmed, setConfirm] = useState<boolean>(false);
  const { chainId } = useAppSelector(globalSelector);

  const toast = useCustomToast();

  const importCustomTokens = useCallback(() => {
    dispatch(
      addCustomTokens({
        chainId,
        tokens: [token],
        callbackSuccess: () => {
          toast({
            status: "success",
            title: `${token.symbol} has been added successfully!`,
          });
          onCallbackSuccess && onCallbackSuccess();
        },
      })
    );
    onClose();
    onCloseParentModal();
  }, [
    chainId,
    dispatch,
    onCallbackSuccess,
    onClose,
    onCloseParentModal,
    toast,
    token,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(3px) !important;" />
      <ModalContent w="400px" maxWidth="100%" bg="#0F1010">
        <ModalHeader textAlign="center">Import a token</ModalHeader>
        <ModalCloseButton />
        <ModalBody px="8">
          {token && (
            <Flex justifyContent="space-between">
              <Flex justifyContent="flex-start" alignItems="center">
                <Image
                  objectFit="cover"
                  fallback={<DefaultTokenIcon stroke="whiteAlpha.800" />}
                  src={token.logo}
                  alt={token.name}
                />
                <Box ml="2">
                  <Text fontWeight="bold">{token.name}</Text>
                  <Box>
                    <Text display="inline-block" mr="2" fontSize="sm">
                      {token.symbol}
                    </Text>
                    <Text display="inline-block" fontSize="sm">
                      (Decimals: {token.decimals})
                    </Text>
                  </Box>
                </Box>
              </Flex>
            </Flex>
          )}
          <Divider my="2" />
          {token && <Text>{token?.address}</Text>}
          <Alert status="error" mt="2" borderRadius="12">
            <AlertIcon />
            <AlertDescription>
              Anyone can create a token, including creating fake versions of
              existing tokens that claim to represent projects.
              <br /> If you purchase this token, you may not be able to sell it
              back
            </AlertDescription>
          </Alert>
          <Checkbox
            colorScheme="primary"
            mt="4"
            isChecked={confirmed}
            onChange={(event) => {
              setConfirm(event.target.checked);
            }}
          >
            I understand
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="primary"
            flex="1"
            disabled={!confirmed}
            onClick={importCustomTokens}
          >
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
