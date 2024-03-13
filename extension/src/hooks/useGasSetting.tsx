import { Box, Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import GasSettings from "src/components/common/GasSettings";
import { NODE } from "src/config/constants/chain";
import { ChainId } from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { calculateTxFee, formatNumber } from "src/utils/helper";

export const useGasSetting = () => {
  const { chainId: chainIdLocally } = useAppSelector(globalSelector);

  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();

  const gasFee = useMemo(
    () => calculateTxFee(gasPrice || 0, gasLimit || 0),
    [gasPrice, gasLimit]
  );

  const view = useMemo(
    () => (
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
            defaultGasLimit="1000000"
          />
        </Box>
      </Flex>
    ),
    [chainIdLocally, gasFee, gasLimit, gasPrice, priorityFee]
  );

  return {
    view,
    gasPrice,
    gasFee,
    priorityFee,
    gasLimit,
    setGasPrice,
    setPriorityFee,
    setGasLimit,
  };
};
