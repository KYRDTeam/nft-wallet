import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Tag } from "src/theme";
import { ellipsis, formatCurrency } from "src/utils/formatBalance";
import GasSettings from "../common/GasSettings";
import InfoField from "../common/InfoField";
import { fromWei, hexToNumberString } from "web3-utils";
import { usePrice } from "src/hooks/useTokens";
import { useSendTx } from "src/hooks/useSendTx";
import { sendMessage } from "src/services/extension";
import { SlideFade } from "@chakra-ui/transition";
import { Center, Link } from "@chakra-ui/layout";
import { closeCurrentWindow } from "src/background/bgHelper";
import LoadingPage from "../LoadingPage";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { NODE } from "src/config/constants/chain";
import { calculateTxFee, formatNumber } from "src/utils/helper";
import { ChainIcon } from "src/components/icons";
import { GAS_LIMIT_DEFAULT } from "src/config/constants/constants";
import useGetPageInfo from "src/hooks/useGetPageInfo";

const SignAndSendTx = () => {
  const { chainId } = useAppSelector(globalSelector);
  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { pageInfo, loading: loadingGetPageInfo } = useGetPageInfo();

  const { send, txHash, resetState, loadingText, error } = useSendTx();

  const { getPrice } = usePrice();
  const srcUsdPrice = getPrice(NODE[chainId]?.address);
  const nativeUsdPrice = getPrice(NODE[chainId].address);
  const gasFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

  const amount = useMemo(() => {
    if (!data) {
      return 0;
    }
    return fromWei(hexToNumberString(data.value));
  }, [data]);

  const handleConfirm = useCallback(async () => {
    await send({
      to: data.to,
      value: data.value,
      gasPrice,
      gasLimit: data.gasLimit,
      priorityFee,
      nonce: data.nonce,
      data: data.data,
    });
  }, [data, gasPrice, priorityFee, send]);

  useEffect(() => {
    const getLoaded = async () => {
      await sendMessage({ type: "is_loaded_popup" });
    };
    getLoaded();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.type === "get_data_tx") {
        sendResponse(true);
        setData(request.data);
      }
    });
  }, []);

  useEffect(() => {
    if (txHash) {
      sendMessage({ type: "send_tx_hash", hash: txHash });
      resetState();
      closeCurrentWindow();
    }
  }, [txHash, resetState]);

  useEffect(() => {
    if (!!data) {
      setGasLimit(data.gasLimit);
      setPriorityFee((+hexToNumberString(data.maxPriorityFeePerGas) / 10 ** 9).toString());
      setGasPrice((+hexToNumberString(data.maxFeePerGas) / 10 ** 9).toString());
      setIsLoading(false);
    }
  }, [data]);

  if (isLoading || loadingGetPageInfo) {
    return <LoadingPage height="100vh" />;
  }

  return (
    <Flex flexDir="column" alignItems="center" justifyContent="space-between" h="100vh">
      <Box width="100%">
        <Flex justifyContent="start" mt={4} px={4}>
          <Tag alignItems="center" px={3}>
            {chainId && <ChainIcon chainId={chainId || 1} boxSize={5} />}
            <Box ml={2}>{chainId && NODE[chainId]?.name}</Box>
          </Tag>
        </Flex>
        <Flex justifyContent="space-around" alignItems="center" mt={4}>
          <Tag>{ellipsis(data.from, 8, 8)}</Tag>
          <ArrowForwardIcon w="20px" h="20px" />
          <Tag>{ellipsis(data.to, 8, 8)}</Tag>
        </Flex>
        <Box bg="gray.700" mt={4} px={7} py={6} borderRadius="13px" mx={4}>
          <Text>{URL}</Text>
          <Flex justifyContent="space-between" alignItems="center" mt={2}>
            <Box>
              <Text mb={2}>{pageInfo && `https://${pageInfo.domain}/`}</Text>
              <Box border="1px solid" p={2} borderColor="whiteAlpha.600" borderRadius="4">
                <Text
                  color="primary.300"
                  mr="2"
                  as={Link}
                  href={`${NODE[chainId].scanUrl}/address/${data.to}`}
                  target="_blank"
                >{`${ellipsis(data.to)} `}</Text>
                : CONTRACT INTERACTION
              </Box>
              <Text fontSize="lg" fontWeight="semibold"></Text>
            </Box>
          </Flex>
        </Box>

        <Box px="4" py="6">
          <Box
            width="full"
            backgroundColor="gray.700"
            borderRadius="16"
            px={{ base: 7, md: 8 }}
            py={4}
            textAlign="left"
          >
            <Flex justify="space-between">
              <Box>Amount</Box>
              <Box textAlign="right">
                <Box>
                  {formatCurrency(amount)} {data?.token?.chainSymbol}
                </Box>
                {!!srcUsdPrice && (
                  <Text ml="1" color="whiteAlpha.700" fontSize="sm">
                    ≈ {formatCurrency(srcUsdPrice * +amount)} USD
                  </Text>
                )}
              </Box>
            </Flex>

            <Box background="gray.800" borderRadius="16" p="6" mt="4" pt="4">
              <InfoField
                content={
                  <GasSettings
                    gasPrice={gasPrice}
                    setGasPrice={setGasPrice}
                    gasLimit={gasLimit}
                    setGasLimit={setGasLimit}
                    priorityFee={priorityFee}
                    setPriorityFee={setPriorityFee}
                    defaultGasLimit={GAS_LIMIT_DEFAULT}
                    isTypeCustom
                    customGasLimit
                  />
                }
              />
              <InfoField
                title="Maximum gas fee"
                tooltip="The actual cost of the transaction is generally lower than the maximum estimated cost."
                content={
                  <Text>
                    {formatNumber(gasFee)} {NODE[chainId].currencySymbol}
                  </Text>
                }
              />
              <InfoField
                content={
                  <Flex direction="column" alignItems="flex-end">
                    <Text color="whiteAlpha.700" fontSize="sm">
                      ≈ {formatNumber(+gasFee * nativeUsdPrice)} USD
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="sm">
                      {gasPrice} (Gas Price) * {gasLimit} (Gas Limit)
                    </Text>
                  </Flex>
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <SlideFade in={!!error} offsetY="5px">
        <Center color="red.400" fontSize="sm" mb="2" textAlign="center">
          {error.slice(0, 80)}
        </Center>
      </SlideFade>
      <ButtonGroup width="100%" mb={8} display="flex" alignItems="center" justifyContent="space-around">
        <Button
          colorScheme="gray"
          color="white"
          width="150px"
          onClick={() => {
            sendMessage({ type: "reject_tx" });
            closeCurrentWindow();
          }}
        >
          Reject
        </Button>
        <Button
          colorScheme="primary"
          width="150px"
          loadingText={loadingText}
          disabled={loadingText !== ""}
          isLoading={loadingText !== ""}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

export default SignAndSendTx;
