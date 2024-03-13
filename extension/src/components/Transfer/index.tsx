import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Center, Flex } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { SlideFade } from "@chakra-ui/transition";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Token } from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import useCustomToast from "src/hooks/useCustomToast";
import { globalSelector } from "src/store/global";
import { isAddress } from "web3-utils";
import InputAmount from "../common/InputAmount";
import ConnectWallet from "../Sidebar/ConnectWallet";
import TransferConfirmModal from "./TransferConfirmModal";
import { NODE } from "src/config/constants/chain";
import { RecentContact } from "../common/RecentContact";
import { NavLink, useLocation } from "react-router-dom";
import useSetInitToken from "src/hooks/useSetInitToken";
import HeaderPage from "../HeaderPage";

const Transfer = () => {
  const { chainId } = useAppSelector(globalSelector);
  const toast = useCustomToast();
  const [amount, setAmount] = useState("");
  const [recipientAddr, setRecipientAddr] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState<Token>();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const location = useLocation();

  const params: any = useMemo(() => {
    const queryString = location.search;

    let params = new URLSearchParams(queryString);
    return params;
  }, [location.search]);

  useEffect(() => {
    if (!!params.get("address") && recipientAddr === "" && !isUpdate) {
      setRecipientAddr(params.get("address"));
      setIsUpdate(true);
    }
  }, [isUpdate, params, recipientAddr]);

  useSetInitToken({ token, setToken });

  const handleOpenConfirmModal = useCallback(
    (onOpen: () => void) => {
      if (token && +amount > +token?.humanizeBalance) {
        setError("Insufficient balance.");
      } else if (isAddress(recipientAddr) && recipientAddr.includes("0x")) {
        onOpen();
      } else {
        setError("The address is invalid.");
      }
    },
    [recipientAddr, amount, token],
  );

  const onMax = useCallback(() => {
    setAmount(token?.humanizeBalance || "");
    if (token?.isNative) {
      toast({
        status: "info",
        title: `A small amount of ${NODE[chainId].currencySymbol} will be used for transaction fee`,
      });
    }
  }, [token?.humanizeBalance, token?.isNative, toast, chainId]);

  const isValidForTransfer = token && amount;

  useEffect(() => {
    setError("");
  }, [amount, chainId, token?.address, recipientAddr]);

  return (
    <Flex justify="center">
      <Box maxW="100%" bg="gray.800" w="400px" borderRadius="16" px="7" py="5">
        <HeaderPage title="Transfer">
          <Button
            as={NavLink}
            to="/multi-send"
            pos="absolute"
            fontSize="12px"
            border="1px solid"
            borderColor="#A9AEAD"
            color="#A9AEAD"
            p={2}
            h="unset"
            backgroundColor="transparent"
            right="0px"
            top="-3px"
          >
            MULTI-SEND
          </Button>
        </HeaderPage>
        <Box>
          <Box mb="4" ml="2">
            Enter the amount
          </Box>
          <InputAmount
            value={amount}
            onChange={setAmount}
            onMax={onMax}
            selectedToken={token}
            setSelectedToken={setToken}
            balance={token?.formattedBalance}
          />

          <Box mt="7" mb="4">
            <Flex ml="2" mb="4">
              <Text>Recipient Address</Text>
            </Flex>
            <Input
              placeholder="Recipient Address/ENS"
              _placeholder={{ fontSize: "16px" }}
              bgColor="#222"
              height="12"
              fontSize="lg"
              isInvalid={!!error}
              errorBorderColor="red.300"
              value={recipientAddr}
              onChange={(e: any) => setRecipientAddr(e.target.value)}
            />
          </Box>

          <ConnectWallet
            renderConnectBtn={(onOpen) => (
              <Button w="100%" colorScheme="primary" onClick={onOpen}>
                Connect wallet
              </Button>
            )}
            renderWalletInfo={
              <TransferConfirmModal
                token={token}
                recipientAddr={recipientAddr}
                amount={amount}
                render={(onOpen) => (
                  <Button
                    w="100%"
                    color="gray.800"
                    fontWeight="700"
                    h="42px"
                    fontSize="15px"
                    colorScheme="primary"
                    disabled={!isValidForTransfer}
                    onClick={() => {
                      handleOpenConfirmModal(onOpen);
                    }}
                  >
                    Transfer
                  </Button>
                )}
                callBackSuccess={() => {
                  setAmount("");
                  setRecipientAddr("");
                }}
              />
            }
          />

          <SlideFade in={!!error} offsetY="5px">
            <Center color="red.400" fontSize="sm" mt="3" textAlign="center">
              {error}
            </Center>
          </SlideFade>

          <RecentContact onSelect={setRecipientAddr} />
        </Box>
      </Box>
    </Flex>
  );
};

export default Transfer;
