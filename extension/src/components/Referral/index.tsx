import AuthReferral from "./Auth";
import { Container, Text } from "@chakra-ui/react";
import useAuth from "src/hooks/useAuth";
import { useWallet } from "src/hooks/useWallet";
import ReferralList from "./ReferralList";

export default function KrystalPoint() {
  const { accessToken } = useAuth();
  const { account } = useWallet();

  return (
    <Container my="8" maxW="3xl">
      <Text fontSize="2xl" mb="4">
        Referral
      </Text>
      {!accessToken && <AuthReferral />}
      {accessToken && account && <ReferralList />}
    </Container>
  );
}
