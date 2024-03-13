import { Box, Flex, Heading } from "@chakra-ui/layout";
import { useState } from "react";
import { ArrowBackIcon } from "../icons";
import { Link } from "react-router-dom";
import SingleSupply from "./SingleSupply";
import SwapAndSupply from "./SwapAndSupply";

const Supply = () => {
  const [isSingleSupply, setIsSingleSupply] = useState(true);

  return (
    <Flex py="10" px="5" justify="center">
      <Box maxW="100%">
        <Flex alignItems="center" mb="10">
          <Link to="/earn">
            <ArrowBackIcon />
          </Link>
          <Heading as="h2" size="lg" ml="5">
            Setup
          </Heading>
        </Flex>
        <Box
          bg="gray.700"
          w="400px"
          maxW="100%"
          borderRadius="16"
          px="7"
          py="8"
        >
          {isSingleSupply ? (
            <SingleSupply setIsSingleSupply={setIsSingleSupply} />
          ) : (
            <SwapAndSupply setIsSingleSupply={setIsSingleSupply} />
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Supply;
