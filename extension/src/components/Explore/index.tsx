import {
  Box,
  Center,
  Flex,
  FlexProps,
  Link,
  SimpleGrid,
} from "@chakra-ui/layout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { fetchExploreData } from "src/utils/krystalService";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { KRYSTAL_API } from "src/config/constants/constants";
import { ExploreData } from "src/config/types";
import { Image } from "@chakra-ui/image";

import { ReactComponent as SwapIconSvg } from "src/assets/images/icons/explore/swap.svg";
import { ReactComponent as TransferIconSvg } from "src/assets/images/icons/explore/transfer.svg";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Skeleton } from "@chakra-ui/skeleton";

const ReactSlickSliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const BoxLink = (props: FlexProps & NavLinkProps) => (
  <Center
    bg="gray.600"
    h="90px"
    borderRadius="2xl"
    as={NavLink}
    transition="0.2s"
    {...props}
    _hover={{ bg: "primary.300", svg: { stroke: "black" } }}
  >
    {props.children}
  </Center>
);

const Summary = () => {
  const { chainId } = useAppSelector(globalSelector);
  const [banners, setBanners] = useState<ExploreData[]>([]);
  const [partners, setPartners] = useState<ExploreData[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchExploreData(KRYSTAL_API[chainId])
      .then((data) => {
        const filterBanners = data.filter((item) => item.type === "banner");
        const partnerBanners = data.filter((item) => item.type === "partner");
        setBanners(filterBanners);
        setPartners(partnerBanners);
        setIsFetching(false);
      })
      .catch((e) => {
        setIsFetching(false);
        throw e;
      });
  }, [chainId]);

  return (
    <Flex py="10" px="5" justify="center">
      <Box w="640px" maxW="100%">
        <Skeleton isLoaded={!isFetching} h="315">
          <Slider {...ReactSlickSliderSettings}>
            {banners.map((banner) => (
              <Box key={banner.id} px="1">
                <Image
                  src={banner.imageUrl}
                  fallbackSrc="https://via.placeholder.com/640x407?text=Temporary+image+640x315"
                  borderRadius="xl"
                  w="100%"
                  h="315"
                  objectFit="cover"
                />
              </Box>
            ))}
          </Slider>
        </Skeleton>
        <SimpleGrid
          columns={{ base: 2, lg: 4 }}
          spacing={10}
          my="80px"
          opacity="0.75"
        >
          <Box textAlign="center">
            <BoxLink to="/swap" mb="4">
              <SwapIconSvg stroke="#FFFFFF" />
            </BoxLink>
            Swap
          </Box>
          <Box textAlign="center">
            <BoxLink to="/transfer" mb="4">
              <TransferIconSvg stroke="#FFFFFF" />
            </BoxLink>
            Transfer
          </Box>
          <Box textAlign="center">
            <BoxLink to="/multi-send" mb="4">
              <TransferIconSvg stroke="#FFFFFF" />
            </BoxLink>
            MultiSend
          </Box>
        </SimpleGrid>

        <Box fontSize="xl" mb={8}>
          Supported Platforms
        </Box>
        <SimpleGrid columns={{ base: 2, lg: 4 }} mb="80px" spacing={5}>
          {partners.map((partner) => (
            <Link href={partner.url} key={partner.id} isExternal>
              <Image
                src={partner.imageUrl}
                fallbackSrc="https://via.placeholder.com/145x80"
                h="80px"
                w="100%"
                objectFit="cover"
                borderRadius="xl"
              />
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default Summary;
