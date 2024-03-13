import { Badge, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import NFTSvg from "src/assets/images/illus/NFT.svg";
import { urlify } from "src/utils/helper";
import { FavouriteNFT } from "../common/FavouriteNFT";

export const Detail = ({
  collectibleAddress,
  loading,
  data,
}: {
  collectibleAddress: string;
  loading: boolean;
  data: any;
}) => {
  return (
    <>
      {loading && (
        <Skeleton
          borderRadius="16"
          bg="gray.900"
          w="full"
          h="300px"
          mt="0"
          mb={{ base: 1, md: 3 }}
        />
      )}
      {!loading && (
        <Box
          borderRadius="16"
          bg="gray.900"
          w="full"
          pt="100%"
          mb={{ base: 1, md: 3 }}
          position="relative"
        >
          <Image
            w="auto"
            h="auto"
            maxW="full"
            maxHeight="full"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            position="absolute"
            mb={{ base: 1, md: 3 }}
            src={data.externalData?.image}
            fallbackSrc={NFTSvg}
          />
        </Box>
      )}
      {loading && (
        <Skeleton
          borderRadius="16"
          bg="gray.900"
          w="full"
          h="56px"
          mt="0"
          mb={{ base: 1, md: 3 }}
        />
      )}
      {!loading && (
        <Flex justifyContent="space-between">
          <Box maxW="80%">
            <Text
              fontSize="xl"
              textOverflow="ellipsis"
              // whiteSpace="wrap"
              overflow="hidden"
            >
              {data.externalData?.name}
            </Text>
            <Text color="whiteAlpha.500">{data.collectibleName}</Text>
          </Box>
          <FavouriteNFT
            tokenID={data.tokenID}
            collectibleAddress={collectibleAddress}
            favourite={data.favorite}
          />
        </Flex>
      )}
      {loading && (
        <Skeleton
          borderRadius="16"
          bg="gray.900"
          w="full"
          h="250px"
          mt="0"
          mb={{ base: 1, md: 3 }}
        />
      )}
      {!loading && (
        <>
          <Flex my="2">
            <Badge
              variant="subtle"
              colorScheme="gray"
              py="1"
              px="3"
              borderRadius="16"
            >
              #{data.tokenID}
            </Badge>
          </Flex>
          <Box maxHeight="200px" overflowY="auto">
            <Text
              mb="3"
              className="nft-description"
              color="whiteAlpha.500"
              fontSize="md"
              dangerouslySetInnerHTML={{
                __html: urlify(data.externalData?.description || ""),
              }}
            ></Text>
          </Box>
        </>
      )}
    </>
  );
};
