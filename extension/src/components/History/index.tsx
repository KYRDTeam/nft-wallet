import { Box, Center, Flex, Heading } from "@chakra-ui/layout";
import useFetchTransactions from "src/hooks/useFetchTransactions";
import { ReactComponent as FilterIconSvg } from "src/assets/images/icons/filter.svg";
import { ReactComponent as NoHistorySvg } from "src/assets/images/icons/no-history.svg";
import TransactionFilter from "./TransactionFilter";
import { Button } from "@chakra-ui/button";
import { useAppSelector } from "../../hooks/useStore";
import { clearHashListByAccount, hashSelector } from "../../store/hash";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from "@chakra-ui/react";
import TransactionItemPending from "./TransactionItemPending";
import { useMemo } from "react";
import { useWallet } from "../../hooks/useWallet";
import { DeleteIcon } from "@chakra-ui/icons";
import ModalConfirm from "../common/ModalConfirm";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import TransactionCompleted from "./TransactionCompleted";
import HeaderPage from "../HeaderPage";
import { globalSelector } from "src/store/global";

const History = () => {
  const { loading, filter, onFilter, transactions } = useFetchTransactions();
  const { hashList } = useAppSelector(hashSelector);
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const filterHashList = useMemo(() => {
    const dataFilter = hashList.filter((e: any) => e.account === account && e.chainId === chainId);
    return dataFilter;
  }, [account, hashList, chainId]);

  const heightTable = "calc(100vh - 250px)";

  const EmptyData = (
    <Box height={heightTable} display="flex" justifyContent="center" alignItems="center" overflowY="auto">
      <Center bg="gray.700" flexDir="column">
        <NoHistorySvg />
        <Box opacity="0.5" my="10">
          No Transactions yet!
        </Box>
      </Center>
    </Box>
  );

  return (
    <Flex my="4" px="5" justify="center">
      <Box w="640px" maxW="100%">
        <HeaderPage title="History">
          <TransactionFilter
            filter={filter}
            onFilter={onFilter}
            render={(onOpen) => (
              <Button
                pos="absolute"
                top="5px"
                right="0"
                px="0"
                borderRadius="8"
                bg="transparent"
                fontSize="sm"
                h="fit-content"
                _hover={{
                  bg: "transparent",
                  color: "primary.300",
                  svg: { stroke: "primary.300" },
                }}
                leftIcon={<FilterIconSvg stroke="#fff" />}
                onClick={onOpen}
              >
                Filter
              </Button>
            )}
          />
        </HeaderPage>

        <Tabs pt="0">
          <TabList>
            <Tab _selected={{ borderColor: "#1DE9B6" }}>Completed</Tab>
            <Tab _selected={{ borderColor: "#1DE9B6" }}>Pending</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px="0">
              <TransactionCompleted
                transactions={transactions}
                loading={loading}
                heightTable={heightTable}
                propsStyle={{ bg: "gray.700", borderRadius: "12", py: "6" }}
              />
            </TabPanel>
            <TabPanel px="0">
              <Box bg="gray.700" borderRadius="12" py="6" pos="relative">
                {!!filterHashList.length && (
                  <Button p="10px" h="unset" pos="absolute" top="6px" right="8px" onClick={onOpen}>
                    <DeleteIcon />
                  </Button>
                )}
                <Box height={heightTable} overflowY="auto">
                  {!!filterHashList.length &&
                    filterHashList.map((transaction: any, index: number) => {
                      return (
                        <Box key={transaction.hash}>
                          <TransactionItemPending data={transaction} isOdd={index % 2 === 1} />
                        </Box>
                      );
                    })}

                  {filterHashList.length === 0 && EmptyData}
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <ModalConfirm
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          dispatch(clearHashListByAccount(account));
        }}
      >
        <>
          <Heading as="h4" my="4" size="md">
            Do you want to clear all pending transactions?
          </Heading>
          <Text>
            This will not change the balances in your accounts or require you to re-enter your Secret Recovery Phrase.
          </Text>
        </>
      </ModalConfirm>
    </Flex>
  );
};

export default History;
