import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import InputAmount from "../common/InputAmount";
import { ReactComponent as ExchangeIcon } from "../../assets/images/icons/exchange-token.svg";
import { useAppSelector } from "../../hooks/useStore";
import { RateType, Token } from "../../config/types";
import { useRates, useRefPrice } from "../../hooks/useKrystalServices";
import { useDebounce } from "use-debounce";
import { getFullDisplayBalance } from "../../utils/formatBalance";
// import { useSetSwapUrl } from "./useSetSwapUrl";
import Rate from "../common/Rate/Rate";
import RatesList from "../common/Rate/RatesList";
import SlippageModal from "../common/SlippageModal";
import SwapConfirmModal from "./SwapConfirmModal";
import { Button } from "@chakra-ui/button";
import { useTokenAllowance } from "../../hooks/useTokenAllowance";
import { SMART_WALLET_PROXY } from "../../config/constants/contracts";
import { globalSelector } from "../../store/global";
import ApproveTokenModal from "../common/ApproveTokenModal";
import { NODE } from "../../config/constants/chain";
import { useWallet } from "../../hooks/useWallet";
import ConnectWallet from "../Sidebar/ConnectWallet";
import { SlideFade } from "@chakra-ui/transition";
import SwapInfo from "../common/SwapInfo";
import useCustomToast from "src/hooks/useCustomToast";
import { get } from "lodash";
import { transparentize } from "@chakra-ui/theme-tools";
import BigNumber from "bignumber.js";
import useSetInitToken from "src/hooks/useSetInitToken";
import HeaderPage from "../HeaderPage";
import useActiveTokens from "src/hooks/useActiveTokens";

