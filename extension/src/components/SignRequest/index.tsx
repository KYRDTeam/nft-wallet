import React, { useEffect, useState } from "react";

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Image,
} from "@chakra-ui/react";
import { sendMessage } from "src/services/extension";
import LoadingPage from "../LoadingPage";
import { getEthBalance } from "src/utils/erc20";
import { useWallet } from "src/hooks/useWallet";
import { NODE } from "src/config/constants/chain";
import { fromWei, hexToUtf8 } from "web3-utils";
import { useAppSelector } from "src/hooks/useStore";
import { keysSelector } from "src/store/keys";
import { closeCurrentWindow } from "src/background/bgHelper";
import useGetPageInfo from "src/hooks/useGetPageInfo";
import { useMemo } from "react";

const SignRequest = () => {
  const { pageInfo, loading } = useGetPageInfo();
  const [data, setData] = useState<any>();
  const [balance, setBalance] = useState<any>(0);
  const { chainId, account } = useWallet();
  const { keyringController } = useAppSelector(keysSelector);

  const handleSign = async () => {
    const { tx, address } = data;
    const signedTx = await keyringController.signPersonalMessage(
      account === tx
        ? { data: address, from: tx }
        : { data: tx, from: address },
      {}
    );
    sendMessage({ type: "send_tx_hash", hash: signedTx });
    closeCurrentWindow();
  };

  useEffect(() => {
    const getLoaded = async () => {
      await sendMessage({ type: "is_loaded_popup" });
    };
    getLoaded();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async function (
      request,
      sender,
      sendResponse
    ) {
      if (request.type === "get_data_sign") {
        sendResponse(true);
        setData(request.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!!data && !balance) {
      const getBalance = async () => {
        const res = await getEthBalance(data.address, NODE[chainId].rpcUrls);
        setBalance(res);
      };
      getBalance();
    }
  }, [balance, chainId, data]);

  const msg = useMemo(() => {
    try {
      return account === data?.tx
        ? hexToUtf8(data?.address)
        : hexToUtf8(data?.tx);
    } catch (error) {
      return account === data?.tx ? data?.address : data?.tx;
    }
  }, [account, data?.address, data?.tx]);

  if (!data || loading) {
    return <LoadingPage height="100vh" />;
  }

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="space-between"
      h="100vh"
    >
      <Box p={0} m={0} w="100%">
        <Heading as="h4" py="6" fontSize="2xl" textAlign="center" mb={4}>
          Signature Request
        </Heading>
        <Flex justifyContent="space-between" px="4" mb={8}>
          <Box>
            <Text fontSize="14px" mb="2">
              Account:
            </Text>
            <Text>Account 1</Text>
          </Box>
          <Box>
            <Text fontSize="14px" mb="2" textAlign="right">
              Balance:
            </Text>
            <Text textAlign="right">
              {Number(fromWei(balance.toString())).toFixed(4)}{" "}
              {NODE[chainId].currencySymbol}
            </Text>
          </Box>
        </Flex>
        <Flex mb={8} px="4" justifyContent="space-between">
          <Text>Origin: </Text>
          <Flex>
            <Image
              src={pageInfo?.icon}
              alt="Origin-icon"
              borderRadius="50%"
              boxSize="7"
            />
            <Text ml={2}>{`https://${pageInfo?.domain}`}</Text>
          </Flex>
        </Flex>
        <Text textAlign="center" mb={4}>
          You are signing:
        </Text>

        <Box
          backgroundColor="gray.700"
          borderRadius="16"
          px={{ base: 7, md: 8 }}
          py={4}
          mx={4}
          mb={4}
          textAlign="left"
          dangerouslySetInnerHTML={{
            __html: msg,
          }}
        />
      </Box>
      <ButtonGroup
        width="100%"
        mb={8}
        display="flex"
        alignItems="center"
        justifyContent="space-around"
      >
        <Button
          colorScheme="gray"
          color="white"
          width="150px"
          onClick={() => {
            sendMessage({ type: "reject_tx" });
            closeCurrentWindow();
          }}
        >
          Cancel
        </Button>
        <Button colorScheme="primary" width="150px" onClick={handleSign}>
          Sign
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

export default SignRequest;
