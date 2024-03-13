import { Image } from "@chakra-ui/image";
import { Box, Center, Flex } from "@chakra-ui/layout";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { Tag } from "@chakra-ui/tag";
import { EarnToken, Platform } from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import { earnSelector } from "src/store/earn";
import { ReactComponent as TractorSVG } from "src/assets/images/icons/tractor.svg";

const SelectPlatform = ({
  selectedPlatform,
  token,
  setSelectedPlatform,
}: {
  selectedPlatform?: Platform;
  token?: EarnToken;
  setSelectedPlatform: (
    value: React.SetStateAction<Platform | undefined>
  ) => void;
}) => {
  const { distributionBalance } = useAppSelector(earnSelector);

  return (
    <Box>
      <Box>Select the platform to supply {token?.symbol}</Box>
      <RadioGroup value={selectedPlatform?.name} colorScheme="primary">
        {token?.overview.map((platform) => (
          <Box key={platform.name}>
            <Center
              bgColor="gray.900"
              borderRadius="2xl"
              px="4"
              py="2"
              mt="4"
              onClick={() => setSelectedPlatform(platform)}
            >
              <Radio value={platform.name}>
                <Center>
                  <Image
                    w="24px"
                    mr="3"
                    src={
                      require(`src/assets/images/platforms/${platform.name}.svg`)
                        .default
                    }
                  />
                  {platform.name}
                </Center>
              </Radio>
              {platform.distributionSupplyRate && (
                <Tag ml="2" colorScheme="primary" size="sm">
                  {(platform.distributionSupplyRate * 100).toFixed(4)} %
                </Tag>
              )}
              <Box ml="auto">{(platform.supplyRate * 100).toFixed(2)}%</Box>
            </Center>

            {platform.distributionSupplyRate && distributionBalance && (
              <Tag
                fontSize="13px"
                colorScheme="primary"
                p="5"
                mt="5"
                borderRadius="2xl"
                lineHeight="20px"
              >
                <Flex>
                  <Box as={TractorSVG} width="100px" mr="3" />
                  You will automatically earn {distributionBalance.symbol} token
                  ({(platform.distributionSupplyRate * 100).toFixed(4)}% APY)
                  for interacting with Venus (supply or borrow). Once redeemed,{" "}
                  {distributionBalance.symbol}
                  token can be swapped to any token.
                </Flex>
              </Tag>
            )}
          </Box>
        ))}
      </RadioGroup>
    </Box>
  );
};

export default SelectPlatform;
