import {
  Box,
  Flex,
  Heading,
  Container,
  Image,
  Link,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import { get, isEmpty } from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { NotificationType } from "src/config/types";
import useFetch from "use-http";
import {
  DefaultIconNotificationIcon,
  NotificationEmptyIllus,
} from "../common/icons";

const Notification = () => {
  const { data, loading } = useFetch("/v1/notification/list", {}, []);

  const notifications = useMemo(() => {
    return get(data, "notifications", []);
  }, [data]);

  return (
    <Container maxW="container.xl">
      <Flex py="10" px="5" justify="center">
        <Box w="640px" maxW="100%">
          <Flex alignItems="center">
            <Heading as="h2" size="lg" mr="auto">
              Notifications
            </Heading>
          </Flex>

          <Box bg="gray.700" borderRadius="12" mt="6" py="8">
            <Flex
              direction="column"
              height={{
                base: "calc( 100vh - 240px )",
                md: "calc( 100vh - 200px )",
              }}
              overflowY="auto"
              borderY="1px solid"
              borderColor="whiteAlpha.100"
            >
              {loading && (
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Skeleton
                    w="full"
                    borderRadius="0"
                    mt="0"
                    mb="1px"
                    height="100px"
                  />
                  <Skeleton
                    w="full"
                    borderRadius="0"
                    mt="0"
                    mb="1px"
                    height="100px"
                  />
                  <Skeleton
                    w="full"
                    borderRadius="0"
                    mt="0"
                    mb="1px"
                    height="100px"
                  />
                </Flex>
              )}
              {!loading && isEmpty(notifications) && (
                <Flex
                  direction="column"
                  height="300px"
                  justifyContent="center"
                  alignItems="center"
                >
                  <NotificationEmptyIllus />
                  <Text mt="2" color="whiteAlpha.600" fontStyle="italic">
                    No notification yet!
                  </Text>
                </Flex>
              )}
              {!loading &&
                notifications.map((notification: NotificationType) => (
                  <Link
                    href={notification.link}
                    isExternal
                    display="block"
                    _hover={{ textDecoration: "none" }}
                    borderBottom="1px solid"
                    borderBottomWidth="1px"
                    borderBottomColor="whiteAlpha.100"
                    key={notification.id}
                  >
                    <Flex
                      alignItems="flex-start"
                      px="4"
                      py="2"
                      _hover={{ bg: "gray.800" }}
                    >
                      <Box boxSize={7} mr="2">
                        <Image
                          boxSize={7}
                          src={notification.image}
                          fallback={<DefaultIconNotificationIcon boxSize={7} />}
                        />
                      </Box>
                      <Box>
                        <Text fontWeight="bold">{notification.title}</Text>
                        <Text
                          fontSize="xs"
                          color="whiteAlpha.500"
                          fontStyle="italic"
                        >
                          {moment(notification.updatedAt).fromNow()}
                        </Text>
                        <Text fontSize="xs" color="whiteAlpha.700">
                          {notification.content}
                        </Text>
                      </Box>
                    </Flex>
                  </Link>
                ))}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default Notification;
