import { SmallAddIcon } from "@chakra-ui/icons";
import {
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  useMediaQuery,
  Text,
  Flex,
  Skeleton,
} from "@chakra-ui/react";
import { get, isEmpty } from "lodash";
import { useMemo } from "react";
import NFTNotFoundIllus from "src/components/common/icons/NFTNotFoundIllus";
import { NFTCollectionType } from "src/config/types";
import { useFetchTBANFT } from "src/hooks/useFetchTBANFT";
import { useWallet } from "src/hooks/useWallet";
import { NFTCollection } from "./NFTCollection";

export const NFTs = () => {
  const { account, chainId } = useWallet();
  const [isMobile] = useMediaQuery("(max-width: 720px)");
  const { data, loading } = useFetchTBANFT({address: account || "", chainId: chainId});

  const collections: NFTCollectionType[] = useMemo(() => {
    return get(data, "balances", []);
  }, [data]);

  if (loading) {
    return (
      <Accordion defaultIndex={[0]} allowMultiple px="4">
        <AccordionItem border="0">
          <h2>
            <AccordionButton>
              <Flex flex="1" alignItems="center">
                <Skeleton w="8" mr="2" borderRadius="50%" h="8" />
                <Skeleton w="40" mr="2" h="8" />
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px="4" pb={4}>
            <SimpleGrid columns={isMobile ? 2 : 3} columnGap={4} p={0}>
              <Skeleton height={{ base: "150px", md: "250px" }} mt="0" />
              <Skeleton height={{ base: "150px", md: "250px" }} mt="0" />
              <Skeleton
                height={{ base: "150px", md: "250px" }}
                mt={{ base: 4, md: 0 }}
              />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }

  if (isEmpty(collections)) {
    return (
      <Flex
        w="full"
        height="400px"
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <NFTNotFoundIllus boxSize="40" />
        <Text color="whiteAlpha.600" mt="6">
          No NFT found.
        </Text>
        <Button mt="4" leftIcon={<SmallAddIcon />}>
          Add NFT
        </Button>
      </Flex>
    );
  }

  return (
    <>
      {collections.map((collection: NFTCollectionType) => (
        <NFTCollection key={collection.collectibleAddress} data={collection} />
      ))}
    </>
  );
};
