import { Button } from "@chakra-ui/button";
import { InputGroup, InputRightAddon } from "@chakra-ui/input";
import { Box, Flex } from "@chakra-ui/layout";
import { ModalFooter } from "@chakra-ui/modal";
import { useEffect, useMemo, useState } from "react";
import { formatNumber, toGwei } from "src/utils/helper";
import { NODE } from "../../../config/constants/chain";
import { GasType } from "../../../config/types";
import { useAppSelector } from "../../../hooks/useStore";
import { globalSelector } from "../../../store/global";
import InputCustom from "../Input";

interface GasSettingsProps {
  gasPrice?: string;
  priorityFee?: string;
  gasLimit?: string;
  defaultGasLimit?: string;
  gasType: GasType;
  error: string;
  setGasPrice: React.Dispatch<React.SetStateAction<string | undefined>>;
  setGasLimit: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPriorityFee: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsCustomGasLimit: React.Dispatch<React.SetStateAction<boolean>>;
  setGasType: React.Dispatch<React.SetStateAction<GasType>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  isCustomSetting?: boolean;
}

export default function AdvancedGasTab({
  gasPrice,
  gasLimit,
  defaultGasLimit,
  priorityFee,
  error,
  setGasPrice,
  setPriorityFee,
  setGasLimit,
  onClose,
  setIsCustomGasLimit,
  setGasType,
  setError,
  isCustomSetting,
}: GasSettingsProps) {
  const { chainId } = useAppSelector(globalSelector);
  const { gasPrices, priorityFees, baseFee } = useAppSelector(globalSelector);
  const initGasLimit = useMemo(() => defaultGasLimit, [defaultGasLimit]);
  const initGasPrice = useMemo(() => gasPrices?.standard || "0", [gasPrices]);
  const initPriorityFee = useMemo(() => priorityFees?.standard || "0", [priorityFees]);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (gasLimit !== initGasLimit) {
      setIsCustomGasLimit(true);
    } else {
      setIsCustomGasLimit(false);
    }
  }, [initGasLimit, gasLimit, setIsCustomGasLimit]);

  useEffect(() => {
    setError("");
    setWarning("");
    if (!NODE[chainId].EIP1559) return;
    if (!gasPrice) {
      setError("Max fee cannot be blank");
    } else if (!gasLimit) {
      setError("Gas limit cannot be blank");
    } else if (+gasLimit < 21000) {
      setError("Gas limit should be higher than 21000");
    } else if (!priorityFee) {
      if (priorityFee === "") setError("Max priority fee cannot be blank");
    } else if (+priorityFee > +gasPrice) {
      setError("Max fee cannot be lower than max priority fee");
    } else if (+priorityFee > +gasPrice) {
      setError("Max fee cannot be lower than max priority fee");
    } else if (+baseFee > +gasPrice) {
      setError(`Max fee should be higher than base fee(${baseFee} Gwei)`);
    } else if (+priorityFee > +initPriorityFee) {
      setWarning("Max priority fee is higher than necessary. You may pay more than needed.");
    } else if (+priorityFee < +initPriorityFee) {
      setWarning("Max priority fee is low for current network conditions.");
    } else if (+gasPrice > +initGasPrice) {
      setWarning("Max fee is higher than necessary.");
    } else if (+gasPrice < +initGasPrice) {
      setWarning("Max fee too low for network conditions.");
    }
  }, [priorityFee, gasPrice, baseFee, gasLimit, chainId, initGasPrice, initPriorityFee, setError]);

  return (
    <Box fontSize="sm">
      <Box mb={1}>Gas limit</Box>
      <InputCustom
        placeholder="Gas limit"
        bgColor="#222"
        fontSize="sm"
        type="number"
        value={gasLimit}
        onChange={(e) => setGasLimit(e.target.value)}
      />
      {NODE[chainId].EIP1559 && (
        <>
          <Flex mt={3} mb={1} justify="space-between" alignItems="baseline">
            Max priority fee
            <Box fontSize="xs" opacity="0.6">
              Estimate: {initPriorityFee} Gwei
            </Box>
          </Flex>

          <InputGroup mb={2} bgColor="#222" borderRadius="2xl">
            <InputCustom
              placeholder="Max priority fee"
              fontSize="sm"
              type="number"
              bgColor="#222"
              value={priorityFee}
              onChange={(e) => {
                setPriorityFee(e.target.value);
                setGasType("Custom");
              }}
            />
            <InputRightAddon
              opacity="0.6"
              h="36px"
              ml="auto"
              children={`~ ${formatNumber(+toGwei(priorityFee || 0) * +(gasLimit || 0))} ${
                NODE[chainId].currencySymbol
              }`}
            />
          </InputGroup>
        </>
      )}
      <Flex mt={3} mb={1} justify="space-between" alignItems="baseline">
        {NODE[chainId].EIP1559 ? "Max fee (Gwei)" : "Gas price (Gwei)"}
        <Box fontSize="xs" opacity="0.6">
          Estimate: {initGasPrice} Gwei
        </Box>
      </Flex>
      <InputGroup mb={2} borderRadius="2xl" bgColor="#222">
        <InputCustom
          fontSize="sm"
          type="number"
          bgColor="#222"
          placeholder={NODE[chainId].EIP1559 ? "Max fee" : "Gas price"}
          value={gasPrice}
          onChange={(e) => {
            setGasPrice(e.target.value);
          }}
        />
        <InputRightAddon
          opacity="0.6"
          h="36px"
          ml="auto"
          children={`~ ${formatNumber(+toGwei(gasPrice || 0) * +(gasLimit || 0))} ${NODE[chainId].currencySymbol}`}
        />
      </InputGroup>
      {error && (
        <Box color="red.400" fontSize="xs">
          {error}
        </Box>
      )}
      {warning && (
        <Box color="yellow.400" fontSize="xs">
          {warning}
        </Box>
      )}
      {/* <Divider bg="#4f4f4f" />
      <Flex my={5} alignItems="center" justify="space-between">
        <Box>Custom Nonce:</Box>
        <InputCustom w="150px" placeholder="Nonce" />
      </Flex> */}

      {!isCustomSetting && (
        <ModalFooter py="4" justifyContent="space-around" mt="4">
          <Button
            w="32"
            colorScheme="gray"
            mr={3}
            onClick={() => {
              setGasLimit(initGasLimit);
              setGasType("Standard");
              setGasPrice(initGasPrice);
              setPriorityFee(initPriorityFee);
            }}
            color="white"
          >
            Reset
          </Button>
          <Button w="32" colorScheme="primary" onClick={onClose} disabled={!!error}>
            Save
          </Button>
        </ModalFooter>
      )}
    </Box>
  );
}
