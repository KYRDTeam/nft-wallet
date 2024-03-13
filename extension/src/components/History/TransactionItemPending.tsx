import React, { useEffect } from "react";

import { useAppSelector } from "../../hooks/useStore";
import { globalSelector } from "../../store/global";
import { getTxReceipt } from "../../utils/web3";
import { Box, Center, Flex } from "@chakra-ui/layout";
import sendIcon from "src/assets/images/icons/tx-status/send.svg";
import { Image } from "@chakra-ui/image";
import { TextDeep } from "src/theme";
import { ellipsis } from "src/utils/formatBalance";
import { useDispatch } from "react-redux";
import { removeHashItem, updateHashItem } from "src/store/hash";
import TransactionDetailPending from "./TransactionDetailPending";
import GroupButtonAction from "./GroupButtonAction";
import { transparentize } from "@chakra-ui/theme-tools";
import { Spinner } from "@chakra-ui/spinner";

const TransactionItemPending = ({ data, isOdd }: { data: any; isOdd: any }) => {
  const { chainId } = useAppSelector(globalSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data.hash) {
      return;
    }
    const getData = setInterval(() => {
      getTxReceipt(chainId, data.hash).then((txReceipt: any) => {
        if (!!txReceipt && Object.keys(txReceipt).length) {
          dispatch(removeHashItem(data.hash));
        }
      });
    }, 2000);

    return () => {
      clearInterval(getData);
    };
  }, [chainId, data, dispatch]);

  useEffect(() => {
    if (data.isNew) {
      setTimeout(() => {
        dispatch(updateHashItem(data.hash));
      }, 1000);
    }
  }, [data, dispatch]);

  return (
    <TransactionDetailPending
      transaction={data}
      render={(open) => (
        <Flex
          px="5"
          py="3"
          bg={isOdd ? "gray.800" : "gray.700"}
          onClick={() => {
            open();
          }}
          _hover={{ bg: transparentize("primary.300", 0.3), cursor: "pointer" }}
        >
          <Center>
            <Box className="history__tx-images">
              <Image w="30px" src={sendIcon} alt="" />
            </Box>
            <Box ml="5">
              <Box fontSize="lg">Tx Hash</Box>
              <TextDeep fontSize="md" fontWeight="semibold">
                {data.isNew && <Spinner size="xs" color="white.400" speed="0.8s" mr="4" />}
                {!data.isNew && ellipsis(data.hash)}
              </TextDeep>

              <Box mt="3">
                <GroupButtonAction data={data} type="small" />
              </Box>
            </Box>
          </Center>
        </Flex>
      )}
    />
  );
};

export default TransactionItemPending;
