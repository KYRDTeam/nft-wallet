import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Flex } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { useEffect, useMemo, useState } from "react";
import { TradingScore } from "../../config/types";
import chunk from "lodash/chunk";
import isEmpty from "lodash/isEmpty";
import { formatCurrency } from "../../utils/formatBalance";
import ReactPaginate from "react-paginate";
import { formatNumber } from "src/utils/helper";

const PER_PAGE = 10;

export default function Ranking({ data }: { data: any }) {
  const [page, setPage] = useState<number>(0);
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [tradingScoreFiltered, setTradingScoreFiltered] = useState<
    TradingScore[]
  >([]);

  useEffect(() => {
    setPage(0);
    if (isEmpty(data.trading_scores)) {
      setTradingScoreFiltered([]);
      return;
    }

    const filteredData = data.trading_scores.filter(
      ({ index, trader, score, reward }: TradingScore) => {
        return (
          `${index}`.includes(searchKeyWord) ||
          trader.toLowerCase().includes(searchKeyWord.toLowerCase()) ||
          `${score}`.includes(searchKeyWord) ||
          `${reward}`.includes(searchKeyWord)
        );
      }
    );

    setTradingScoreFiltered(filteredData);
  }, [data.trading_scores, searchKeyWord]);

  const totalPageData = useMemo(() => {
    if (isEmpty(tradingScoreFiltered)) return [[]];
    const pagingTradingScores: TradingScore[][] = chunk(
      tradingScoreFiltered,
      PER_PAGE
    );
    return pagingTradingScores;
  }, [tradingScoreFiltered]);

  return (
    <Box
      width="full"
      backgroundColor="gray.700"
      borderRadius="16"
      p={{ base: 4, md: 8 }}
      textAlign="left"
    >
      <Flex justifyContent="flex-end">
        <InputGroup w="full" maxW="80">
          <Input
            placeholder="Search"
            onChange={(event) => {
              setSearchKeyWord(event.target.value);
            }}
          />
          <InputRightElement children={<SearchIcon color="white.500" />} />
        </InputGroup>
      </Flex>
      <Table
        variant="simple"
        mt="4"
        display={{ base: "block", md: "table" }}
        overflowX="auto"
      >
        <Thead height="10">
          <Tr backgroundColor="gray.900">
            <Th borderTopLeftRadius="16" borderBottomLeftRadius="16">
              Rank
            </Th>
            <Th>Wallet</Th>
            <Th isNumeric>Points</Th>
            <Th
              borderTopRightRadius="16"
              borderBottomRightRadius="16"
              textAlign="right"
            >
              Reward
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {totalPageData[page].map(({ trader, score, reward, index }) => {
            return (
              <Tr
                color={index === 1 ? "#F2BE37" : "whiteAlpha.800"}
                fontSize="lg"
                key={trader}
              >
                <Td>{formatNumber(index)}</Td>
                <Td>{"0x####" + trader.slice(6, 38) + "####"}</Td>
                <Td isNumeric>{formatCurrency(score)}</Td>
                <Td isNumeric>{reward}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {!!totalPageData.length && (
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          breakClassName="break-me"
          initialPage={page}
          forcePage={page}
          pageCount={totalPageData.length}
          marginPagesDisplayed={2}
          pageRangeDisplayed={6}
          onPageChange={({ selected }) => {
            setPage(selected);
          }}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      )}
    </Box>
  );
}
