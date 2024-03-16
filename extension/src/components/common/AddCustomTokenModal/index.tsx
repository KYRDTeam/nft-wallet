import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DefaultTokenIcon, TokenNotFoundIcon } from "../icons";
import _debounce from "lodash/debounce";
import { fetchTokenOverview } from "src/utils/krystalService";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { Token } from "src/config/types";
import ImportConfirm from "./ImportConfirm";
import { fetchTokenSymbolAndDecimal } from "src/utils/web3";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";
import TokenTag from "../TokenTag";

export const AddCustomTokenModal = ({
  BtnWrapper,
}: {
  BtnWrapper: React.ComponentType<{ onClick: () => void }>;
}) => {
  const valueRef = useRef("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onClose: onCloseConfirmation,
  } = useDisclosure();

  const { tokens, customTokens } = useChainTokenSelector();
  const { chainId } = useAppSelector(globalSelector);

  const [keyword, setKeyword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<Token | undefined>();

  const handleChange = useCallback((event) => {
    const value = event.target.value;
    setToken(undefined);
    setKeyword(value);
    setLoading(true);
    valueRef.current = value;
  }, []);

  const allTokens = useMemo(() => {
    return customTokens ? [...tokens, ...customTokens] : tokens;
  }, [customTokens, tokens]);

  const initialRef = useRef<any>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    _debounce(() => {
      setTimeout(async () => {
        if (!loading) {
          setLoading(false);
          return;
        }

        setError("");
        try {
          const address = valueRef.current.toLowerCase();

          const tokenExisted = allTokens.find(
            (token: Token) => token.address.toLowerCase() === address
          );

          if (tokenExisted) {
            setToken(tokenExisted);
            setError("This token has already been added");
            setLoading(false);
            return;
          }

          const response = await fetchTokenOverview(chainId, [address]);

          if (response && response.length) {
            setToken(response[0]);
            setLoading(false);
            return;
          }

          // get data from node.
          const token: Token | null = await fetchTokenSymbolAndDecimal(
            address,
            chainId
          );

          if (token) {
            setToken(token);
            setLoading(false);
            return;
          }
        } catch (e) {
          setToken(undefined);
        }
        setLoading(false);
      });
    }, 500),
    [loading, allTokens, chainId]
  );

  const onCloseModal = useCallback(() => {
    setToken(undefined);
    setKeyword("");
    valueRef.current = "";
    onClose();
  }, [onClose]);

  return (
    <>
      <BtnWrapper onClick={onOpen} />

      <Modal
        isOpen={isOpen}
        onClose={onCloseModal}
        isCentered
        size="full"
        initialFocusRef={initialRef}
      >
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent w="400px" maxWidth="100%" bg="#0F1010">
          <ModalHeader>Add Custom Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody px="6">
            <FormControl>
              <InputGroup size="md">
                <InputLeftElement
                  pointerEvents="none"
                  height="12"
                  children={<SearchIcon color="gray.300" boxSize="5" />}
                />
                <Input
                  placeholder="Token Contract Address"
                  height="12"
                  value={keyword}
                  fontSize="lg"
                  errorBorderColor="red.300"
                  onChange={handleChange}
                  bg="gray.800"
                  ref={initialRef}
                />
                {!!keyword && (
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
                        setKeyword("");
                      }}
                    >
                      <CloseIcon color="gray.300" cursor="pointer" />
                    </Button>
                  </InputRightElement>
                )}
              </InputGroup>
            </FormControl>
            <Box height="200px" mt="2">
              {!loading && !!keyword && error && (
                <Text color="primary.300">{error}</Text>
              )}
              {!loading && !!keyword && token && (
                <Flex justifyContent="space-between" mt="4">
                  <Flex justifyContent="flex-start" alignItems="center">
                    <Box boxSize="6">
                      <Image
                        objectFit="cover"
                        fallback={<DefaultTokenIcon stroke="whiteAlpha.800" />}
                        src={token.logo}
                        alt={token.name}
                      />
                    </Box>
                    <Box ml="2">
                      <Flex>
                        <Text fontWeight="bold">{token.name}</Text>
                        <TokenTag type={token.tag} />
                      </Flex>
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
                  {!error && (
                    <Button colorScheme="primary" onClick={onOpenConfirmation}>
                      Import
                    </Button>
                  )}
                </Flex>
              )}
              {!loading && !!keyword && !token && (
                <Flex
                  w="full"
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <TokenNotFoundIcon boxSize="40" ml="6" />
                  <Text mt="3" color="whiteAlpha.600">
                    Token not found!
                  </Text>
                </Flex>
              )}
            </Box>
          </ModalBody>

          <ModalFooter height="20" />
        </ModalContent>
      </Modal>
      {token && (
        <ImportConfirm
          isOpen={isOpenConfirmation}
          onClose={onCloseConfirmation}
          onCloseParentModal={onCloseModal}
          token={token}
        />
      )}
    </>
  );
};
