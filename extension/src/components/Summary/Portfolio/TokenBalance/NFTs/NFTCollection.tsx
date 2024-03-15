import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  useMediaQuery,
  Avatar,
  Text,
  Flex,
} from "@chakra-ui/react";
import { NFTCollectionType, NFTItem } from "src/config/types";
import { NFTitem } from "./NFTitem";

export const NFTCollection = ({ data }: { data: NFTCollectionType }) => {
  const [isMobile] = useMediaQuery("(max-width: 720px)");

  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem border="0">
        <h2>
          <AccordionButton>
            <Flex flex="1" alignItems="center">
              <Avatar
                src={data.collectibleLogo}
                name={data.collectibleName || "<Unknown>"}
                size="sm"
                mr="2"
              />
              {data.collectibleName && <Text>{data.collectibleName}</Text>}
              {!data.collectibleName && (
                <Text color="whiteAlpha.500" fontStyle="italic">
                  {"<Unknown>"}
                </Text>
              )}
            </Flex>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel px="4" pb={4}>
          <SimpleGrid columns={isMobile ? 2 : 3} columnGap={4} p={0}>
            {data.items.map((nft: NFTItem, idx: number) => (
              <NFTitem
                key={nft.tokenID}
                data={nft}
                collectibleAddress={data.collectibleAddress}
                isMobile={isMobile}
                idx={idx}
              />
            ))}
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
