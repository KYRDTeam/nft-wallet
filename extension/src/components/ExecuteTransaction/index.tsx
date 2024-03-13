import { ArrowForwardIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { useEffect } from "react";
import useCustomToast from "src/hooks/useCustomToast";
import { Tag } from "src/theme";
import { formatCurrency } from "src/utils/formatBalance";
import { formatNumber } from "src/utils/helper";
import GasSettings from "../common/GasSettings";
import InfoField from "../common/InfoField";

const ExecuteTransaction = () => {
  const accountFrom = "0x1234567....87890";
  const accountTo = "0x1234567....87890";
  const URL = process.env.REACT_APP_KRYSTAL_APP_MAINNET || "";
  const amount = 1;
  const chainSymbol = "ETH";
  const transactionOrderNumber = 113;
  const txHash =
    "0x29766a39547790805e276ad0c949dfe6ada20ba120ada33ef2e6574821027e0b";
  const { hasCopied, onCopy } = useClipboard(txHash);
  const toast = useCustomToast();

  useEffect(() => {
    if (hasCopied) {
      toast({
        status: "success",
        title: "Copied!",
      });
    }
  }, [hasCopied, toast]);

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="space-between"
      h="100vh"
    >
      <Box width="100%">
        <Flex justifyContent="space-around" alignItems="center" mt={8}>
          <Tag>{accountFrom}</Tag>
          <ArrowForwardIcon w="20px" h="20px" />
          <Tag>{accountTo}</Tag>
        </Flex>
        <Box bg="gray.700" mt={4} px={7} py={6} borderRadius="13px" mx={4}>
          <Text>{URL}</Text>
          <Flex justifyContent="space-between" alignItems="center" mt={2}>
            <Box border="1px solid" p={2} borderColor="whiteAlpha.600">
              <Text color="primary.300">{`0x1234....7890 : TRANSFER`}</Text>
            </Box>
            <Text fontSize="lg" fontWeight="semibold">
              #{transactionOrderNumber}
            </Text>
          </Flex>
        </Box>
        <Tabs
          align="center"
          orientation="horizontal"
          flexDirection="column"
          mt={1}
        >
          <TabList borderColor="transparent">
            <Tab
              _selected={{
                color: "primary.300",
                borderColor: "primary.300",
              }}
              _focus={{
                outline: "none",
              }}
            >
              DETAILS
            </Tab>
            <Tab
              _selected={{
                color: "primary.300",
                borderColor: "primary.300",
              }}
              _focus={{
                outline: "none",
              }}
            >
              DATA
            </Tab>
            <Tab
              _selected={{
                color: "primary.300",
                borderColor: "primary.300",
              }}
              _focus={{
                outline: "none",
              }}
            >
              HEX
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel px="4" py="0">
              <Box
                width="full"
                backgroundColor="gray.700"
                borderRadius="16"
                px={{ base: 7, md: 8 }}
                py={4}
                textAlign="left"
              >
                <Flex justify="space-between">
                  <Box>Amount to Transfer</Box>
                  <Box textAlign="right">
                    <Box>
                      {formatCurrency(amount)} {chainSymbol}
                    </Box>
                    <Text ml="1" color="whiteAlpha.700" fontSize="sm">
                      ≈ {formatCurrency(1)} USD
                    </Text>
                  </Box>
                </Flex>

                <Box
                  background="gray.800"
                  borderRadius="16"
                  p="6"
                  mt="4"
                  pt="4"
                >
                  <InfoField
                    content={
                      <GasSettings
                        gasPrice={"0.00001"}
                        setGasPrice={() => {}}
                        gasLimit={"0.00001"}
                        setGasLimit={() => {}}
                        priorityFee={"0.00001"}
                        setPriorityFee={() => {}}
                        defaultGasLimit={"0.00001"}
                      />
                    }
                  />
                  <InfoField
                    title="Maximum gas fee"
                    tooltip="The actual cost of the transaction is generally lower than the maximum estimated cost."
                    content={
                      <Text>
                        {formatNumber("0.00001")} {chainSymbol}
                      </Text>
                    }
                  />
                  <InfoField
                    content={
                      <Flex direction="column" alignItems="flex-end">
                        <Text color="whiteAlpha.700" fontSize="sm">
                          ≈ {formatNumber(+0.00001 * 0.00001)} USD
                        </Text>
                        <Text color="whiteAlpha.700" fontSize="sm">
                          {"0.00001"} (Gas Price) * {"0.00001"} (Gas Limit)
                        </Text>
                      </Flex>
                    }
                  />
                </Box>
              </Box>
            </TabPanel>
            <TabPanel px="4" py="0">
              <Box
                width="full"
                backgroundColor="gray.700"
                borderRadius="16"
                px={{ base: 7, md: 8 }}
                py={4}
                textAlign="left"
              >
                <Text>FUNCTION TYPE: Transfer</Text>
              </Box>
            </TabPanel>
            <TabPanel px="4" py="0">
              <Box
                width="full"
                backgroundColor="gray.700"
                borderRadius="16"
                px={{ base: 7, md: 8 }}
                py={4}
                textAlign="left"
              >
                <Text>FUNCTION TYPE: Transfer</Text>
                <Text my={2}>HEX DATA: 68 BYTES</Text>
                <Box
                  bg="gray.600"
                  py={2}
                  px={3}
                  borderRadius={16}
                  _hover={{ bg: "gray.500" }}
                  cursor="pointer"
                  w="100%"
                  onClick={onCopy}
                >
                  {txHash} <CopyIcon />
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <ButtonGroup
        width="100%"
        mb={8}
        display="flex"
        alignItems="center"
        justifyContent="space-around"
      >
        <Button colorScheme="gray" color="white" width="150px">
          Cancel
        </Button>
        <Button colorScheme="primary" width="150px">
          Confirm
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

export default ExecuteTransaction;
