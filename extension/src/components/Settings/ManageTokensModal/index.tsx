import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Flex,
} from "@chakra-ui/react";

import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { Token } from "src/config/types";
import { isEmpty } from "lodash";
import { TokenEmptyIllus } from "src/components/common/icons";
import { useMemo, useRef, useState } from "react";
import { TokenList } from "./TokenList";
import { AddCustomTokenModal } from "src/components/common/AddCustomTokenModal";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";

export const ManageTokensModal = ({ render }: { render: (onOpen: () => void) => JSX.Element }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tokens, customTokens } = useChainTokenSelector();

  const [keyword, setKeyword] = useState("");

  const initialRef = useRef<any>();

  const filteredTokens = useMemo(() => {
    // FIXME: move to custom hook to reuseable.
    const list = customTokens ? [...tokens, ...customTokens] : tokens;
    return list.filter((token: Token) =>
      keyword !== ""
        ? token.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
          token.symbol.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
          token.address.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        : true,
    );
  }, [customTokens, keyword, tokens]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="full" initialFocusRef={initialRef}>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent w="400px" maxWidth="100%" bg="black">
          <ModalHeader>Manage Tokens</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0">
            <Box px="6">
              <InputGroup mb="4">
                <Input
                  placeholder="Search Name or Symbol"
                  bg="gray.800"
                  size="lg"
                  fontSize="lg"
                  onChange={(event: any) => {
                    setTimeout(() => {
                      setKeyword(event.target.value);
                    });
                  }}
                  ref={initialRef}
                />
                <InputRightElement children={<SearchIcon color="whiteAlpha.900" boxSize="5" mt="2" />} />
              </InputGroup>
            </Box>
            <Box height="400px" px={4}>
              {!isEmpty(filteredTokens) && <TokenList tokens={filteredTokens} />}

              {isEmpty(filteredTokens) && (
                <Flex justifyContent="center" alignItems="center" direction="column" height="full">
                  <TokenEmptyIllus />
                  <Text mt="3" color="whiteAlpha.600" fontWeight="bold">
                    Your custom token list is empty.
                  </Text>
                </Flex>
              )}
            </Box>
          </ModalBody>
          <AddCustomTokenModal
            BtnWrapper={({ onClick }: { onClick: () => void }) => (
              <ModalFooter justifyContent="center" py={4} w="100%" fontSize="md">
                <Flex
                  onClick={onClick}
                  cursor="pointer"
                  _hover={{
                    color: "primary.300",
                    svg: { stroke: "primary.300" },
                    borderColor: "primary.300",
                  }}
                  alignItems="center"
                  w="100%"
                  border="1px solid #A9AEAD"
                  borderRadius="16px"
                  fontSize="16px"
                  justifyContent="center"
                  py={2}
                  color="#A9AEAD"
                >
                  <AddIcon mr="2" w="10px" h="10px" color="#A9AEAD" />
                  Add Token
                </Flex>
              </ModalFooter>
            )}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
