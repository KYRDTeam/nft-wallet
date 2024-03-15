import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Flex, Text } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrice } from "src/hooks/useTokens";
import { NODE } from "../../../config/constants/chain";
import { GasType } from "../../../config/types";
import { useAppSelector } from "../../../hooks/useStore";
import { globalSelector } from "../../../store/global";
import { calculateTxFee, formatNumber } from "../../../utils/helper";
import AdvancedGasTab from "./AdvancedGasTab";
import BasicGasSettingTab from "./BasicGasSettingTab";
import SpeedUpGas from "./SpeedUpGas";

interface GasSettingsProps {
  gasPrice?: string;
  priorityFee?: string;
  gasLimit?: string;
  defaultGasLimit?: string;
  setGasPrice: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPriorityFee: React.Dispatch<React.SetStateAction<string | undefined>>;
  setGasLimit: (e?: any) => void;
  upGas?: number;
  dataTx?: {
    to: string;
    value: string;
    data: string;
    nonce: number;
    gasLimit: string;
  };
  onCloseCustom?: () => void;
  onOpenCustom?: () => void;
  isOpenCustom?: boolean;
  isCustomSetting?: boolean;
  closeModalTx?: (e?: any, type?: string) => void;
  isTypeCustom?: boolean;
  customGasLimit?: boolean;
}

export default function GasSettings({
  gasPrice,
  priorityFee,
  gasLimit,
  defaultGasLimit,
  setGasPrice,
  setPriorityFee,
  setGasLimit,
  dataTx,
  onCloseCustom,
  onOpenCustom,
  isOpenCustom,
  isCustomSetting,
  closeModalTx,
  isTypeCustom = false,
  customGasLimit = false,
}: GasSettingsProps) {
  const { chainId } = useAppSelector(globalSelector);
  const { gasPrices, priorityFees, baseFee } = useAppSelector(globalSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gasType, setGasType] = useState<GasType>("Super Fast");
  const [isCustomGasLimit, setIsCustomGasLimit] = useState(customGasLimit);
  const [error, setError] = useState("");

  const { getPrice } = usePrice();

  const nativeUsdPrice = getPrice(NODE[chainId].address);

  const gasPricesList = useMemo(
    () =>
      gasPrices
        ? [
            { type: "Super Fast", value: gasPrices.superFast.toString() },
            { type: "Fast", value: gasPrices?.fast },
            { type: "Standard", value: gasPrices?.standard },
            { type: "Low", value: gasPrices?.low },
          ]
        : [],
    [gasPrices],
  );

  useEffect(() => {
    if (gasType !== "Custom") {
      setGasPrice(Number(gasPricesList.find((g) => g.type === gasType)?.value).toString());
    }
  }, [gasType, gasPricesList, setGasPrice]);

  useEffect(() => {
    if (!isCustomGasLimit) setGasLimit(defaultGasLimit);
  }, [defaultGasLimit, setGasLimit, isCustomGasLimit]);

  const priorityFeesList = useMemo(
    () =>
      priorityFees
        ? [
            { type: "Super Fast", value: priorityFees.superFast },
            { type: "Fast", value: priorityFees?.fast },
            { type: "Standard", value: priorityFees?.standard },
            { type: "Low", value: priorityFees?.low },
          ]
        : [],
    [priorityFees],
  );

  useEffect(() => {
    if (gasType !== "Custom") {
      setPriorityFee(Number(priorityFeesList.find((g) => g.type === gasType)?.value).toString());
    }
  }, [priorityFeesList, gasType, setPriorityFee]);

  const resetGas = useCallback(() => {
    setGasLimit(defaultGasLimit);
    setGasType("Standard");
    setGasPrice(gasPrices?.standard);
    setPriorityFee(priorityFees?.standard);
  }, [defaultGasLimit, gasPrices?.standard, priorityFees?.standard]); //eslint-disable-line

  const closeModal = useCallback(() => {
    if (error) {
      resetGas();
    }
    onClose();
    !!onCloseCustom && onCloseCustom();
  }, [error, onClose, resetGas, onCloseCustom]);

  const maxFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

  const estimatedFee = useMemo(() => {
    if (gasPrice && defaultGasLimit && priorityFee !== undefined && baseFee) {
      const price = +priorityFee + +baseFee;
      return calculateTxFee(Math.min(price, +gasPrice), defaultGasLimit);
    }
    return calculateTxFee(gasPrice || 0, defaultGasLimit || 0);
  }, [gasPrice, defaultGasLimit, priorityFee, baseFee]);

  const PropsModal = useMemo(() => {
    let propsModal: any = {};
    if (!!dataTx && isOpenCustom && onCloseCustom && onOpenCustom) {
      propsModal = { isOpen: isOpenCustom, onClose: onCloseCustom, onOpen: onOpenCustom };
    }
    return propsModal;
  }, [dataTx, isOpenCustom, onCloseCustom, onOpenCustom]);

  return (
    <div>
      <>
        {!isCustomSetting && (
          <Button colorScheme="primary" bg="transparent" variant="link" onClick={onOpen}>
            EDIT
          </Button>
        )}

        <Modal isOpen={isOpen} onClose={closeModal} size="full" {...PropsModal} isCentered>
          <ModalOverlay backdropFilter="blur(3px) !important;" />
          <ModalContent width="100%" maxWidth="400px" bgColor="gray.900">
            <ModalHeader textAlign="left" py="8" pb="0">
              Transaction Setting
            </ModalHeader>
            <ModalCloseButton top="32px" bg="transparent" border="0" color="white" />
            <ModalBody px="8">
              <Tabs colorScheme="primary">
                <TabList>
                  <Tab _focus={{ boxShadow: "none" }}>Basic</Tab>
                  <Tab _focus={{ boxShadow: "none" }}>Advanced</Tab>
                </TabList>

                {NODE[chainId].EIP1559 && (
                  <Flex justify="center" align="center" direction="column" mt="7">
                    <Text>Estimated GAS fee (Gwei)</Text>
                    <Text fontSize="2xl">
                      ~ {formatNumber(estimatedFee)} {NODE[chainId].currencySymbol}
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="sm">
                      Max fee: {formatNumber(maxFee)} {NODE[chainId].currencySymbol} ~ ${" "}
                      {formatNumber(+maxFee * nativeUsdPrice, 2)}
                    </Text>
                  </Flex>
                )}
                <TabPanels mt="3">
                  <TabPanel>
                    <BasicGasSettingTab
                      gasPricesList={gasPricesList}
                      gasPrice={gasPrice}
                      setGasPrice={setGasPrice}
                      gasLimit={defaultGasLimit}
                      setGasLimit={setGasLimit}
                      gasType={gasType}
                      setGasType={setGasType}
                    />
                  </TabPanel>
                  <TabPanel>
                    <AdvancedGasTab
                      gasPrice={gasPrice}
                      setGasPrice={setGasPrice}
                      gasLimit={gasLimit}
                      setGasLimit={setGasLimit}
                      setIsCustomGasLimit={setIsCustomGasLimit}
                      error={error}
                      setError={setError}
                      gasType={gasType}
                      setGasType={setGasType}
                      priorityFee={priorityFee}
                      setPriorityFee={setPriorityFee}
                      defaultGasLimit={defaultGasLimit}
                      onClose={closeModal}
                      isCustomSetting={isCustomSetting}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
              {!!dataTx && (
                <SpeedUpGas
                  gasPrice={gasPrice}
                  priorityFee={priorityFee}
                  gasType={gasType}
                  onCancel={closeModal}
                  dataTx={dataTx}
                  closeModalTx={closeModalTx}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
}
