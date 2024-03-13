import { Button } from "@chakra-ui/button";
import { Container, Flex } from "@chakra-ui/layout";
import { Text, useMediaQuery } from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/skeleton";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import CampaignCountDown from "./CampaignCountDown";
import HowToStart from "./HowToStart";
import Introduction from "./Introduction";
import Ranking from "./Ranking";
import Reward from "./Reward";
import useFetch from "use-http";
import { useMemo } from "react";
import { get } from "lodash";
import {
  KRYSTAL_ADMIN_URL,
  MOBILE_SCREEN_SIZE,
} from "src/config/constants/constants";
import { NavLink } from "react-router-dom";
import { formatNumber } from "src/utils/helper";
import { TradingScore } from "src/config/types";

const Summary = () => {
  const { loading, data } = useFetch(
    `${KRYSTAL_ADMIN_URL}/api/campaigns/current_active`,
    {
      interceptors: {
        response: async ({ response }) => {
          if (response.status === 200) {
            response.data.trading_scores = response.data.trading_scores.map(
              (tradingScore: TradingScore, index: number) => ({
                ...tradingScore,
                index: index + 1,
              })
            );
          }

          return response;
        },
      },
    },
    []
  );

  const [isMobile] = useMediaQuery("(max-width: 720px)");

  const bannerUrl = useMemo(() => {
    if (!get(data, "banner") || !get(data, "banner_mobile")) return "";

    const url = KRYSTAL_ADMIN_URL;
    return window.innerWidth < MOBILE_SCREEN_SIZE
      ? url + get(data, "banner_mobile")
      : url + get(data, "banner");
  }, [data]);

  const participants = useMemo(() => {
    return formatNumber(get(data, "trading_scores", []).length);
  }, [data]);

  return (
    <Container maxW="container.lg" pt="6">
      <Skeleton minHeight="48" isLoaded={!loading}>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={bannerUrl}
          style={{
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            height: "auto",
            borderRadius: 16,
          }}
        >
          <source src={bannerUrl} />
        </video>
      </Skeleton>

      <Skeleton minHeight="32" isLoaded={!loading}>
        <Flex
          width="full"
          minHeight="32"
          backgroundColor="gray.700"
          mt="6"
          py="8"
          borderRadius="16"
          direction={{ base: "column", md: "row" }}
        >
          <Flex
            flex="2"
            justifyContent="center"
            alignItems="center"
            borderRight="1px solid #636466"
            mb={{ base: 4, md: 0 }}
          >
            <Button colorScheme="primary" width="40" as={NavLink} to="/swap">
              Enter Now
            </Button>
          </Flex>
          <Flex flex="3" borderRight="1px solid #636466">
            {data && <CampaignCountDown data={data} />}
          </Flex>
          <Flex flex="2" justifyContent="center" alignItems="center">
            <Text>{participants} participants</Text>
          </Flex>
        </Flex>
      </Skeleton>

      <Tabs
        mt="6"
        align="center"
        orientation={isMobile ? "vertical" : "horizontal"}
        flexDirection="column"
      >
        <TabList borderColor="transparent">
          <Tab
            _selected={{
              color: "primary.300",
              borderColor: isMobile ? "transparent" : "primary.300",
            }}
          >
            INTRODUCTION
          </Tab>
          <Tab
            _selected={{
              color: "primary.300",
              borderColor: isMobile ? "transparent" : "primary.300",
            }}
          >
            HOW TO START
          </Tab>
          <Tab
            _selected={{
              color: "primary.300",
              borderColor: isMobile ? "transparent" : "primary.300",
            }}
          >
            RANKING
          </Tab>
          <Tab
            _selected={{
              color: "primary.300",
              borderColor: isMobile ? "transparent" : "primary.300",
            }}
          >
            T&C AND REWARD
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <Skeleton height="80" mt="0" isLoaded={!loading}>
              <Introduction data={data || {}} />
            </Skeleton>
          </TabPanel>
          <TabPanel p="0">
            <Skeleton height="80" mt="0" isLoaded={!loading}>
              <HowToStart data={data || {}} />
            </Skeleton>
          </TabPanel>
          <TabPanel p="0">
            <Skeleton height="80" mt="0" isLoaded={!loading}>
              <Ranking data={data || {}} />
            </Skeleton>
          </TabPanel>
          <TabPanel p="0">
            <Skeleton height="80" mt="0" isLoaded={!loading}>
              <Reward data={data || {}} />
            </Skeleton>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Summary;
