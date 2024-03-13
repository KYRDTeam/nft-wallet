import { useDisclosure } from "@chakra-ui/hooks";
import { transparentize } from "@chakra-ui/theme-tools";
import { Box, Center, Flex, Link, SimpleGrid, Text } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { ellipsis } from "src/utils/formatBalance";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import InfoField from "../common/InfoField";
import { NODE } from "src/config/constants/chain";
import { TextDeep } from "src/theme";
import { Spinner } from "@chakra-ui/spinner";

import GroupButtonAction from "./GroupButtonAction";

const TransactionDetailPending = ({
  render,
  transaction,
}: {
  render: (onOpen: () => void) => JSX.Element;
  transaction: any;
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
              <Flex justify="flex-end" my="4">
                <Center bg={transparentize("primary.400", 0.2) as any} px="3" h="22px" borderRadius="lg">
                  <Spinner size="xs" color="yellow.400" speed="0.8s" />
                  <Text ml="1" fontSize="xs" color="yellow.400">
                    Pending
                  </Text>
                </Center>
              </Flex>
            </Box>
            <SimpleGrid columns={2} spacing="4" mb="5">
              <Box bg="gray.800" borderRadius="16" p="4">
                <TextDeep>From</TextDeep>
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
                <TextDeep>To</TextDeep>
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
            <Box px="3" my="6">
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
              <InfoField title="Gas Limit" content={<Text alignItems="center">{transaction.gasLimit}</Text>} />
              <InfoField title="Gas Price" content={<Text alignItems="center">{transaction.gasPrice}</Text>} />
              <InfoField title="Priority Fee" content={<Text alignItems="center">{transaction.priorityFee}</Text>} />
              <InfoField title="Nonce" content={<Text alignItems="center">{transaction.nonce}</Text>} />
            </Box>
            <Box mt="5">
              <GroupButtonAction data={transaction} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransactionDetailPending;
