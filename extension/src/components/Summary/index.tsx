import { Container } from "@chakra-ui/react";
import RegisterReferralCode from "./RegisterReferralCode";

import { Portfolio } from "./Portfolio";
import CreateWallet from "../CreateWallet";
import { useWallet } from "src/hooks/useWallet";

const Summary = () => {
  const { account } = useWallet();

  return (
    <Container maxW={{ base: "full", lg: "container.xl" }}>
      {!account && <CreateWallet />}
      {!!account && <Portfolio />}
      <RegisterReferralCode />
    </Container>
  );
};

export default Summary;
