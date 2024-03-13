import { DownloadIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
  useToast,
  Link,
  Divider,
} from "@chakra-ui/react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
} from "@chakra-ui/modal";
import { ellipsis } from "src/utils/formatBalance";
import { TooltipCommon } from "../common/TooltipCommon";
import { isAddress } from "web3-utils";
import useActiveTokens from "src/hooks/useActiveTokens";
import { Token } from "src/config/types";
import TokenLogo from "../common/TokenLogo";
import { isEqual } from "lodash";

type MultiSendImportCSVRow = {
  address: string;
  token: Token | { symbol: any; address: any; logo: string };
  amount: string;
};

export const UploadCSV = ({
  setFieldValue,
  currentRecipients,
}: {
  setFieldValue: any;
  currentRecipients: any[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const uploadCSVRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [CSVRecipients, setCSVRecipients] = useState<MultiSendImportCSVRow[]>(
    []
  );

  const { activeTokens } = useActiveTokens({});

  const processCSV = useCallback(
    (str: any) => {
      const headers = str
        .slice(0, str.indexOf("\n"))
        .trim()
        .split(",")
        .slice(0, 3);

      if (!isEqual(["wallet", "tokenContract", "amount"], headers)) {
        toast({
          title: "Error",
          description: "Please recheck your .csv file format.",
          status: "error",
          duration: 9000,
          isClosable: true,
          variant: "subtle",
          position: "top",
        });
        return;
      }

      const rows = str.slice(str.indexOf("\n") + 1).split("\n");

      let csvRows = rows.map((row: any) => {
        const values = row.split(",");
        const recipientRaw = headers.reduce(
          (recipient: any, header: any, index: number) => {
            recipient[header] = values[index] || "";
            return recipient;
          },
          {}
        );
        return recipientRaw;
      });
      let prevToken: any = undefined;

      csvRows = csvRows.map(
        ({
          tokenContract,
          wallet,
          ...restProps
        }: {
          tokenContract: string;
          wallet: string;
        }) => {
          let existedToken;
          if (prevToken && prevToken?.address === tokenContract.toLowerCase()) {
            return { ...restProps, address: wallet, token: prevToken };
          }
          existedToken = activeTokens.find(
            (activeToken: Token) =>
              activeToken.address === tokenContract.toLowerCase()
          );
          if (existedToken) {
            prevToken = existedToken;
            return { ...restProps, address: wallet, token: prevToken };
          }
          return {
            ...restProps,
            address: wallet,
            token: { symbol: "", address: tokenContract.toLowerCase() },
          };
        }
      );

      setCSVRecipients(csvRows);
      onOpen();
    },
    [activeTokens, onOpen, toast]
  );

  const handleReadFile = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const csvFile = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (eventLoad) => {
        const targetFile = eventLoad.target && eventLoad.target.result;
        processCSV(targetFile);
      };
      reader.readAsBinaryString(csvFile);
    },
    [processCSV]
  );

  const validRecipients = useMemo(() => {
    return CSVRecipients.filter(
      (recipients: MultiSendImportCSVRow, index: number) =>
        recipients.token.symbol &&
        +recipients.amount > 0 &&
        isAddress(recipients.address)
    );
  }, [CSVRecipients]);

  const handleOverride = useCallback(() => {
    setFieldValue("recipients", validRecipients);
    onClose();
  }, [onClose, setFieldValue, validRecipients]);

  const handleMerge = useCallback(() => {
    setFieldValue("recipients", [...currentRecipients, ...validRecipients]);
    onClose();
  }, [onClose, setFieldValue, validRecipients, currentRecipients]);

  return (
    <>
      <Button
        color="primary.300"
        bg="transparent"
        mr="2"
        px="2"
        onClick={() => {
          uploadCSVRef.current && uploadCSVRef.current?.click();
        }}
      >
        Upload CSV file
      </Button>
      <input
        hidden
        ref={uploadCSVRef}
        type="file"
        accept=".csv"
        onChange={handleReadFile}
        onClick={(event) => {
          // @ts-ignore
          event.target.value = null;
        }}
      />
      <Button
        as={Link}
        leftIcon={<DownloadIcon />}
        bg="transparent"
        color="whiteAlpha.500"
        px="2"
        href="/Krystal_MultiSend_Template.csv"
        download
        _hover={{ color: "primary.300" }}
      >
        Download csv template
      </Button>
      <Modal size="4xl" isCentered onClose={onClose} isOpen={isOpen}>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="12px" backgroundColor="gray.700">
          <ModalHeader textAlign="center" py="4">
            Import multi-send confirmation
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="0">
            <Box
              maxHeight="calc(100vh - 200px)"
              minHeight="500px"
              w="full"
              overflowY="auto"
            >
              <Table variant="simple">
                <Thead pos="sticky" top="0" zIndex="1" bg="gray.700">
                  <Tr>
                    <Th borderColor="whiteAlpha.200">No.</Th>
                    <Th borderColor="whiteAlpha.200">Wallet</Th>
                    <Th borderColor="whiteAlpha.200">Token</Th>
                    <Th borderColor="whiteAlpha.200" isNumeric>
                      Amount
                    </Th>
                  </Tr>
                </Thead>
                <Tbody borderColor="white">
                  {CSVRecipients.map((recipient, index) => {
                    const isValidAddress = isAddress(recipient.address);
                    const isValidToken = !!recipient.token.symbol;

                    return (
                      <Tr key={index}>
                        <Td borderColor="whiteAlpha.200">{index + 1}.</Td>
                        <Td
                          borderColor="whiteAlpha.200"
                          color={isValidAddress ? "whiteAlpha.800" : "red.300"}
                        >
                          {recipient.address}{" "}
                          {!isValidAddress && (
                            <TooltipCommon label="Address is invalid">
                              <WarningIcon />
                            </TooltipCommon>
                          )}
                        </Td>
                        <Td
                          borderColor="whiteAlpha.200"
                          color={isValidToken ? "whiteAlpha.800" : "red.300"}
                        >
                          {isValidToken && (
                            <Flex alignItems="center">
                              <TokenLogo mr="2" src={recipient.token.logo} />
                              <Text>{recipient.token.symbol}</Text>
                            </Flex>
                          )}
                          {!isValidToken &&
                            ellipsis(recipient.token.address, 8, 8)}
                        </Td>
                        <Td borderColor="whiteAlpha.200" isNumeric>
                          {recipient.amount}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Flex
              justifyContent="space-between"
              width="full"
              alignItems="center"
            >
              <Flex>
                {CSVRecipients.length} recipients (
                <Text color="primary.300">{validRecipients.length} valid</Text>,
                <Text color="red.300" ml="1">
                  {CSVRecipients.length - validRecipients.length} invalid
                </Text>
                )
              </Flex>
              <Box>
                <Button
                  colorScheme="primary"
                  mr={3}
                  disabled={!validRecipients.length}
                  onClick={handleOverride}
                >
                  Override
                </Button>
                <Button
                  colorScheme="primary"
                  disabled={!validRecipients.length}
                  onClick={handleMerge}
                >
                  Merge
                </Button>
              </Box>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
