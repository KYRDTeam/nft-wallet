import { Box, Center, FlexProps } from "@chakra-ui/layout";
import { ReactComponent as LoadingSVG } from "../assets/images/icons/loading.svg";
import { ReactComponent as Krystal } from "../assets/images/logos/nft-wallet.svg";

const LoadingPage = (props: FlexProps) => {
  return (
    <>
      <Center minH="calc(100vh - 74px - 80px)" flexDir="column" {...props}>
        <LoadingSVG />
        <Box mt={5} />
        <Krystal width="300px" />
      </Center>
    </>
  );
};

export default LoadingPage;
