import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Skeleton,
  Switch,
  Text,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import useFetch from "use-http";
import moment from "moment";

import { formatNumber } from "src/utils/helper";
import { RewardType } from "src/config/types";
import RewardEmptySvg from "src/assets/images/icons/reward_empty.svg";

import Claim from "./Claim";

export default function RewardList({ account }: { account: string }) {
  const { loading, data } = useFetch(
    `/v1/account/rewards?address=${account}`,
    {},
    []
  );
  const [onlyShowUnclaimed, setOnlyShowUnclaimed] = useState(false);

  const rewardsFiltered = useMemo(() => {
    if (!data || !data.rewards) return [];

    return data.rewards.filter((reward: RewardType) => {
      if (onlyShowUnclaimed) {
        return reward.status === "pending";
      }
      return true;
    });
  }, [data, onlyShowUnclaimed]);

  const claimableRewards = useMemo(() => {
    if (!data || !data.claimableRewards) return [];

    return data.claimableRewards;
  }, [data]);

  const supportedChainIDs = useMemo(() => {
    if (!data || !data.supportedChainIDs) return [];

    return data.supportedChainIDs;
  }, [data]);

  return (
    <Flex
      direction={{ base: "column-reverse", lg: "row" }}
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Box flex="2" pos="relative" mt={{ base: 16, lg: 0 }} w="full">
        <FormControl
          width="auto"
          display="flex"
          alignItems="center"
          position="absolute"
          right="0"
          top="-10"
        >
          <FormLabel htmlFor="email-alerts" mb="0">
            Unclaimed Token Only
          </FormLabel>
          <Switch
            colorScheme="primary"
            isChecked={onlyShowUnclaimed}
            onChange={(event) => {
              setOnlyShowUnclaimed(event.target.checked);
            }}
          />
        </FormControl>
        {!loading && isEmpty(rewardsFiltered) && (
          <Flex
            justifyContent="center"
            alignItems="center"
            direction="column"
            w="full"
            borderRadius="16"
            bg="gray.600"
            height="500px"
            mb="8"
          >
            <Image src={RewardEmptySvg} />
            <Text mt="8">You don’t have any reward</Text>
            <Button
              color="whiteAlpha.600"
              bg="transparent"
              px="16"
              mt="4"
              as={NavLink}
              to="/swap"
              border="2px solid"
              borderColor="whiteAlpha.300"
            >
              Trade to get Reward
            </Button>
          </Flex>
        )}

        <Box w="full" borderRadius="16" bg="gray.700" overflowY="auto" py="8">
          {!loading && !isEmpty(rewardsFiltered) && (
            <Flex
              justifyContent="flex-start"
              alignItems="center"
              direction="column"
              w="full"
              height={{ base: "auto", md: "800px" }}
              maxHeight={{ base: "unset", md: "100vh" }}
              overflowY="auto"
            >
              {rewardsFiltered.map((reward: RewardType, index: number) => {
                const isClaimed = reward.status === "claimed";

                return (
                  <Flex
                    justifyContent="space-between"
                    width="full"
                    p="4"
                    bg={index % 2 === 0 ? "gray.800" : "gray.900"}
                    key={`${index}_${reward.timestamp}`}
                  >
                    <Box>
                      <Text>
                        + {reward.amount} {reward.rewardSymbol}
                      </Text>
                      <Text color="whiteAlpha.500" mt="1">
                        {moment(reward.timestamp).format("hh:mm A DD MMM YYYY")}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text textTransform="uppercase">{reward.source}</Text>
                      <Badge
                        px="2"
                        py="1"
                        borderRadius="8"
                        variant="subtle"
                        color="whiteAlpha.600"
                        colorScheme={isClaimed ? "gray" : "primary"}
                        textTransform="capitalize"
                        mt="1"
                      >
                        {isClaimed ? "Claimed" : "Unclaimed"}
                      </Badge>
                    </Box>
                  </Flex>
                );
              })}
            </Flex>
          )}
          {loading && <Skeleton mt="0" w="full" height="300px" />}
        </Box>
      </Box>

      {!loading && !isEmpty(claimableRewards) && (
        <Flex
          flex="1"
          ml={{ base: 0, lg: 8 }}
          p="6"
          borderRadius="16"
          bg="gray.600"
          height="fit-content"
          mb="4"
          alignItems="flex-end"
          justifyContent="flex-end"
          direction="column"
          w="full"
        >
          {claimableRewards.map((reward: RewardType) => (
            <Flex
              key={reward.rewardSymbol}
              justifyContent="space-between"
              mb="4"
              w="full"
            >
              <Flex alignItems="center">
                <Image boxSize="6" src={reward.rewardImage} />
                <Text ml="2">
                  {formatNumber(reward.amount, 4)} {reward.rewardSymbol}
                </Text>
              </Flex>
              <Text ml="2">${formatNumber(reward.quote.value, 4)}</Text>
            </Flex>
          ))}

          {/* active claim */}
          {claimableRewards[0] && (
            <Claim supportedChainIds={supportedChainIDs} disabled={loading} />
          )}

          {/* deactive claim */}
          {!claimableRewards[0] && (
            <Button
              disabled
              colorScheme="primary"
              w="full"
              mt="2"
              maxW={{ base: "md", md: "xs", lg: "full" }}
            >
              Claim All
            </Button>
          )}
        </Flex>
      )}
      {loading && (
        <Flex
          flex="1"
          ml={{ base: 0, lg: 8 }}
          p="6"
          borderRadius="16"
          height="fit-content"
          mb="4"
          alignItems="flex-end"
          justifyContent="flex-end"
          direction="column"
        >
          <Skeleton w="full" height="150px" flex="1" />
        </Flex>
      )}
    </Flex>
  );
}
