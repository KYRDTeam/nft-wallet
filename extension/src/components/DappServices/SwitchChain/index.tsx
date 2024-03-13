import { Box, Button, ButtonGroup, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { Tag } from "src/theme";
import { ChainIcon } from "../../icons";
import { useAppSelector, useAppDispatch } from "src/hooks/useStore";
import { globalSelector, setChainId } from "src/store/global";
import { NODE } from "src/config/constants/chain";
import { useCallback, useEffect, useState } from "react";
import { sendMessage } from "src/services/extension";
import { hexToNumber } from "web3-utils";
import { ChainId } from "src/config/types";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import LoadingPage from "src/components/LoadingPage";
import { closeCurrentWindow } from "src/background/bgHelper";
import useGetPageInfo from "src/hooks/useGetPageInfo";

const SwitchChain = () => {
  const { chainId } = useAppSelector(globalSelector);
  const [browserChainId, setBrowserChainId] = useState<ChainId>();
  const dispatch = useAppDispatch();
  const { pageInfo: page, loading } = useGetPageInfo();

  const handleConfirm = useCallback(async () => {
    if (browserChainId) {
      await sendMessage({ type: "confirm_switch_chain", chainId: browserChainId });
      dispatch(setChainId(browserChainId));
    }

    closeCurrentWindow();
  }, [browserChainId, dispatch]);

  useEffect(() => {
    const getLoaded = async () => {
      await sendMessage({ type: "is_loaded_popup" });
    };
    getLoaded();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
      if (request.type === "get_chain_id") {
        sendResponse(true);
        setBrowserChainId(hexToNumber(request.chainId));
      }
    });
  }, []);

  if (loading) {
    return <LoadingPage height="100vh" />;
  }

  return (
    <Flex alignItems="center" justifyContent="space-between" flexDir="column" height="100vh">
      <Flex alignItems="center" justifyContent="flex-start" flexDir="column" mt={8} px={6}>
        <Flex alignItems="center" justifyContent="space-around" w="100%" mb={4}>
          <Tag px={2} alignItems="center">
            {chainId && <ChainIcon chainId={chainId || 1} boxSize={5} />}
            <Box mx="2">{chainId && NODE[chainId]?.name}</Box>
          </Tag>
          <ArrowForwardIcon w="20px" h="20px" />
          <Tag px={2} alignItems="center">
            {browserChainId && <ChainIcon chainId={browserChainId || 1} boxSize={5} />}
            <Box mx="2">{browserChainId && NODE[browserChainId]?.name}</Box>
          </Tag>
        </Flex>
        <Tag px={4} fontSize="md" h="40px">
          <Image src={page?.icon} w="30px" h="30px" />
          <Text ml={2}>{page?.domain}</Text>
        </Tag>
        <Text fontWeight="semibold" fontSize="2xl" mt={3} textAlign="center">
          Allow this site to switch the network
        </Text>
        <Text my={3} textAlign="center">
          This will switch the selected network within Krystal Wallet to a previously added network
        </Text>
      </Flex>
      <Box width="100%" px={6}>
        <Divider />
        <ButtonGroup width="100%" py={4} display="flex" alignItems="center" justifyContent="space-around">
          <Button
            colorScheme="gray"
            color="white"
            width="150px"
            onClick={() => {
              sendMessage({ type: "reject_switch_chain" });
              closeCurrentWindow();
            }}
          >
            Cancel
          </Button>
          <Button colorScheme="primary" width="150px" onClick={handleConfirm}>
            Switch
          </Button>
        </ButtonGroup>
      </Box>
    </Flex>
  );
};

export default SwitchChain;
