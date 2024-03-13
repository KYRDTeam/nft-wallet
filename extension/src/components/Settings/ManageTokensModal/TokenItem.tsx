import { Box, Flex, FormControl, Image, Switch, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { DefaultTokenIcon } from "src/components/common/icons";
import TokenTag from "src/components/common/TokenTag";
import { TooltipCommon } from "src/components/common/TooltipCommon";
import { Token, TokenTagType } from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";
import { globalSelector } from "src/store/global";
import { setHideToken } from "src/store/tokens";
import { syncHiddenWorth } from "src/store/wallets";

export const TokenItem = ({
  data,
  ...props
}: {
  data: Token;
  [restProp: string]: any;
}) => {
  const dispatch = useDispatch();
  const { hiddenList } = useChainTokenSelector();
  const { chainId } = useAppSelector(globalSelector);

  const isHidden = useMemo(
    () => hiddenList && hiddenList.includes(data.address.toLowerCase()),
    [data.address, hiddenList]
  );

  const toggleHiddenToken = useCallback(
    (checked: boolean) => {
      dispatch(
        setHideToken({ tokenAddress: data.address, isHidden: !checked })
      );
      dispatch(syncHiddenWorth({ chainId }));
    },
    [dispatch, data.address, chainId]
  );

  return (
    <Flex
      justifyContent="space-between"
      px="4"
      _hover={{ bg: "gray.800" }}
      cursor="pointer"
      borderColor="transparent"
      borderBottomWidth="1px"
      borderBottomColor="whiteAlpha.100"
      {...props}
    >
      <Flex alignItems="center">
        <Flex w="7" justifyContent="center" alignItems="center">
          <Image
            objectFit="cover"
            fallback={<DefaultTokenIcon stroke="whiteAlpha.800" />}
            src={data.logo}
            alt={data.name}
          />
        </Flex>
        <Box ml="3">
          <Flex alignItems="center">
            <Text fontSize="lg" fontWeight="bold" mr="2">
              {data.symbol}
            </Text>
            <Box pos="relative">
              <TokenTag type={data.tag as TokenTagType} />
            </Box>
          </Flex>
          <Text color="whiteAlpha.600">{data.formattedBalance}</Text>
        </Box>
      </Flex>
      <Flex alignItems="center">
        <TooltipCommon label={isHidden ? "show token" : "hide token"}>
          <FormControl width="auto" display="flex" alignItems="center" h="5">
            <Switch
              colorScheme="primary"
              // size={isMobile ? "lg" : "md"}
              isChecked={!isHidden}
              onChange={(event) => {
                toggleHiddenToken(event.target.checked);
              }}
            />
          </FormControl>
        </TooltipCommon>
      </Flex>
    </Flex>
  );
};
