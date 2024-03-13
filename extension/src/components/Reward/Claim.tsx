import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import useFetch from "use-http";
import { get } from "lodash";

import { ChainId } from "src/config/types";
import { NODE } from "src/config/constants/chain";
import { useWallet } from "src/hooks/useWallet";
import { useSendTx } from "src/hooks/useSendTx";
import { calculateTxFee, formatNumber } from "src/utils/helper";

import GasSettings from "../common/GasSettings";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";

export default function Claim({
  supportedChainIds,
  disabled,
}: {
  supportedChainIds: ChainId[];
  disabled: boolean;
}) {
  const { account } = useWallet();

  const { chainId: chainIdLocally } = useAppSelector(globalSelector);

  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();

  const [error, setError] = useState("");

  const gasFee = useMemo(
    () => calculateTxFee(gasPrice || 0, gasLimit || 0),
    [gasPrice, gasLimit]
  );

  const {
    data,
    get: fetchClaimTx,
    loading,
  } = useFetch(`/v1/account/claimRewards?address=${account}`, {}, [
    chainIdLocally,
  ]);

  const { send, error: txError, loadingText } = useSendTx();

  useEffect(() => {
    setError("");
  }, [chainIdLocally]);

  const isCorrectChain = useMemo(
    () =>
      chainIdLocally && supportedChainIds.includes(chainIdLocally as ChainId),
    [chainIdLocally, supportedChainIds]
  );

  const commonError = useMemo(() => error || txError, [error, txError]);

  const claim = useCallback(async () => {
    if (!isCorrectChain) {
      setError(
        `Please switch to ${supportedChainIds
          .map((chainId: ChainId) => NODE[chainId].name)
          .join(" / ")} to claim rewards`
      );
      return;
    }
    const response = await fetchClaimTx();

    if (get(response, "claimTx")) {
      send({
        ...get(response, "claimTx", {}),
        gasPrice,
        gasLimit:
          gasLimit !== "70000" ? gasLimit : get(response, "claimTx.gasLimit"),
        priorityFee,
      });
    }
  }, [
    isCorrectChain,
    fetchClaimTx,
    supportedChainIds,
    send,
    gasPrice,
    gasLimit,
    priorityFee,
  ]);

  return (
    <>
      {isCorrectChain && (
        <>
          <Divider mb="2" />
          <Flex justifyContent="space-between" w="full">
            <Box opacity="0.75">Gas Fee</Box>
            <Box textAlign="right">
              {formatNumber(gasFee)}{" "}
              {NODE[chainIdLocally as ChainId].currencySymbol}
              <GasSettings
                gasPrice={gasPrice}
                setGasPrice={setGasPrice}
                gasLimit={gasLimit}
                setGasLimit={setGasLimit}
                priorityFee={priorityFee}
                setPriorityFee={setPriorityFee}
                defaultGasLimit={"" + get(data, "claimTx.gasLimit", 100000)}
              />
            </Box>
          </Flex>
        </>
      )}

      <Button
        onClick={claim}
        colorScheme="primary"
        w="full"
        mt="2"
        isLoading={loading || !!loadingText}
        maxW={{ base: "md", md: "xs", lg: "full" }}
        disabled={disabled || !!loadingText}
        loadingText={loadingText || "Building tx"}
      >
        Claim All
      </Button>
      {commonError && (
        <Text color="red.600" fontSize="sm" mt="2" w="full">
          {commonError}
        </Text>
      )}
    </>
  );
}