const Swap = () => {
  const { chainId, appSettings } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const [srcAmount, setSrcAmount] = useState("");
  const [debouncedSrcAmount] = useDebounce(srcAmount, 500);
  const toast = useCustomToast();
  const { activeTokens: allTokenSupported } = useActiveTokens({});

  const [srcToken, setSrcToken] = useState<Token>();
  const [destToken, setDestToken] = useState<Token>();
  const [choseRate, setChoseRate] = useState<RateType>();
  const [slippage, setSlippage] = useState<string>("1");
  const [isCustomSlippage, setIsCustomSlippage] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [exchange, setExchange] = useState<boolean>(false);
  useSetInitToken({ token: srcToken, setToken: setSrcToken, exchange });

  // useSetSwapUrl({ srcToken, destToken, setSrcToken, setDestToken });
  const { priceDifference, refPriceDOM } = useRefPrice(choseRate?.humanizeRate, srcToken, destToken);

  const tokenAllowance = useTokenAllowance(srcToken?.address, SMART_WALLET_PROXY[chainId]);

  const isNativeToken = useMemo(
    () => NODE[chainId].address.toLowerCase() === srcToken?.address.toLowerCase(),
    [srcToken, chainId],
  );

  const { rates, isLoading } = useRates(srcToken, debouncedSrcAmount, destToken, account);

  useEffect(() => {
    if (!rates) {
      setChoseRate(undefined);
    } else if (!choseRate) {
      if (!rates[0]) {
        setError("Unable to find the best trade path.");
      } else {
        setChoseRate(rates[0]);
      }
    } else {
      setChoseRate(rates.find((r) => r.platform === choseRate.platform));
    }
  }, [choseRate, rates]);

  const destAmount = useMemo(() => {
    if (srcAmount && choseRate) {
      const amount = choseRate.amount || new BigNumber(srcAmount).multipliedBy(choseRate.rate).toFixed(0);

      return getFullDisplayBalance(amount, destToken?.decimals);
    }
    return "";
  }, [choseRate, destToken, srcAmount]);

  const handleSwapToken = useCallback(() => {
    const srcTokenTmp = srcToken;
    setExchange(true);
    setSrcToken(destToken);
    setDestToken(srcTokenTmp);
  }, [srcToken, destToken]);

  const isValidForSwap = srcToken && destToken && srcAmount && destAmount;

  useEffect(() => {
    setError("");
  }, [srcAmount, chainId, account, srcToken?.address, destToken?.address]);

  const handleOpenConfirmModal = useCallback(
    (onOpenModal) => {
      if (srcToken && +srcAmount > +srcToken?.humanizeBalance) {
        setError("Insufficient balance.");
      } else if (isValidForSwap) onOpenModal();
    },
    [isValidForSwap, srcToken, srcAmount],
  );

  const onMax = useCallback(() => {
    setSrcAmount(srcToken?.humanizeBalance || "");
    if (srcToken?.isNative) {
      toast({
        status: "info",
        title: `A small amount of ${NODE[chainId].currencySymbol} will be used for transaction fee`,
      });
    }
  }, [srcToken?.humanizeBalance, srcToken?.isNative, toast, chainId]);

  useEffect(() => {
    setExchange(false);
  }, [chainId]);

  useEffect(() => {
    if (!srcToken || !destToken) {
      return;
    }

    if (srcToken?.address === destToken?.address) {
      const defaultToken = allTokenSupported.find((t: any) => t.address.toLowerCase() === NODE[chainId].address);
      setSrcToken(defaultToken);
      setDestToken(undefined);
    }

    const existDestToken = allTokenSupported.find((t: any) => t.address.toLowerCase() === destToken.address);
    if (!existDestToken) {
      setDestToken(undefined);
    }
  }, [allTokenSupported, chainId, destToken, srcToken]);

  return (
    <Flex justify="center">
      <Box maxW="100%" bg="gray.800" w="400px" borderRadius="16" px="7" py="5">
        <HeaderPage title="Swap" />
        <Box maxW="100%" borderRadius="16">
          <Flex justify="space-between" mb="3" alignItems="center">
            <Box>Enter the amount</Box>
            <SlippageModal
              slippage={slippage}
              setSlippage={setSlippage}
              isCustomSlippage={isCustomSlippage}
              setIsCustomSlippage={setIsCustomSlippage}
            />
          </Flex>
          <Box className="swap-src-input" zIndex={0} position="relative">
            <InputAmount
              value={srcAmount}
              onChange={setSrcAmount}
              onMax={onMax}
              selectedToken={srcToken}
              setSelectedToken={setSrcToken}
              disabledToken={destToken}
              balance={srcToken?.formattedBalance}
            />
          </Box>
          <Center mt="1" mb="6" cursor="pointer">
            <ExchangeIcon onClick={handleSwapToken} />
          </Center>
          <Box className="swap-dest-input">
            <InputAmount
              value={destAmount}
              selectedToken={destToken}
              setSelectedToken={setDestToken}
              disabledToken={srcToken}
              onChange={() => {}}
              disabled={true}
            />
          </Box>
          {+srcAmount > 0 && srcToken && destToken && (
            <Flex mt="3" justify="space-between" fontSize="sm" gridGap="2" flexWrap="wrap">
              <Center color="whiteAlpha.700">
                {(!rates || choseRate) && <Text mr="1">Rate:</Text>}
                <Rate
                  srcToken={srcToken}
                  destToken={destToken}
                  isLoading={isLoading}
                  rate={choseRate}
                  showReverse={true}
                />
              </Center>
              {choseRate && (
                <RatesList
                  rates={rates}
                  choseRate={choseRate}
                  setChoseRate={setChoseRate}
                  srcToken={srcToken}
                  destToken={destToken}
                  srcAmount={srcAmount}
                />
              )}
            </Flex>
          )}
          <Box mt="8" />
          <ConnectWallet
            renderConnectBtn={(onOpen) => (
              <Button
                w="100%"
                colorScheme="primary"
                onClick={() => {
                  onOpen();
                }}
              >
                Connect wallet
              </Button>
            )}
            renderWalletInfo={
              <>
                {isNativeToken || +tokenAllowance > 0 ? (
                  <SwapConfirmModal
                    srcToken={srcToken}
                    destToken={destToken}
                    srcAmount={srcAmount}
                    destAmount={destAmount}
                    slippage={slippage}
                    rate={choseRate}
                    priceDifference={priceDifference}
                    refPriceDOM={refPriceDOM()}
                    callbackSuccess={() => {
                      setSrcAmount("");
                    }}
                    render={(onOpen) => (
                      <Button
                        w="100%"
                        color="gray.800"
                        fontWeight="700"
                        h="42px"
                        fontSize="15px"
                        colorScheme="primary"
                        className="open-swap-modal"
                        disabled={!isValidForSwap}
                        onClick={() => {
                          handleOpenConfirmModal(onOpen);
                        }}
                      >
                        Review Swap
                      </Button>
                    )}
                  />
                ) : (
                  <ApproveTokenModal
                    srcAmount={srcAmount}
                    srcToken={srcToken}
                    spender={SMART_WALLET_PROXY[chainId]}
                    render={(onOpen) => (
                      <Button
                        w="100%"
                        colorScheme="primary"
                        className="open-approve-modal"
                        disabled={!isValidForSwap}
                        onClick={() => handleOpenConfirmModal(onOpen)}
                      >
                        Approve
                      </Button>
                    )}
                    resetData={() => {
                      setSrcAmount("");
                    }}
                  />
                )}
              </>
            }
          />

          <SlideFade in={!!error} offsetY="5px">
            <Center color="red.400" fontSize="sm" mt="3" textAlign="center">
              {error}
            </Center>
          </SlideFade>

          {choseRate && +srcAmount > 0 && (
            <SwapInfo slippage={slippage} destAmount={destAmount} destToken={destToken} refPriceDOM={refPriceDOM()} />
          )}
        </Box>
        {get(appSettings, "APP_SWAP_BOX.content") && (
          <Box
            w="400px"
            maxW="100%"
            minH="50px"
            mt="6"
            py="4"
            px="5"
            fontSize="13px"
            borderRadius="12"
            className="alert-banner"
            bg={transparentize("primary.300", 0.3) as any}
            color="primary.200"
            wordBreak="break-word"
            dangerouslySetInnerHTML={{
              __html: get(appSettings, "APP_SWAP_BOX.content"),
            }}
            css={{ a: { textDecoration: "underline" } }}
            justifyContent="center"
            alignItems="center"
          />
        )}
      </Box>
    </Flex>
  );
};

export default Swap;
