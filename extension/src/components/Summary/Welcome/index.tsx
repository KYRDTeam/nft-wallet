import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  SimpleGrid,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import ConnectWallet from "../../Sidebar/ConnectWallet";

import { ReactComponent as SwapIllustrationSvg } from "./illustration/swap.svg";
import { ReactComponent as EarnIllustrationSvg } from "./illustration/earn.svg";
import { ReactComponent as PortfolioIllustrationSvg } from "./illustration/portfolio.svg";
import { ReactComponent as RewardsIllustrationSvg } from "./illustration/reward.svg";

import ApkPng from "./download/apk.png";
import ApplePng from "./download/apple.png";
import GooglePlayPng from "./download/google_play.png";
import TestflightPng from "./download/testflight.png";
import { NavLink } from "react-router-dom";
import AddWatchedWalletModal from "src/components/ManageWallets/AddWatchedWallet";

const Card = ({
  title,
  subTitle,
  image,
  ...props
}: {
  title: string;
  subTitle: string;
  image: React.ReactElement;
  [restProp: string]: any;
}) => {
  return (
    <Flex
      bg="gray.700"
      borderRadius="16"
      justifyContent="space-between"
      alignItems="center"
      direction="column"
      p="6"
      height="350px"
      borderColor="transparent"
      borderWidth="1px"
      _hover={{
        borderColor: "primary.300",
      }}
      cursor="pointer"
      {...props}
    >
      <Box textAlign="center">
        <Text fontWeight="bold" fontSize="lg" mb="2">
          {title}
        </Text>
        <Text color="whiteAlpha.600">{subTitle}</Text>
      </Box>
      <Box>{image}</Box>
    </Flex>
  );
};

export const Welcome = () => {
  const [isMobile] = useMediaQuery("(max-width: 720px)");

  return (
    <>
      <Box fontSize="2xl" mb="4">
        <Box mt="20">
          <Text display="inline" fontSize="5xl" fontWeight="bold">
            Krystal{" "}
          </Text>
          <Text display={{ base: "block", lg: "inline" }} fontSize="2xl">
            One Platform, All DeFi
          </Text>
        </Box>
      </Box>
      <AddWatchedWalletModal
        render={(onOpen) => (
          <Button
            w="100%"
            maxW="300px"
            colorScheme="primary"
            onClick={() => {
              onOpen();
            }}
          >
            Add wallet to watch
          </Button>
        )}
      />
      <SimpleGrid
        columns={isMobile ? 2 : 4}
        columnGap={{ base: 4, lg: 6 }}
        rowGap={{ base: 4, lg: 6 }}
        w={{ base: "100%", lg: "80%" }}
        mt="8"
      >
        <Card
          title="Swap"
          subTitle="Swap any token to any token at the best rates"
          image={<SwapIllustrationSvg />}
          as={NavLink}
          to="/swap"
        />
        <Card
          title="Earn"
          subTitle="Earn interest from idle assets in real time"
          image={<EarnIllustrationSvg />}
          as={NavLink}
          to="/earn"
        />
        <ConnectWallet
          renderConnectBtn={(onOpen) => (
            <Card
              title="Manage Your Portfolio"
              subTitle="Track & manage your digital assets"
              image={<PortfolioIllustrationSvg />}
              onClick={onOpen}
            />
          )}
          renderWalletInfo={<></>}
        />

        <Card
          title="Get Rewards"
          subTitle="Enjoy bonus rewards by participating in Krystal activities"
          image={<RewardsIllustrationSvg />}
          as={NavLink}
          to="/rewards"
        />
      </SimpleGrid>
      <SimpleGrid
        columns={isMobile ? 2 : 4}
        margin={isMobile ? "0 auto" : "unset"}
        mt="12"
        w="fit-content"
      >
        <Link
          href="https://apps.apple.com/vn/app/krystal-one-platform-all-defi/id1558105691"
          target="_blank"
          mr="4"
          mb="4"
        >
          <Image src={ApplePng} />
        </Link>
        <Link
          href="https://testflight.apple.com/join/KVYcKb68"
          target="_blank"
          mr="4"
          mb="4"
        >
          <Image src={TestflightPng} />
        </Link>
        <Link
          href="https://play.google.com/store/apps/details?id=com.kyrd.krystal"
          target="_blank"
          mr="4"
          mb="4"
        >
          <Image src={GooglePlayPng} />
        </Link>
        <Link
          href="https://files.krystal.app/Krystal.apk"
          target="_blank"
          mr="4"
          mb="4"
        >
          <Image src={ApkPng} />
        </Link>
      </SimpleGrid>
    </>
  );
};
