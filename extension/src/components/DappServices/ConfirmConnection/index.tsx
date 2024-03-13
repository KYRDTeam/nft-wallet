import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, Image, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { useAppDispatch } from "src/hooks/useStore";
import { useWallet } from "src/hooks/useWallet";
import { Tag } from "src/theme";
import { ellipsis } from "src/utils/formatBalance";
import { setTrustedApps } from "src/store/trustedApps";
import { sendMessage } from "src/services/extension";
import useBeforeUnload from "src/hooks/useBeforeUnload";
import useGetPageInfo from "src/hooks/useGetPageInfo";
import LoadingPage from "src/components/LoadingPage";

const ConfirmConnection = () => {
  const { account } = useWallet();
  const dispatch = useAppDispatch();
  const { pageInfo: page, loading } = useGetPageInfo();

  const handleAcceptConnection = useCallback(() => {
    if (account && !!page) {
      const promise = new Promise((resolve, reject) => {
        dispatch(
          setTrustedApps({
            address: account,
            page: page,
          }),
        );
        resolve(true);
      });
      promise.then(() => {
        sendMessage({ type: "confirm_account_connection" });
      });
    }
  }, [account, dispatch, page]);

  const handleRejectConnection = useCallback(() => {
    sendMessage({ type: "reject_account_connection" });
  }, []);

  useBeforeUnload(() => handleRejectConnection());

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Flex flexDir="column" justifyContent="space-between" alignItems="center" h="100vh" py={4}>
      <Tag px="3" fontSize="sm" mt={4}>
        {ellipsis(account || "", 12, 10)}
      </Tag>
      <Flex flexDir="column" justifyContent="center" alignItems="center">
        <Image src={page?.icon} alt={page?.title} w="80px" h="80px" />
        <Text
          textAlign="center"
          fontSize="xl"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          width="300px"
          my={4}
        >
          {page?.title}
        </Text>
        <Text color="gray.300">{page?.domain}</Text>
      </Flex>
      <Flex flexDir="column" justifyContent="center" alignItems="flex-start">
        <Text>This app would like to:</Text>
        <Flex my={4} justifyContent="center" alignItems="center">
          <CheckIcon color="primary.300" mr={2} />
          <Text>View your wallet balance & activity</Text>
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <CheckIcon color="primary.300" mr={2} />
          <Text>Request approval for transactions</Text>
        </Flex>
      </Flex>
      <Box>
        <Text textAlign="center" fontSize="14px" color="whiteAlpha.500">
          Only connect to websites you trust
        </Text>
        <ButtonGroup width="100%" display="flex" alignItems="center" justifyContent="space-around" my={4}>
          <Button colorScheme="gray" color="white" width="150px" onClick={handleRejectConnection}>
            Cancel
          </Button>
          <Button colorScheme="primary" width="150px" onClick={handleAcceptConnection}>
            Connect
          </Button>
        </ButtonGroup>
      </Box>
    </Flex>
  );
};

export default ConfirmConnection;
