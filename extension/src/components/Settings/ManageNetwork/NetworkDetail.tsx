import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/layout";
import { ChainNodeDetailType } from "src/config/types";

const NetworkDetail = ({ data }: { data: ChainNodeDetailType }) => {
  return (
    <Box p="4" bg="gray.800" borderRadius="lg" mx="6">
      <Box mb="6">
        <Text fontWeight="bold" color="whiteAlpha.500" fontSize="16px">
          Network Name
        </Text>
        <Text fontSize="16px">{data.name}</Text>
      </Box>
      <Box mb="6">
        <Text fontWeight="bold" color="whiteAlpha.500" fontSize="16px">
          New RPC URL
        </Text>
        <Text as={Link} fontSize="16px">
          {data.rpcUrls}
        </Text>
      </Box>
      <Box mb="6">
        <Text fontWeight="bold" color="whiteAlpha.500" fontSize="16px">
          Chain ID
        </Text>
        <Text fontSize="16px">{data.id}</Text>
      </Box>
      <Box mb="6">
        <Text fontWeight="bold" color="whiteAlpha.500" fontSize="16px">
          Currency symbol
        </Text>
        <Text fontSize="16px">{data.currencySymbol}</Text>
      </Box>
      <Box mb="6">
        <Text fontWeight="bold" color="whiteAlpha.500" fontSize="16px">
          Block Explorer URL
        </Text>
        <Text as={Link} fontSize="16px">
          {data.scanUrl}
        </Text>
      </Box>
    </Box>
  );
};
export default NetworkDetail;
