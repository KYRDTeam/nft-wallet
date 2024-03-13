import React, { useCallback, useEffect } from "react";

import { Button } from "@chakra-ui/button";
import { Token } from "src/config/types";
import { SlideFade } from "@chakra-ui/transition";
import { Center } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import { useSendTx } from "../../../hooks/useSendTx";
import { CANCEL, SPEED_UP } from "src/config/constants/constants";

type Props = {
  gasPrice?: string;
  priorityFee?: string;
  onCancel: () => void;
  token?: Token;
  dataTx: {
    to: string;
    value: string;
    nonce: number;
    data: string;
    gasLimit: string;
  };
  gasType?: string;
  closeModalTx?: (e?: any, type?: string) => void;
};

const SpeedUpGas = ({ gasPrice, priorityFee, onCancel, dataTx, closeModalTx }: Props) => {
  const { send, txHash, resetState: resetTransferState, error } = useSendTx();

  const handleConfirm = useCallback(async () => {
    await send({
      to: dataTx.to,
      value: dataTx.value,
      gasPrice,
      gasLimit: dataTx.gasLimit,
      priorityFee,
      nonce: dataTx.nonce,
      data: dataTx.data,
    });
  }, [dataTx, gasPrice, priorityFee, send]);

  useEffect(() => {
    if (!!txHash && !!closeModalTx) {
      let type = SPEED_UP;
      if (dataTx.value === "0") {
        type = CANCEL;
      }
      closeModalTx(txHash, type);
      onCancel();
      resetTransferState();
    }
  }, [closeModalTx, onCancel, resetTransferState, txHash, dataTx]);

  return (
    <>
      <SlideFade in={!!error} offsetY="5px">
        <Center color="red.400" fontSize="sm" mb="2" textAlign="center">
          {error.slice(0, 80)}
        </Center>
      </SlideFade>
      <Flex justifyContent="space-between" w="100%" my="3">
        <Button w="36" colorScheme="gray" onClick={onCancel} color="white">
          Cancel
        </Button>
        <Button w="36" colorScheme="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Flex>
    </>
  );
};

export default SpeedUpGas;
