import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Header } from "./Header";
import { TokenBalance } from "./TokenBalance";
import { keysSelector } from "src/store/keys";
import { useAppSelector } from "src/hooks/useStore";
import { useFetchAllTBA } from "src/hooks/useFetchAllTBA";
import { useWallet } from "src/hooks/useWallet";

export const Portfolio = () => {
  const { chainId } = useWallet();
  const [keyword, setKeyword] = useState("");

  const { accounts } = useAppSelector(keysSelector);

  useFetchAllTBA({addresses: accounts, chainId})

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
