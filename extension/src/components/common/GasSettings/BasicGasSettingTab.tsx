import React, { useEffect } from "react";

import { Image, Radio, RadioGroup } from "@chakra-ui/react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import infoIcon from "src/assets/images/icons/info.svg";
import { useAppSelector } from "../../../hooks/useStore";
import { globalSelector } from "../../../store/global";
import { calculateTxFee, formatNumber } from "../../../utils/helper";
import { NODE } from "../../../config/constants/chain";
import { TextDeep } from "../../../theme";
import { GasType } from "../../../config/types";

interface GasSettingsProps {
  gasPrice?: string;
  gasLimit?: string;
  gasType: string;
  gasPricesList: { type: string; value: string }[];
  setGasLimit: React.Dispatch<React.SetStateAction<string | undefined>>;
  setGasPrice: React.Dispatch<React.SetStateAction<string | undefined>>;
  setGasType: React.Dispatch<React.SetStateAction<GasType>>;
}

export default function BasicGasSettingTab({
  gasPrice,
  gasLimit,
  gasType,
  gasPricesList,
  setGasLimit,
  setGasPrice,
  setGasType,
}: GasSettingsProps) {
  const { chainId } = useAppSelector(globalSelector);

  useEffect(() => {
    if (!gasPricesList.find((g) => g.value === gasPrice)) {
      setGasType("Custom");
    }
  }, [gasType, gasPrice, setGasType]); // eslint-disable-line

  return (
    <>
      <Box>
        <Flex align="center" mb="4">
          <Text fontSize="sm" mr="1">
            Gas fee (Gwei)
          </Text>
          <Tooltip
            label="Select higher gas fee to accelerate your transaction processing time"
            hasArrow
            placement="top"
            bg="gray.500"
            color="whiteAlpha.700"
          >
            <Image className="pointer" src={infoIcon} alt="Info" boxSize="3" style={{ display: "inline-block" }} />
          </Tooltip>
        </Flex>

        <RadioGroup
          value={gasType}
          onChange={(v: GasType) => {
            setGasType(v);
            setGasPrice(gasPricesList.find((g) => g.type === v)?.value);
            setGasLimit(gasLimit);
          }}
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          {gasPricesList.map((v) => {
            return (
              <Radio
                key={v.type}
                name="gas"
                colorScheme="primary"
                onChange={() => {}}
                value={v.type}
                mb="4"
                alignItems="flex-start"
              >
                <Flex mt="-4px" alignItems="flex-end">
                  <Text mr="2">{v.value}</Text>
                  <TextDeep fontSize="sm" textTransform="uppercase">
                    {v.type}
                  </TextDeep>
                </Flex>
                <Text fontSize="sm">
                  ~ {formatNumber(calculateTxFee(v.value, gasLimit || 0))} {NODE[chainId].currencySymbol}
                </Text>
              </Radio>
            );
          })}
        </RadioGroup>
      </Box>
    </>
  );
}
