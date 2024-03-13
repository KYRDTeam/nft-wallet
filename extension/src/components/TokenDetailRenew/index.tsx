import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Token } from "src/config/types";
import { useSetTokenUrl } from "../TokenDetail/useSetTokenUrl";
import { DefaultTokenIcon } from "src/components/common/icons";
import { isEmpty } from "lodash";
import LoadingPage from "src/components/LoadingPage";
import { getBalanceNumber } from "src/utils/formatBalance";
import { useHistory } from "react-router-dom";
import useFetchTransactions from "src/hooks/useFetchTransactions";
import TransactionCompleted from "../History/TransactionCompleted";
import HeaderPage from "../HeaderPage";

const TokenDetail = () => {
  const [token, setToken] = useState<Token>();
  const { loading, filter, onFilter, transactions } = useFetchTransactions();
  const history = useHistory();

  useSetTokenUrl({ setToken });

  useEffect(() => {
    if (!token) {
      return;
    }
    onFilter({ ...filter, displayedTokens: [token.symbol] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token || isEmpty(token)) {
    return <LoadingPage />;
  }

  return (
    <Box my="7">
      <Box px="7">
        <HeaderPage
          title={
            <Flex alignItems="center" mr="2">
              <Box mr="2" display="block">
                <Image
                  boxSize="7"
                  borderRadius="100%"
                  src={token.logo}
                  fallback={<DefaultTokenIcon stroke="#fff" boxSize="7" />}
                />
              </Box>

              <Box fontSize="sm">
                <Text fontSize="xl" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                  {token.symbol}
                </Text>
              </Box>
            </Flex>
          }
        ></HeaderPage>

        <Box mb="6" textAlign="center">
          <Box fontSize="22px" color="rgba(255, 255, 255, 0.95)" fontWeight="400" mb="6px">
            {getBalanceNumber(token?.balance || 0, token?.decimals).toLocaleString()} {token?.symbol}
          </Box>
          <Box color="rgba(255, 255, 255, 0.5);" fontSize="lg">
            ${token?.quotes?.usd?.value?.toLocaleString()}
          </Box>
        </Box>

        <Flex alignItems="center" justifyContent="space-between" mt={3} mb="9">
          <Button
            w="100%"
            maxW="160px"
            height="38px"
            fontSize="15px"
            color="#0f0f0f"
            fontWeight="700"
            borderRadius={16}
            colorScheme="primary"
            onClick={() => {
              history.push(`/transfer?token=${token.address}`);
            }}
          >
            Transfer
          </Button>
          <Button
            w="100%"
            maxW="160px"
            height="38px"
            fontSize="15px"
            color="#0f0f0f"
            fontWeight="700"
            borderRadius={16}
            colorScheme="primary"
            onClick={() => {
              history.push(`/swap?token=${token.address}`);
            }}
          >
            Swap
          </Button>
        </Flex>
      </Box>
      <Box>
        <Text fontSize="sm" px="7" mb="20px">
          RECENT ACTIVITY
        </Text>

        <TransactionCompleted transactions={transactions} loading={loading} heightTable={loading ? "300px" : "100%"} />
      </Box>
    </Box>
  );
};

export default TokenDetail;
