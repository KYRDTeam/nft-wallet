import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { NFTItem } from "src/config/types";
import NFTSvg from "src/assets/images/illus/NFT.svg";
import { transparentize } from "@chakra-ui/theme-tools";
import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import PureLogo from "src/assets/images/logos/nft-wallet-pure.svg";
import { useWallet } from "src/hooks/useWallet";
import { keysSelector } from "../../../../../store/keys";
import { ellipsis } from "../../../../../utils/formatBalance";
import { isNumber } from "lodash";
import { useMemo } from "react";

export const NFTitem = ({
  data,
  collectibleAddress,
  isMobile,
  onlyPreview = false,
  idx,
}: {
  data: NFTItem;
  collectibleAddress: string;
  isMobile: boolean;
  onlyPreview?: boolean;
  idx?: number;
}) => {
  let location = useLocation();
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { accountsTBA } = useAppSelector(keysSelector);

  const tbaAccount = useMemo(
    () => !!account && isNumber(idx) && accountsTBA?.[account]?.[idx]?.address,
    [account, accountsTBA, idx]
  );

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
        {collectibleAddress !== process.env.REACT_APP_TBA_NFT && (
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
        )}
        {collectibleAddress === process.env.REACT_APP_TBA_NFT && (
          <Flex
            w="100%"
            h="100%"
            maxW="full"
            maxHeight="full"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            position="absolute"
            mb={{ base: 1, md: 3 }}
            backgroundImage={PureLogo}
            backgroundSize="cover"
            backgroundPosition="center"
            align="center"
            justify="center"
          >
            <Text
              color="primary.200"
              fontWeight="semibold"
              fontSize="xl"
              mt={1}
            >
              #{data?.tokenID}
            </Text>
          </Flex>
        )}
      </Box>
      <Flex
        maxW="100%"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        <Text color="whiteAlpha.600" mr={2}>
          #{data.tokenID}
        </Text>
        {collectibleAddress === process.env.REACT_APP_TBA_NFT &&
          !!tbaAccount && (
            <Text color="primary.200">{ellipsis(tbaAccount || "", 6, 4)}</Text>
          )}
      </Flex>
    </Box>
  );
};
