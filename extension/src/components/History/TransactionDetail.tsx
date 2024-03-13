import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Center, Flex, Link, SimpleGrid, Text } from "@chakra-ui/layout";
import { transparentize } from "@chakra-ui/theme-tools";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Transaction } from "src/config/types";
import moment from "moment";
import { TextDeep } from "src/theme";
import { TRANSACTION_TYPES } from "src/config/constants/constants";
import { ellipsis, getFullDisplayBalance } from "src/utils/formatBalance";
import { CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import InfoField from "../common/InfoField";
import { get } from "lodash";
import { formatNumber, toGwei } from "src/utils/helper";
import { NODE } from "src/config/constants/chain";
import { ReactComponent as FailedSVG } from "../../assets/images/icons/status-failed.svg";
import { ReactElement } from "react";

const TransactionDetail = ({
  render,
  transaction,
  textMain,
  action,
  icons,
}: {
  render: (onOpen: () => void) => JSX.Element;
  transaction: Transaction;
  textMain: string | ReactElement;
  action: string;
  icons: JSX.Element;
}) => {
  const { chainId } = useAppSelector(globalSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bg="gray.700">
          <ModalHeader>
            <Center>Transaction Detail</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="6" pb="4">
            <Box ml="4" flex="1">
              <Flex justify="space-between">
                <Flex alignItems="center">
                  <Box mr="4">{icons}</Box>
                  <Box fontSize="md">
                    <Box fontWeight="semibold">{action}</Box>
                    <TextDeep fontSize="sm">
                      {moment.unix(transaction.timestamp).format("MMM DD, YYYY hh:mm A")}
                    </TextDeep>
                  </Box>
                </Flex>
                {transaction.status !== "success" ? (
                  <Center bg={transparentize("red.400", 0.2) as any} px="3" h="22px" borderRadius="lg">
                    <FailedSVG width="12px" />
                    <Text ml="1" fontSize="xs" color="red.400">
                      Failed
                    </Text>
                  </Center>
                ) : (
                  <Center bg={transparentize("primary.400", 0.2) as any} px="3" h="22px" borderRadius="lg">
                    <CheckIcon color="primary.300" width="12px" />
                    <Text ml="1" fontSize="xs" color="primary.400">
                      Success
                    </Text>
                  </Center>
                )}
              </Flex>
              <Box mt="5" mb="6">
                {textMain}
              </Box>
            </Box>
            <SimpleGrid columns={2} spacing="4" mb="5">
              <Box bg="gray.800" borderRadius="16" p="4">
                <TextDeep>
                  {transaction.type === TRANSACTION_TYPES.TRANSFER || transaction.type === TRANSACTION_TYPES.RECEIVED
                    ? "From Wallet"
                    : "Wallet"}
                </TextDeep>
                <Flex
                  alignItems="center"
                  as={Link}
                  href={`${NODE[chainId].scanUrl}/address/${transaction.from}`}
                  target="_blank"
                >
                  {ellipsis(transaction.from)}
                  <ExternalLinkIcon ml="2" />
                </Flex>
              </Box>
              <Box bg="gray.800" borderRadius="16" p="4">
                <TextDeep>
                  {transaction.type === TRANSACTION_TYPES.TRANSFER || transaction.type === TRANSACTION_TYPES.RECEIVED
                    ? "To Wallet"
                    : "Application"}
                </TextDeep>
                <Flex
                  alignItems="center"
                  as={Link}
                  href={`${NODE[chainId].scanUrl}/address/${transaction.to}`}
                  target="_blank"
                >
                  {ellipsis(transaction.to)}
                  <ExternalLinkIcon ml="2" />
                </Flex>
              </Box>
            </SimpleGrid>
            <Box px="3">
              {transaction.type === TRANSACTION_TYPES.SWAP && (
                <InfoField
                  title={`Rate ${get(transaction, "extraData.sendToken.symbol", "(unknown)")}/${get(
                    transaction,
                    "extraData.receiveToken.symbol",
                    "(unknown)",
                  )}`}
                  content={
                    <Box>
                      {formatNumber(
                        +getFullDisplayBalance(
                          get(transaction, "extraData.receiveValue", 0),
                          get(transaction, "extraData.receiveToken.decimals", 18),
                        ) /
                          +getFullDisplayBalance(
                            get(transaction, "extraData.sendValue", 1),
                            get(transaction, "extraData.sendToken.decimals", 18),
                          ),
                        4,
                      )}
                    </Box>
                  }
                />
              )}
              <InfoField
                title="Gas Fee"
                content={
                  <Box>
                    {formatNumber(+toGwei(+transaction.gasPrice) * +toGwei(transaction.gasUsed))}{" "}
                    {NODE[chainId].currencySymbol}
                  </Box>
                }
              />
              <InfoField
                title="Tx Hash"
                content={
                  <Flex
                    alignItems="center"
                    as={Link}
                    href={`${NODE[chainId].scanUrl}/tx/${transaction.hash}`}
                    target="_blank"
                  >
                    {ellipsis(transaction.hash)}
                    <ExternalLinkIcon ml="2" />
                  </Flex>
                }
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransactionDetail;
