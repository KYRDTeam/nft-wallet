import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Avatar,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import { useAppSelector } from "src/hooks/useStore";
import { walletsSelector } from "src/store/wallets";
import { ellipsis } from "src/utils/formatBalance";

import { ContactCardIcon } from "../icons";

export default function InputRecipientAddress({
  onChange,
  errorMessage,
  value,
  ...props
}: {
  errorMessage?: string;
  value?: string;
  onChange: (value: string) => void;
  [restProp: string]: any;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { wallets } = useAppSelector(walletsSelector);

  const inputRef = useRef<any>();

  useEffect(() => {
    if (value !== inputRef.current.value) {
      inputRef.current.value = value;
    }
  }, [value]);

  const onBlur = useCallback(() => {
    if (value === inputRef.current.value) return;
    onChange(inputRef.current.value);
  }, [onChange, value]);

  return (
    <Box width="full">
      <InputGroup>
        <Input
          pr="3rem"
          placeholder="Recipient Address"
          height="12"
          fontSize="lg"
          errorBorderColor="red.300"
          borderWidth="1px"
          borderColor={errorMessage ? "red.300" : "transparent"}
          _focus={{ borderColor: errorMessage ? "red.300" : "primary.300" }}
          _active={{ borderColor: errorMessage ? "red.300" : "primary.300" }}
          autoComplete="off"
          ref={inputRef}
          {...props}
          onChange={(event) => {
            inputRef.current.value = event.target.value;
          }}
          onBlur={onBlur}
        />
        <InputRightElement width="3rem">
          <Button
            h="1.75rem"
            size="sm"
            borderRadius="5"
            p="0"
            bg="transparent"
            mt="2"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            onClick={onOpen}
          >
            <ContactCardIcon />
          </Button>
        </InputRightElement>
      </InputGroup>
      {errorMessage && (
        <Text ml="2" color="red.300" mt="1">
          {errorMessage}
        </Text>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent width="sm" borderRadius="16">
          <ModalCloseButton />
          <ModalHeader textAlign="center" py="4">
            Select Contact
          </ModalHeader>
          <ModalBody
            p="0"
            fontSize={{ base: "md", md: "lg" }}
            height="800px"
            overflowY="auto"
          >
            {isEmpty(wallets) && (
              <Text color="whiteAlpha.500" textAlign="center">
                No contact added!
              </Text>
            )}
            {wallets.length > 0 &&
              wallets.map((wallet: { name: string; address: string }) => (
                <Flex
                  key={wallet.address}
                  alignItems="center"
                  cursor="pointer"
                  _hover={{ bg: "gray.800" }}
                  px="4"
                  py="1"
                  onClick={() => {
                    onChange(wallet.address);
                    onClose();
                  }}
                  borderBottomWidth="1px"
                  borderBottomColor="whiteAlpha.100"
                >
                  <Avatar
                    name={wallet.name || "<unknown>"}
                    boxSize="10"
                    mr="2"
                  />
                  <Box>
                    <Text
                      color={wallet.name ? "whiteAlpha.900" : "whiteAlpha.500"}
                    >
                      {wallet.name || "<unknown>"}
                    </Text>
                    <Text color="whiteAlpha.500">
                      {ellipsis(wallet.address, 22, 5)}
                    </Text>
                  </Box>
                </Flex>
              ))}
          </ModalBody>
          <ModalFooter mb="2" />
        </ModalContent>
      </Modal>
    </Box>
  );
}
