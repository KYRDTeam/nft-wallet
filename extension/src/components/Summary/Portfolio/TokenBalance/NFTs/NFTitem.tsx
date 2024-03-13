import { Box, Image, Text } from "@chakra-ui/react";
import { NFTItem } from "src/config/types";
import NFTSvg from "src/assets/images/illus/NFT.svg";
import { transparentize } from "@chakra-ui/theme-tools";
import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";

export const NFTitem = ({
  data,
  collectibleAddress,
  isMobile,
  onlyPreview = false,
}: {
  data: NFTItem;
  collectibleAddress: string;
  isMobile: boolean;
  onlyPreview?: boolean;
}) => {
  let location = useLocation();
  const { chainId } = useAppSelector(globalSelector);

  return (
    <Box
      bg="gray.600"
      mb="4"
      display="block"
      w="full"
      borderRadius="16"
      p={{ base: 3, md: 4 }}
      cursor={onlyPreview ? "default" : "pointer"}
      as={onlyPreview ? Box : NavLink}
      to={
        onlyPreview
          ? {}
          : {
              pathname: `/nft/${collectibleAddress}/${data.tokenID}?chainId=${chainId}`,
              state: { background: location },
            }
      }
      border="1px solid"
      borderColor="transparent"
      _hover={
        onlyPreview
          ? {}
          : {
              bgColor: transparentize("primary.300", 0.3) as any,
              borderColor: "primary.300",
            }
      }
    >
      <Box
        borderRadius="16"
        bg="gray.900"
        w="full"
        pt="100%"
        mb={{ base: 1, md: 3 }}
        position="relative"
        overflow="hidden"
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
          src={data?.externalData?.image}
          fallbackSrc={NFTSvg}
        />
      </Box>
      <Text
        maxW="100%"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        {data?.externalData?.name}
      </Text>
      <Text color="whiteAlpha.600">#{data.tokenID}</Text>
    </Box>
  );
};
