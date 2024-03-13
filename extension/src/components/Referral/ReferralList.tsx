import React, { useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import useFetch from "use-http";
import { useWallet } from "src/hooks/useWallet";
import {
  krystalApiEndPoint,
  KRYSTAL_APP,
} from "src/config/constants/constants";
import { ChainId } from "src/config/types";
import { NavLink } from "react-router-dom";
import { ReactComponent as CopyIconSvg } from "src/assets/images/icons/copy.svg";
import infoIcon from "src/assets/images/icons/info.svg";
import { formatNumber } from "src/utils/helper";
import ShareSocialModal from "src/components/common/ShareSocialModal";

import RewardTierModal from "./RewardTierModal";

export default function ReferralList() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { account, chainId } = useWallet();
  const { data: referralData, loading } = useFetch(
    `${krystalApiEndPoint}/all/v1/account/referralOverview?address=${account}`,
    {},
    []
  );

  const generateRefLink = useCallback(
    (code: string) => `${KRYSTAL_APP[chainId as ChainId]}/r/${code}`,
    [chainId]
  );

  const copyRefLink = useCallback((refLink: string) => {
    navigator.clipboard.writeText(refLink);
  }, []);

  if (loading) {
    return (
      <Flex justifyContent="center">
        <Skeleton height="200px" w="full" />
      </Flex>
    );
  }

  return (
    <Box bg="gray.800" borderRadius="16">
      <Box
        bg="gray.700"
        borderTopLeftRadius="16"
        borderTopRightRadius="16"
        p="8"
      >
        <Box bg="gray.800" borderRadius="16" p="4" px="6">
          <Text color="gray.300">Total referral rewards</Text>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="xl">
              {referralData?.rewardAmount} {referralData?.rewardToken?.symbol}
            </Text>
            <Button
              colorScheme="primary"
              bg="transparent"
              border="0"
              variant="link"
              fontSize="md"
              cursor="pointer"
              as={NavLink}
              to="/rewards"
              onClick={(event) => {
                if (referralData?.rewardAmount <= 0) {
                  event.preventDefault();
                }
              }}
              disabled={referralData?.rewardAmount <= 0}
            >
              CLAIM HERE
            </Button>
          </Flex>
        </Box>
      </Box>
      <Box p="8" pb="0">
        <Text px="4" color="whiteAlpha.600" fontSize="md">
          Copy below given Ref Code to share with your friends & start earning{" "}
          <Tooltip
            hasArrow
            label={
              <Box>
                <Text display="inline">
                  Ask your friends to download Krystal App using your Referral
                  Codes. If they enter your Referral Codes when
                  importing/creating their wallets in Krystal, both you and your
                  friends can start earning Referral Rewards.
                </Text>
                <a
                  className="hover-underline"
                  href="https://docs.krystal.app/krystal-defi/referral-program"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1de9b6" }}
                >
                  {" "}
                  Learn more.
                </a>
              </Box>
            }
            bg="gray.700"
            color="whiteAlpha.600"
            p="4"
          >
            <Image src={infoIcon} alt="Info" display="inline" />
          </Tooltip>
        </Text>
        <Table
          mt="6"
          display={{ base: "block", md: "table" }}
          overflowX="auto"
          whiteSpace="nowrap"
          mb="4"
        >
          <Thead>
            <Tr>
              <Th
                bg="gray.700"
                color="whiteAlpha.500"
                borderTopLeftRadius="16"
                borderBottomLeftRadius="16"
                border="0"
                py="4"
              >
                Referral Code
              </Th>
              <Th
                bg="gray.700"
                color="whiteAlpha.500"
                border="0"
                textAlign="center"
              >
                Share (%)
                <br />
                You - Friend
              </Th>
              <Th
                bg="gray.700"
                color="whiteAlpha.500"
                border="0"
                textAlign="center"
              >
                Friends
              </Th>
              <Th
                bg="gray.700"
                color="whiteAlpha.500"
                borderTopRightRadius="16"
                borderBottomRightRadius="16"
                border="0"
                isNumeric
              >
                Volume (USD)
              </Th>
            </Tr>
          </Thead>
          <Tbody fontSize="md">
            {referralData?.codeStats &&
              Object.keys(referralData?.codeStats).map(
                (key: string, index: number) => {
                  // @ts-ignore
                  const code = referralData.codeStats[key];
                  const yourShare = code.ratio / 100;
                  const friendShare = 100 - yourShare;
                  const refLink: string = generateRefLink(key);

                  return (
                    <Tr key={index}>
                      <Td border="0">
                        <Text width="24" display="inline-block">
                          {key}
                        </Text>
                        <Flex display="inline-flex">
                          <Tooltip label="Click to Copy" hasArrow>
                            <CopyIconSvg
                              stroke="#fff"
                              onClick={() => copyRefLink(refLink)}
                              style={{ cursor: "pointer" }}
                              display="inline"
                            />
                          </Tooltip>
                          <Box ml="1">
                            <ShareSocialModal
                              url={refLink}
                              content={`Here's my referral code ${key} to earn bonus rewards on the Krystal app! Use the code when connecting your wallet in the app. Details: https://krystal.app`}
                            />
                          </Box>
                        </Flex>
                      </Td>
                      <Td border="0" textAlign="center">
                        {yourShare}-{friendShare}
                      </Td>
                      <Td border="0" textAlign="center">
                        {code.totalRefer}
                      </Td>
                      <Td border="0" isNumeric>
                        {formatNumber(code.vol, 4)}
                      </Td>
                    </Tr>
                  );
                }
              )}
          </Tbody>
          <Tfoot fontSize="md">
            {referralData?.bonusVol > 0 && (
              <Tr borderTop="1px solid #333">
                <Td border="0" colSpan={3}>
                  <Flex>
                    <Text mr="1">Bonus Volume</Text>
                    <Tooltip
                      title={`This is shared by your referrer. ${referralData?.bonusRatio}% of your trading volume will be counted in the total referral volume.`}
                      hasArrow
                      placement="top"
                      // interactive
                    >
                      <Image src={infoIcon} alt="Info" />
                    </Tooltip>
                  </Flex>
                </Td>
                <Td border="0" textAlign="right">
                  {formatNumber(referralData?.bonusVol, 4)}
                </Td>
              </Tr>
            )}
            <Tr borderTop="1px solid #333">
              <Td border="0" colSpan={3}>
                <Text>REFERRAL VOLUME</Text>
              </Td>
              <Td border="0" textAlign="right">
                {formatNumber(referralData?.totalVol, 4)}
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </Box>
      <Flex
        bg="gray.700"
        borderBottomLeftRadius="16"
        borderBottomRightRadius="16"
        p="8"
        alignItems="center"
      >
        <Text fontSize="xl" pl="4" color="whiteAlpha.800">
          ${formatNumber(referralData?.volForNextReward, 4)} more to unlock the
          next reward
        </Text>
        <Button
          colorScheme="primary"
          bg="transparent"
          border="0"
          variant="link"
          fontSize="md"
          cursor="pointer"
          display="inline-block"
          ml="1"
          onClick={onOpen}
          boxSize="5"
        >
          <Image src={infoIcon} alt="Info" boxSize="5" />
        </Button>
        <RewardTierModal isOpen={isOpen} onClose={onClose} />
      </Flex>
    </Box>
  );
}
