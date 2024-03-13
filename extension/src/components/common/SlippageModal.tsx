import { useDisclosure } from "@chakra-ui/hooks";
import Icon from "@chakra-ui/icon";
import { Box, Center, Flex } from "@chakra-ui/layout";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { QUICK_SLIPPAGE_OPTIONS } from "src/config/constants/constants";
import { ReactComponent as SettingSvg } from "../../assets/images/icons/setting.svg";
import ModalCommon from "../Modal";

const SlippageModal = ({
  slippage,
  setSlippage,
  isCustomSlippage,
  setIsCustomSlippage,
}: {
  slippage: string;
  setSlippage: (v: string) => void;
  isCustomSlippage: boolean;
  setIsCustomSlippage: (isCustomSlippage: boolean) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customSlippage, setCustomSlippage] = useState<string>("");
  const [copySlippage, setCopySlippage] = useState(slippage);

  useEffect(() => {
    if (Number(customSlippage) > 0) {
      setIsCustomSlippage(true);
      setCopySlippage(customSlippage);
      return;
    }
    setIsCustomSlippage(false);
  }, [customSlippage, setIsCustomSlippage]);

  const warningMessage = useMemo(() => {
    if (Number(copySlippage) <= 0.1) {
      return (
        <Text fontSize="sm" color="yellow.300">
          Your transaction may fail.
        </Text>
      );
    }

    if (Number(copySlippage) >= 10 && Number(copySlippage) <= 50) {
      return (
        <Text fontSize="sm" color="yellow.300">
          Your transaction may be frontrun.
        </Text>
      );
    }

    if (Number(copySlippage) > 50) {
      return (
        <Text fontSize="sm" color="red.400">
          Enter a valid slippage percentage
        </Text>
      );
    }
    return null;
  }, [copySlippage]);

  const handleCancel = () => {
    setCopySlippage(slippage);
    setIsCustomSlippage(!QUICK_SLIPPAGE_OPTIONS.includes(slippage));
    setCustomSlippage(slippage);
    onClose();
  };

  return (
    <>
      <Center
        className="open-slippage-modal"
        onClick={onOpen}
        cursor="pointer"
        bg="gray.600"
        w="42px"
        h="42px"
        borderRadius="50%"
      >
        <Icon as={SettingSvg} stroke="#ffffff" boxSize="6" transition="0.3s" _hover={{ transform: "rotate(30deg)" }} />
      </Center>
      <ModalCommon
        onClose={handleCancel}
        isOpen={isOpen}
        title="Slippage tolerance"
        onCancel={handleCancel}
        onConfirm={() => {
          if (Number(customSlippage) > 0) {
            setIsCustomSlippage(true);
          }

          setSlippage(copySlippage);
          onClose();
        }}
        textCancel="Cancel"
        textConfirm="Confirm"
      >
        <Box px="7" mt="80px" fontSize="sm" fontWeight="500">
          <Flex justifyContent="space-between">
            {QUICK_SLIPPAGE_OPTIONS.map((e) => {
              return (
                <Text
                  key={e}
                  w="64px"
                  h="36px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="md"
                  border="1px solid"
                  borderRadius="14px"
                  borderColor={e === copySlippage ? "primary.200" : "#6A6F6E"}
                  cursor="pointer"
                  onClick={() => {
                    setCustomSlippage("");
                    setCopySlippage(e);
                    setIsCustomSlippage(false);
                  }}
                  _hover={{ opacity: 0.7 }}
                >
                  {e}%
                </Text>
              );
            })}

            <Flex alignItems="center" mt={{ base: 0, md: 0 }}>
              <NumberInput
                onChange={(valueString: any) => {
                  setCustomSlippage(valueString.replace(/(-|\+)+/, ""));
                }}
                value={customSlippage}
                max={50}
                min={0}
                w="24"
                h="36px"
                step={0.5}
                focusBorderColor="primary.300"
                placeholder="0.5"
                allowMouseWheel
                position="relative"
                bgColor="gray.900"
                borderColor={isCustomSlippage ? "primary.300" : "#6A6F6E"}
                fontSize="md"
                _after={{
                  content: "'%'",
                  display: "block",
                  position: "absolute",
                  top: "7px",
                  right: "29px",
                  zIndex: 1,
                }}
              >
                <NumberInputField
                  borderRadius="16"
                  placeholder="0.5"
                  color="white"
                  textAlign="right"
                  pr="42px"
                  fontSize="lg"
                  h="36px"
                  // focusBorderColor="green.300"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
          </Flex>
          <Box height="6" pt="2">
            {warningMessage}
          </Box>
          <Box mt="5" opacity="0.5">
            Your transaction will revert if the price changes unfavorably by more than this percentage.
          </Box>
        </Box>
      </ModalCommon>
    </>
  );
};

export default SlippageModal;
