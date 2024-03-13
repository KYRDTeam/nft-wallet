import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Header } from "./Header";
import { TokenBalance } from "./TokenBalance";

export const Portfolio = () => {
  const [keyword, setKeyword] = useState("");

  return (
    <Box mt={{ md: "12" }}>
      <Header keyword={keyword} setKeyword={setKeyword} />
      <Flex gap={4} mt={4} gridGap="5" flexWrap="wrap" direction="column">
        <Box mr={0}>
          <TokenBalance keyword={keyword} />
        </Box>
      </Flex>
    </Box>
  );
};
