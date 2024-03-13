import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement, InputLeftElement } from "@chakra-ui/input";
import { Box, Flex } from "@chakra-ui/layout";
import { SimpleGrid } from "@chakra-ui/react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { uniq } from "lodash";
import { useMemo, useRef, useState } from "react";
import { TRANSACTION_TYPES } from "src/config/constants/constants";
import { Token } from "src/config/types";
import { defaultFilter } from "src/hooks/useFetchTransactions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";
interface HistoryFilterProps {
  filter: any;
  onFilter: any;
  render: (onOpen: () => void) => JSX.Element;
}

const TransactionFilter = ({ filter, onFilter, render }: HistoryFilterProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tokens } = useChainTokenSelector();
  const [keyword, setKeyword] = useState("");

  const initialRef = useRef<any>();

  const tokensFilterd = useMemo(() => {
    return uniq(
      tokens.filter((token) => token.symbol.toLowerCase().includes(keyword.toLowerCase())).map((token) => token.symbol),
    );
  }, [tokens, keyword]);

  return (
    <>
      {render(onOpen)}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        size="full"
        initialFocusRef={initialRef}
      >
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bg="gray.900">
          <ModalHeader p="7">Transaction Filter</ModalHeader>
          <ModalCloseButton top="26px" right="15px" />
          <ModalBody px="7" pb="8">
            <Flex alignItems="center">
              <Box mr="auto">From:</Box>
              <Box>
                <InputGroup>
                  <DatePicker
                    selected={filter.from}
                    onChange={(date) => onFilter({ from: new Date(date as any) })}
                    maxDate={filter.to}
                    customInput={
                      <Input
                        w="200px"
                        placeholderText="mm/dd/yyyy"
                        _placeholder={{ fontSize: "16px" }}
                        bgColor="#222"
                        h="42px"
                        as={DatePicker}
                      />
                    }
                  />

                  {filter.from && (
                    <InputRightElement
                      onClick={() => onFilter({ from: "" })}
                      cursor="pointer"
                      zIndex="0"
                      mt="1"
                      children={<CloseIcon boxSize="3" opacity="0.6" />}
                    />
                  )}
                </InputGroup>
              </Box>
            </Flex>
            <Flex alignItems="center" mt="4">
              <Box mr="auto">To:</Box>
              <Box>
                <InputGroup>
                  <DatePicker
                    selected={filter.to}
                    onChange={(date) => onFilter({ to: new Date(date as any) })}
                    minDate={filter.from}
                    customInput={
                      <Input
                        w="200px"
                        h="42px"
                        placeholderText="mm/dd/yyyy"
                        _placeholder={{ fontSize: "16px" }}
                        bgColor="#222"
                        as={DatePicker}
                      />
                    }
                  />

                  {filter.to && (
                    <InputRightElement
                      onClick={() => onFilter({ to: "" })}
                      cursor="pointer"
                      zIndex="0"
                      mt="1"
                      children={<CloseIcon boxSize="3" opacity="0.6" />}
                    />
                  )}
                </InputGroup>
              </Box>
            </Flex>

            <Flex justify="space-between" alignItems="center" mt="10">
              <Box>Transaction Type</Box>
              <Flex opacity="0.75">
                <Button
                  variant="outline"
                  size="xs"
                  borderRadius="lg"
                  onClick={() => {
                    onFilter({
                      types: [
                        TRANSACTION_TYPES.APPROVAL,
                        TRANSACTION_TYPES.RECEIVED,
                        TRANSACTION_TYPES.SWAP,
                        TRANSACTION_TYPES.TRANSFER,
                        // TRANSACTION_TYPES.SUPPLY,
                        // TRANSACTION_TYPES.WITHDRAW,
                      ],
                    });
                  }}
                >
                  Select All
                </Button>
                <Box mx="1">/</Box>
                <Button
                  variant="outline"
                  size="xs"
                  borderRadius="lg"
                  onClick={() => {
                    onFilter({
                      types: [],
                    });
                  }}
                >
                  Clear All
                </Button>
              </Flex>
            </Flex>

            <SimpleGrid columns={4} spacing={4} mt="6">
              {[
                TRANSACTION_TYPES.APPROVAL,
                TRANSACTION_TYPES.RECEIVED,
                TRANSACTION_TYPES.SWAP,
                TRANSACTION_TYPES.TRANSFER,
                // TRANSACTION_TYPES.SUPPLY,
                // TRANSACTION_TYPES.WITHDRAW,
              ].map((type: string, index: number) => {
                const isActived = filter.types.includes(type);

                return (
                  <Button
                    h="32px"
                    px="8"
                    borderRadius="lg"
                    bg={isActived ? "#256857" : "#4b4f4e"}
                    key={index}
                    _hover={{ opacity: 0.7 }}
                    width="100%"
                    onClick={() => {
                      if (isActived) {
                        onFilter({
                          types: filter.types.filter((selectedType: string) => type !== selectedType),
                        });
                        return;
                      }

                      onFilter({
                        types: uniq([...filter.types, type]),
                      });
                    }}
                  >
                    {type}
                  </Button>
                );
              })}
            </SimpleGrid>

            <Flex justify="space-between" alignItems="center" mt="10">
              <Box>Select tokens</Box>
              <Flex opacity="0.75">
                <Button
                  variant="outline"
                  size="xs"
                  borderRadius="lg"
                  onClick={() => {
                    onFilter({
                      displayedTokens: tokens.map((token: Token) => token.symbol),
                    });
                  }}
                >
                  Select All
                </Button>
                <Box mx="1">/</Box>
                <Button
                  variant="outline"
                  size="xs"
                  borderRadius="lg"
                  onClick={() => {
                    onFilter({
                      displayedTokens: [],
                    });
                  }}
                >
                  Clear All
                </Button>
              </Flex>
            </Flex>

            <InputGroup mt="5">
              <InputLeftElement>
                <SearchIcon boxSize="4" />
              </InputLeftElement>
              <Input
                value={keyword}
                bgColor="#222"
                h="42px"
                _placeholder={{ fontSize: "16px" }}
                onChange={(e: any) => setKeyword(e.target.value)}
                placeholder="Search name, symbol or the address"
                ref={initialRef}
              />
              {keyword && (
                <InputRightElement>
                  <Button
                    p="1"
                    bg="transparent"
                    onClick={() => setKeyword("")}
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                  >
                    <CloseIcon boxSize="3" />
                  </Button>
                </InputRightElement>
              )}
            </InputGroup>

            <Flex flexWrap="wrap" px="2" mt="5" h="200px" overflowY="auto">
              {tokensFilterd.map((token, index) => {
                const isActived = !!filter.displayedTokens.includes(token);
                return (
                  <Button
                    key={index}
                    borderRadius="lg"
                    bg={isActived ? "#256857" : "#4b4f4e"}
                    _hover={{ opacity: 0.7 }}
                    height="8"
                    px="2"
                    mb="3"
                    mr="3"
                    onClick={() => {
                      if (isActived) {
                        onFilter({
                          displayedTokens: filter.displayedTokens.filter((symbol: string) => symbol !== token),
                        });
                        return;
                      }
                      onFilter({
                        displayedTokens: uniq([...filter.displayedTokens, token]),
                      });
                    }}
                  >
                    {token ? token : "UNKNOWN"}
                  </Button>
                );
              })}
            </Flex>

            <Button
              mt="10"
              w="100%"
              fontSize="15px"
              fontWeight="700"
              variant="outline"
              h="42px"
              onClick={() => {
                onFilter({ ...defaultFilter, status: filter.status });
              }}
            >
              Reset
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransactionFilter;
