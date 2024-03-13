import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";
import { Token } from "src/config/types";

import SelectTokenModal from "./SelectTokenModal";

// High Performance version
export default function InputAmountV2({
  selectedToken,
  setSelectedToken,
  disabledToken,
  tokens,
  onChange,
  errorMessage,
  value,
  hiddenBalance = false,
  ...props
}: {
  errorMessage?: string;
  value?: string;
  onChange: (value: string) => void;
  [restProp: string]: any;
  balance?: string;
  selectedToken?: Token;
  disabledToken?: Token;
  tokens?: Token[];
  hiddenBalance?: boolean;
}) {
  const inputRef = useRef<any>();

  useEffect(() => {
    if (value !== inputRef.current.value) {
      inputRef.current.value = value;
    }
  }, [value]);

  const onBlur = useCallback(() => {
    if (value === inputRef.current.value) return;
    onChange(inputRef.current.value);
  }, [onChange, value]);

  return (
    <Box width="full">
      <InputGroup>
        <Input
          pr="5.5rem"
          placeholder="Enter Amount"
          height="12"
          fontSize="lg"
          errorBorderColor="red.300"
          borderWidth="1px"
          borderColor={errorMessage ? "red.300" : "transparent"}
          _focus={{ borderColor: errorMessage ? "red.300" : "primary.300" }}
          _active={{ borderColor: errorMessage ? "red.300" : "primary.300" }}
          autoComplete="off"
          ref={inputRef}
          {...props}
          onChange={(event: any) => {
            inputRef.current.value = event.target.value;
          }}
          onBlur={onBlur}
        />
        <InputRightElement w="auto" mr="3" mt="1">
          <SelectTokenModal
            selectedToken={selectedToken}
            tokensList={tokens}
            disabledToken={disabledToken}
            setSelectedToken={setSelectedToken}
          />
        </InputRightElement>
      </InputGroup>
      {errorMessage && (
        <Text ml="2" color="red.300" mt="1">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}
