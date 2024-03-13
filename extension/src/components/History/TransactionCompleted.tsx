import moment from "moment";
import TransactionItem from "./TransactionItem";
import { Box, Center } from "@chakra-ui/react";
import { Transaction } from "src/config/types";
import { ReactComponent as NoHistorySvg } from "src/assets/images/icons/no-history.svg";
import LoadingPage from "../LoadingPage";

const TransactionCompleted = ({
  transactions,
  loading,
  heightTable = "100%",
  propsStyle,
}: {
  transactions: Transaction[];
  loading: boolean;
  heightTable?: string;
  propsStyle?: any;
}) => {
  const EmptyData = (
    <Box height={heightTable} display="flex" justifyContent="center" alignItems="center" overflowY="auto">
      <Center flexDir="column">
        <NoHistorySvg />
        <Box opacity="0.5" my="10">
          No Transactions yet!
        </Box>
      </Center>
    </Box>
  );

  return (
    <Box {...propsStyle}>
      {!loading && !!transactions.length && (
        <Box height={heightTable} overflowY="auto">
          {transactions.map((transaction: Transaction, index: number) => {
            const date = moment.unix(transaction.timestamp).format("ll");
            const previousTransactionDate = index >= 1 && moment.unix(transactions[index - 1].timestamp).format("ll");
            return (
              <Box key={transaction.hash}>
                {previousTransactionDate !== date && (
                  <Box bg="gray.600" px="5" py="2" fontWeight="semibold">
                    {date}
                  </Box>
                )}
                <TransactionItem transaction={transaction} isOdd={index % 2 === 1} />
              </Box>
            );
          })}
        </Box>
      )}
      {loading ? <LoadingPage height={heightTable} /> : <>{transactions.length === 0 && EmptyData}</>}
    </Box>
  );
};

export default TransactionCompleted;
