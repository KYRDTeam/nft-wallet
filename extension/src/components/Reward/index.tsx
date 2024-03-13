import { Box, Container, Flex, Text } from "@chakra-ui/react";
import AuthReferral from "../Referral/Auth";
import useAuth from "src/hooks/useAuth";
import { useWallet } from "src/hooks/useWallet";
import RewardList from "./RewardList";

export default function Reward() {
  const { account } = useWallet();
  const { accessToken } = useAuth();

  return (
    <Container maxW="4xl" my="8">
      <Flex>
        <Box flex="2">
          <Flex w="full" justify="space-between" alignItems="center">
            <Text fontSize="2xl" mb="4">
              Rewards
            </Text>
          </Flex>
        </Box>
      </Flex>

      {!accessToken && (
        <AuthReferral message="To proceed with reward program, you need to verify the ownership of your wallet by signing the message." />
      )}

      {accessToken && account && <RewardList account={account} />}
    </Container>
  );
}
