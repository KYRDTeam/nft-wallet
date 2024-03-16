import { Container } from "@chakra-ui/react";

import { Portfolio } from "./Portfolio";
import CreateWallet from "../CreateWallet";
import { useWallet } from "src/hooks/useWallet";

const Summary = () => {
  const { account } = useWallet();

  return (
    <Container maxW={{ base: "full", lg: "container.xl" }}>
      {!account && <CreateWallet />}
      {!!account && <Portfolio />}
    </Container>
  );
};

export default Summary;
