import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { truncate } from "lodash";

import SelectTokenModal from "./SelectTokenModal";
import { Token } from "../../config/types";

type InputAmountPropsType = {
  value: string;
  error?: string;
  message?: string;
  balance?: string;
  selectedToken?: Token;
  disabledToken?: Token;
  disabled?: boolean;
  tokens?: Token[];
  setSelectedToken?: (token: Token) => void;
  onChange: (value: string) => void;
  onMax?: () => void;
  hiddenBalance?: boolean;
};

export default function InputAmount({
  selectedToken,
  setSelectedToken,
  value,
  disabledToken,
  balance,
  error: errorProps,
  message,
  disabled,
  tokens,
  onChange,
  onMax,
  hiddenBalance = false,
}: InputAmountPropsType) {
  const [error, setError] = useState<string>();

  useEffect(() => {
    setError(errorProps);
  }, [errorProps]);

  const handleChangeValue = useCallback(
    (event) => {
      setError("");
      onChange(event.target.value.replace(/,/g, ""));
    },
    [onChange],
  );

  const validateKeyChangeWithNumber = useCallback(
    (event) => {
      if (isNaN(Number(`${value}${event.key}`))) {
        event.preventDefault();
      }
    },
    [value],
  );

  const formatValue = useMemo(() => {
    return value;
    // if (!`${value}`.length) return "";

    // const isDecimalTemp =
    //   `${value}`.match(/^\d*\.?\d*$/) && last(`${value}`) === ".";

    // const typingZeroDecimal = `${value}`.match(/^\d*\.[0]*$/)
    //   ? `.${value.toString().split(".")[1].slice(0, 10)}`
    //   : "";

    // return `${formatCurrency(+value || 0, 10)}${
    //   isDecimalTemp ? "." : typingZeroDecimal
    // }`;
  }, [value]);

  return (
    <Flex direction="column" width="full">
      <InputGroup py="1px">
        <Input
          autoComplete="off"
          bg="#222"
          borderColor="transparent"
          border="1px solid transparent"
          _active={{ borderColor: "primary.300" }}
          borderRadius="2xl"
          borderWidth="1px"
          height="12"
          fontSize="lg"
          onChange={handleChangeValue}
          onKeyPress={validateKeyChangeWithNumber}
          pl={4}
          placeholder="0"
          pr={onMax ? 16 : 4}
          type="text"
          value={formatValue}
          disabled={disabled}
          className="input-amount"
        />
        <InputRightElement
          w="auto"
          px="4"
          height="calc( 100% - 4px )"
          mt="2px"
          right="1px"
          bg="#222"
          borderRadius="2xl"
          className="max-button"
          zIndex={0}
        >
          {onMax && (
            <Button
              borderRadius="4px"
              colorScheme="primary"
              cursor="pointer"
              fontSize="10px"
              height="5"
              onClick={onMax}
              px={2}
            >
              MAX
            </Button>
          )}
          <SelectTokenModal
            selectedToken={selectedToken}
            tokensList={tokens}
            disabledToken={disabledToken}
            setSelectedToken={setSelectedToken}
          />
        </InputRightElement>
      </InputGroup>
      {error && (
        <Text color="red.400" mt="1" pl="2" wordBreak="break-word">
          {truncate(error, { length: 90 })}
        </Text>
      )}
      {!hiddenBalance && balance !== undefined && (
        <Text color="whiteAlpha.700" fontSize="sm" mt="1" pl="2">
          {balance} {selectedToken?.symbol}
        </Text>
      )}
      {message && (
        <Text color="yellow.400" mt="2">
          {message}
        </Text>
      )}
    </Flex>
  );
}
