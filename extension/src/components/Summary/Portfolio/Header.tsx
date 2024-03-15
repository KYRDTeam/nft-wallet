import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { globalSelector, setPrivateMode } from "src/store/global";
import { PrivatePrice } from "src/components/common/PrivatePrice";
import { formatNumberV2 } from "src/utils/helper";
import { ChainId } from "src/config/types";
import { NODE } from "src/config/constants/chain";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";
import {
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  TransferIcon,
} from "src/components/common/icons";
import { walletsSelector } from "../../../store/wallets";
import QrCodeModal from "./QrCodeModal";
import { ReactComponent as SwapIconSvg } from "src/assets/images/icons/swap.svg";

export const Header = ({
  keyword,
  setKeyword,
}: {
  keyword: string;
  setKeyword: (keyword: string) => void;
}) => {
  const { chainId, isPrivateMode } = useAppSelector(globalSelector);
  const { tokens, isLoadingBalance } = useChainTokenSelector();
  const { totalNetWorth } = useAppSelector(walletsSelector);

  console.log(totalNetWorth);

  const dispatch = useAppDispatch();

  const nativeToken = useMemo(() => {
    return (
      tokens.find(
        (token) => token.address === NODE[chainId as ChainId].address
      ) || null
    );
  }, [chainId, tokens]);

  const usdValue = useMemo(() => {
    if (nativeToken) {
      return formatNumberV2(totalNetWorth?.usdValue, 4);
    } else return "0";
  }, [nativeToken, totalNetWorth?.usdValue]);

  return (
    <Flex
      alignItems="flex-start"
      justifyContent="space-between"
      direction="column"
    >
      <Box alignItems="center" position="relative" w="100%">
        <Flex alignItems="center" justifyContent="center">
          <Flex direction="column" h="100%" justifyContent="flex-end">
            <Flex justify="center" align="center">
              Total Value
              <Flex
                align="center"
                justify="center"
                onClick={() => dispatch(setPrivateMode(!isPrivateMode))}
                ml={2}
                cursor="pointer"
              >
                {isPrivateMode ? (
                  <EyeIcon boxSize={4} />
                ) : (
                  <EyeOffIcon boxSize={4} />
                )}
              </Flex>
            </Flex>
            <Flex
              fontSize="5xl"
              mr="2"
              alignItems="center"
              justifyContent="center"
              direction="column"
            >
              {isLoadingBalance && <Spinner size="xl" mb={2} />}
              {!isLoadingBalance && (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  position="relative"
                  fontSize="4xl"
                  fontWeight="semibold"
                  mt={1}
                  mb={2}
                >
                  <PrivatePrice value={usdValue} currency={"usd"} />
                </Flex>
              )}
            </Flex>
            <Flex alignItems="center" justifyContent="space-around">
              <Flex direction="column" justify="center" align="center">
                <Button
                  w={12}
                  h={12}
                  px={4}
                  mx={4}
                  borderRadius="8px"
                  as={NavLink}
                  to="/transfer"
                  bg="#1E2020"
                >
                  <TransferIcon boxSize="6" stroke="#ffffff" />
                </Button>
                <Text mt={2}>Transfer</Text>
              </Flex>
              <Flex direction="column" justify="center" align="center">
                <QrCodeModal
                  render={(onOpen) => (
                    <Button
                      w={12}
                      h={12}
                      px={4}
                      mx={4}
                      borderRadius="8px"
                      bg="#1E2020"
                      onClick={onOpen}
                    >
                      <DownloadIcon boxSize="6" stroke="#ffffff" />
                    </Button>
                  )}
                />
                <Text mt={2}>Receive</Text>
              </Flex>
              <Flex direction="column" justify="center" align="center">
                <Button
                  w={12}
                  h={12}
                  px={3}
                  mx={4}
                  borderRadius="8px"
                  as={NavLink}
                  to="/swap"
                  bg="#1E2020"
                >
                  <SwapIconSvg stroke="#FFFFFF" />
                </Button>
                <Text mt={2}>Swap</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
