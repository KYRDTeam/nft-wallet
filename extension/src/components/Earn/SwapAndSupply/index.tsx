import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import InputAmount from "../../common/InputAmount";
import { useAppSelector } from "../../../hooks/useStore";
import { EarnToken, RateType, Token, Platform } from "../../../config/types";
import { useRates, useRefPrice } from "../../../hooks/useKrystalServices";
import { useDebounce } from "use-debounce";
import { getFullDisplayBalance } from "../../../utils/formatBalance";
import Rate from "../../common/Rate/Rate";
import RatesList from "../../common/Rate/RatesList";
import SlippageModal from "../../common/SlippageModal";
import { Button } from "@chakra-ui/button";
import { useTokenAllowance } from "../../../hooks/useTokenAllowance";
import { SMART_WALLET_PROXY } from "../../../config/constants/contracts";
import { globalSelector } from "../../../store/global";
import ApproveTokenModal from "../../common/ApproveTokenModal";
import { NODE } from "../../../config/constants/chain";
import { useWallet } from "../../../hooks/useWallet";
import ConnectWallet from "../../Sidebar/ConnectWallet";
import { SlideFade } from "@chakra-ui/transition";
import useSetSupplyUrl from "../useSetSupplyUrl";
import SwapAndSupplyConfirmModal from "./SwapAndSupplyConfirmModal";
import { ArrowDownIcon } from "../../icons";
import { earnSelector } from "src/store/earn";
import SwapInfo from "../../common/SwapInfo";
import SelectPlatform from "../SelectPlatform";

const SwapAndSupply = ({
  setIsSingleSupply,
}: {
  setIsSingleSupply: (f: boolean) => void;
}) => {
  const { chainId } = useAppSelector(globalSelector);
  const { earnList } = useAppSelector(earnSelector);
  const { account } = useWallet();
  const [srcAmount, setSrcAmount] = useState("");
  const [debouncedSrcAmount] = useDebounce(srcAmount, 500);

  const [srcToken, setSrcToken] = useState<Token>();
  const [destToken, setDestToken] = useState<EarnToken>();
  const [choseRate, setChoseRate] = useState<RateType>();
  const [slippage, setSlippage] = useState<string>("1");
  const [isCustomSlippage, setIsCustomSlippage] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>();
  const [error, setError] = useState("");

  useSetSupplyUrl({ srcToken, destToken, setSrcToken, setDestToken });

  const { priceDifference, refPriceDOM } = useRefPrice(
    choseRate?.humanizeRate,
    srcToken,
    destToken as any
  );

  const tokenAllowance = useTokenAllowance(
    srcToken?.address,
    SMART_WALLET_PROXY[chainId]
  );

  const isNativeToken = useMemo(
    () =>
      NODE[chainId].address.toLowerCase() === srcToken?.address.toLowerCase(),
    [srcToken, chainId]
  );

  const { rates, isLoading } = useRates(
    srcToken,
    debouncedSrcAmount,
    destToken as any,
    account
  );

  useEffect(() => {
    setSelectedPlatform(destToken?.overview[0]);
  }, [destToken]);

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

  const destAmount = useMemo(
    () =>
      srcAmount && choseRate
        ? getFullDisplayBalance(choseRate.amount, destToken?.decimals)
        : "",
    [choseRate, destToken, srcAmount]
  );

  const isValidForSwap = srcToken && destToken && srcAmount && destAmount;

  useEffect(() => {
    setError("");
  }, [
    srcAmount,
    chainId,
    account,
    srcToken?.address,
    destToken?.address,
  ]);

  const handleOpenConfirmModal = useCallback(
    (onOpenModal) => {
      if (account?.toLowerCase() !== account) {
        setError(
          "Please switch to the imported wallet to make the transaction."
        );
      } else if (srcToken && +srcAmount > +srcToken?.humanizeBalance) {
        setError("Insufficient balance.");
      } else if (isValidForSwap) onOpenModal();
    },
    [isValidForSwap, account, srcToken, srcAmount]
  );

  return (
    <Box>
      <Flex justify="space-between" alignItems="baseline">
        <Box mb="4">Enter the amount</Box>
        <SlippageModal
          slippage={slippage}
          setSlippage={setSlippage}
          isCustomSlippage={isCustomSlippage}
          setIsCustomSlippage={setIsCustomSlippage}
        />
      </Flex>
      <InputAmount
        value={srcAmount}
        onChange={setSrcAmount}
        onMax={() => setSrcAmount(srcToken?.humanizeBalance || "")}
        selectedToken={srcToken}
        setSelectedToken={setSrcToken}
        balance={srcToken?.formattedBalance}
        disabledToken={destToken as any}
      />
      <Center my="5">
        <ArrowDownIcon />
      </Center>
      <InputAmount
        value={destAmount}
        selectedToken={destToken as any}
        setSelectedToken={setDestToken as any}
        tokens={earnList as any}
        onChange={() => {}}
        disabledToken={srcToken as any}
        disabled={true}
      />
      {+srcAmount > 0 && srcToken && destToken && (
        <Flex
          mt="3"
          justify="space-between"
          fontSize="sm"
          gridGap="2"
          flexWrap="wrap"
        >
          <Center color="whiteAlpha.700">
            {(!rates || choseRate) && <Text mr="1">Rate:</Text>}
            <Rate
              srcToken={srcToken}
              destToken={destToken as any}
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
              destToken={destToken as any}
              srcAmount={srcAmount}
            />
          )}
        </Flex>
      )}

      <Flex fontSize="xs" mt="5">
        If you already have {destToken?.symbol}, you can
        <Text
          color="primary.200"
          ml="1"
          cursor="pointer"
          onClick={() => setIsSingleSupply(true)}
        >
          Go Back
        </Text>
      </Flex>

      <Center my="5">
        <ArrowDownIcon />
      </Center>

      <SelectPlatform
        token={destToken}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
      />

      <Box mt="8" />
      <ConnectWallet
        renderConnectBtn={(onOpen) => (
          <Button w="100%" colorScheme="primary" onClick={onOpen}>
            Connect wallet
          </Button>
        )}
        renderWalletInfo={
          <>
            {isNativeToken || +tokenAllowance > 0 ? (
              <SwapAndSupplyConfirmModal
                srcToken={srcToken}
                destToken={destToken as any}
                srcAmount={srcAmount}
                destAmount={destAmount}
                slippage={slippage}
                rate={choseRate}
                priceDifference={priceDifference}
                refPriceDOM={refPriceDOM()}
                platform={selectedPlatform}
                render={(onOpen) => (
                  <Button
                    w="100%"
                    colorScheme="primary"
                    disabled={!isValidForSwap}
                    onClick={() => {
                      handleOpenConfirmModal(onOpen);
                    }}
                  >
                    Supply
                  </Button>
                )}
              />
            ) : (
              <ApproveTokenModal
                srcAmount={srcAmount}
                srcToken={srcToken}
                render={(onOpen) => (
                  <Button
                    w="100%"
                    colorScheme="primary"
                    disabled={!isValidForSwap}
                    onClick={() => handleOpenConfirmModal(onOpen)}
                  >
                    Approve
                  </Button>
                )}
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
        <SwapInfo
          slippage={slippage}
          destAmount={destAmount}
          destToken={destToken}
          refPriceDOM={refPriceDOM()}
        />
      )}
    </Box>
  );
};

export default SwapAndSupply;
