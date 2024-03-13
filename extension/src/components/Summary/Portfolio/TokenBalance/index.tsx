import { Box, Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { NFTs } from "./NFTs";
import { Tokens } from "./Tokens";

const TABS = {
  asset: 0,
  nft: 1,
};

export const TokenBalance = ({ keyword }: { keyword: string }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Box>
        <Flex
          height={10}
          borderRadius="16"
          bgColor="gray.900"
          alignItems="center"
          justifyContent="space-between"
        >
          <Tabs
            colorScheme="primary"
            onChange={(index: any) => {
              setTabIndex(Number(index));
            }}
          >
            <TabList borderBottom="none" height={10}>
              <Tab boxSizing="border-box">Assets</Tab>
              <Tab boxSizing="border-box">NFT</Tab>
            </TabList>
          </Tabs>
        </Flex>
      </Box>
      <Box position="relative">
        {tabIndex === TABS.asset && <Tokens keyword={keyword} />}
        {tabIndex === TABS.nft && (
          <Box mb="8" height="calc(100vh - 350px)" overflowY="auto">
            <NFTs />
          </Box>
        )}
      </Box>
    </>
  );
};
