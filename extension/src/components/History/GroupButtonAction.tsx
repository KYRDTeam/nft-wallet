import React, { useState } from "react";

import { Flex } from "@chakra-ui/layout";

import { Button } from "@chakra-ui/react";
import GasSettings from "../common/GasSettings/index";
import { useDisclosure } from "@chakra-ui/hooks";
// import { getHigherGasFee } from "../../utils/web3";
import { GAS_LIMIT_DEFAULT } from "src/config/constants/constants";

type DataTxProps = {
  to: string;
  value: string;
  nonce: number;
  data: string;
  gasLimit: string;
};

const GroupButtonAction = ({
  data,
  type = "default",
  closeModalTx,
}: {
  data: any;
  type?: string;
  closeModalTx?: (e?: any, type?: string) => void;
}) => {
  const [gasPrice, setGasPrice] = useState<string | undefined>(data.gasPrice);
  const [priorityFee, setPriorityFee] = useState<string | undefined>(data.priorityFee);
  const [gasLimit, setGasLimit] = useState<string>(data.gasLimit);
  const [dataTx, setDataTx] = useState<DataTxProps>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const styleButton: any = {
    small: {
      h: "6",
      maxW: "60px",
      fontSize: "10px",
      mr: 3,
    },
    default: {
      maxW: "150px",
    },
  };

  return (
    <>
      <Flex alignItems="center" justifyContent="space-around">
        <Button
          w="100%"
          borderRadius={16}
          mr="5"
          colorScheme="primary"
          {...styleButton[type]}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
            setDataTx({
              to: data.to,
              value: data.value,
              nonce: data.nonce,
              data: data.data,
              gasLimit: data.gasLimit,
            });
          }}
        >
          Speed up
        </Button>
        <Button
          w="100%"
          borderRadius={16}
          colorScheme="primary"
          {...styleButton[type]}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
            setDataTx({
              to: data.from,
              value: "0",
              nonce: data.nonce,
              data: data.data,
              gasLimit: data.gasLimit,
            });
          }}
        >
          Cancel Tx
        </Button>
      </Flex>
      <GasSettings
        onCloseCustom={onClose}
        isOpenCustom={isOpen}
        onOpenCustom={onOpen}
        gasPrice={gasPrice}
        setGasPrice={setGasPrice}
        gasLimit={gasLimit}
        setGasLimit={setGasLimit}
        priorityFee={priorityFee}
        setPriorityFee={setPriorityFee}
        defaultGasLimit={GAS_LIMIT_DEFAULT}
        dataTx={dataTx}
        isCustomSetting
        closeModalTx={closeModalTx}
        customGasLimit
      />
    </>
  );
};

export default GroupButtonAction;
