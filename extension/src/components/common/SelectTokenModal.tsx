import { useDisclosure } from "@chakra-ui/hooks";
import { ChevronDownIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Center, Flex } from "@chakra-ui/layout";
import { Button, FormControl, Image, InputLeftElement, Spinner, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Token } from "../../config/types";
import TokenLogo from "./TokenLogo";
import TokenTag from "./TokenTag";
import useActiveTokens from "src/hooks/useActiveTokens";
import useSearchToken from "src/hooks/useSearchToken";
import { isAddress } from "web3-utils";
import { DefaultTokenIcon } from "./icons";
import ImportConfirm from "./AddCustomTokenModal/ImportConfirm";
import { isEmpty } from "lodash";
import ModalCommon from "../Modal";

const SelectTokenModal = ({
  selectedToken,
  setSelectedToken,
  disabledToken,
  tokensList,
}: {
  selectedToken?: Token;
  disabledToken?: Token;
  tokensList?: Token[];
  setSelectedToken?: (token: Token) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenConfirmation, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();

  const { activeTokens, deactiveTokens } = useActiveTokens({
    tokensList,
  });

  const [searchKey, setSearchKey] = useState("");

  const searchRef = useRef(null);

  const { token: customToken, loading, searchToken, clear } = useSearchToken();

  const prevKeywordRef = useRef("");
  //TODO: FIX ME why use prevSearchResult here?
  // const prevSearchResult = useRef<Token[]>(activeTokens);

  const filterTokens = useMemo(() => {
    // if (prevKeywordRef.current === searchKey) return prevSearchResult.current;

    prevKeywordRef.current = searchKey;

    let filteredTokens = activeTokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(searchKey.toLowerCase()) ||
        token.name.toLowerCase().includes(searchKey.toLowerCase()) ||
        token.address.toLowerCase().includes(searchKey.toLowerCase()),
    );

    if (isEmpty(filteredTokens)) {
      filteredTokens = deactiveTokens.filter(
        (token: Token) =>
          token.symbol.toLowerCase().includes(searchKey.toLowerCase()) ||
          token.name.toLowerCase().includes(searchKey.toLowerCase()) ||
          token.address.toLowerCase().includes(searchKey.toLowerCase()),
      );
    }

    // prevSearchResult.current = filteredTokens;
    return filteredTokens;
  }, [activeTokens, searchKey, deactiveTokens]);

  const handleClose = useCallback(() => {
    setSearchKey("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (filterTokens.length > 0) return;
    if (!isAddress(searchKey)) return;

    searchToken(searchKey);
  }, [filterTokens.length, searchKey, searchToken]);

  const singleTokenList = tokensList?.length === 1;

  return (
    <>
      <Center cursor="pointer" className="open-select-token-modal" onClick={singleTokenList ? undefined : onOpen}>
        <Box fontSize="lg" ml="2" maxW="4.5rem" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {selectedToken?.symbol || "Choose"}
        </Box>
        {!singleTokenList && <ChevronDownIcon mr="-10px" boxSize="4" />}
      </Center>
      <ModalCommon
        title="Select Token"
        onClose={handleClose}
        isOpen={isOpen}
        props={{
          scrollBehavior: "inside",
          initialFocusRef: { searchRef },
        }}
      >
        <>
          <FormControl px="7">
            <InputGroup size="md">
              <InputLeftElement
                pointerEvents="none"
                height="12"
                children={<SearchIcon color="gray.300" boxSize="5" />}
              />
              <Input
                placeholder="Search name, symbol or the address"
                height="12"
                className="search-token-on-select-modal"
                ref={searchRef}
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                fontSize="lg"
                errorBorderColor="red.300"
                bgColor="#222"
                autoFocus
              />
              {!!searchKey && (
                <InputRightElement width="2.5rem">
                  <Button
                    h="1.75rem"
                    p="1"
                    mt="1.5"
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                    borderRadius="4"
                    size="sm"
                    onClick={() => {
                      setSearchKey("");
                    }}
                  >
                    <CloseIcon color="gray.300" cursor="pointer" w="10px" />
                  </Button>
                </InputRightElement>
              )}
            </InputGroup>
          </FormControl>
          <Box height="500px" overflowY="auto" mt="4">
            {filterTokens.map((token: Token) => (
              <Flex
                py="2"
                px="7"
                alignItems="center"
                key={token.address}
                className={`token-${token.symbol}`}
                onClick={() => {
                  if (token.address !== disabledToken?.address) {
                    setSelectedToken && setSelectedToken(token);
                    handleClose();
                  }
                }}
                borderColor="transparent"
                fontSize="lg"
                overflow="hidden"
                opacity={token.address !== disabledToken?.address ? 1 : 0.5}
                _hover={
                  token.address !== disabledToken?.address
                    ? {
                        cursor: "pointer",
                        bgColor: "gray.800",
                      }
                    : undefined
                }
              >
                <TokenLogo src={token.logo} />
                <Box mx="3">
                  <Flex alignItems="center">
                    <Box mr="2">{token.symbol}</Box>
                    <TokenTag type={token.tag} />
                  </Flex>

                  <Text opacity="0.5" fontSize="xs" lineHeight="1">
                    {token.name}
                  </Text>
                </Box>
                <Box ml="auto">{token.formattedBalance}</Box>
              </Flex>
            ))}
            {loading && (
              <Box px="2" textAlign="center">
                <Spinner color="primary.300" />
              </Box>
            )}
            {!loading && customToken && !!searchKey && (
              <Flex justifyContent="space-between" mt="4" px="4">
                <Flex justifyContent="flex-start" alignItems="center">
                  <Box boxSize="6">
                    <Image
                      objectFit="cover"
                      fallback={<DefaultTokenIcon stroke="whiteAlpha.800" />}
                      src={customToken.logo}
                      alt={customToken.name}
                    />
                  </Box>
                  <Box ml="2">
                    <Text fontWeight="bold">{customToken.name}</Text>
                    <Box>
                      <Text display="inline-block" mr="2" fontSize="sm">
                        {customToken.symbol}
                      </Text>
                      <Text display="inline-block" fontSize="sm">
                        (Decimals: {customToken.decimals})
                      </Text>
                    </Box>
                  </Box>
                </Flex>

                <Button colorScheme="primary" onClick={onOpenConfirmation}>
                  Import
                </Button>
              </Flex>
            )}
            {isEmpty(filterTokens) && !loading && !customToken && (
              <Text textAlign="center" color="whiteAlpha.600" mt="6" fontStyle="italic">
                Sorry! No result found :(
              </Text>
            )}
          </Box>
          {customToken && (
            <ImportConfirm
              isOpen={isOpenConfirmation}
              onClose={onCloseConfirmation}
              onCloseParentModal={() => {
                clear();
              }}
              onCallbackSuccess={() => {
                setSelectedToken && setSelectedToken(customToken);
                onClose();
              }}
              token={customToken}
            />
          )}
          <Box height="4" />
        </>
      </ModalCommon>
    </>
  );
};

export default SelectTokenModal;
