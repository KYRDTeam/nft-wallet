import { get, truncate } from "lodash";
import moment from "moment";
import { transparentize } from "@chakra-ui/theme-tools";
import receiveIcon from "src/assets/images/icons/tx-status/receive.svg";
import approveIcon from "src/assets/images/icons/tx-status/approve.svg";
import sendIcon from "src/assets/images/icons/tx-status/send.svg";
import defaultTokenIcon from "src/assets/images/tokens/none.png";
import { ReactComponent as FailedSVG } from "../../assets/images/icons/status-failed.svg";
import { ReactComponent as SupplyIconSVG } from "src/assets/images/icons/supply.svg";
import { ReactComponent as WithdrawIconSVG } from "src/assets/images/icons/widthdraw.svg";
import { ReactComponent as InteractionSVG } from "src/assets/images/icons/tx-status/interaction.svg";
import { Transaction } from "src/config/types";
import { TRANSACTION_TYPES } from "src/config/constants/constants";
import { formatNumber } from "src/utils/helper";
import { ellipsis, getFullDisplayBalance } from "src/utils/formatBalance";
import { Image } from "@chakra-ui/image";
import { useMemo } from "react";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { TextDeep } from "src/theme";
import TransactionDetail from "./TransactionDetail";

export default function TransactionItem({ transaction, isOdd }: { transaction: Transaction; isOdd: boolean }) {
  const displayedData = useMemo(() => {
    switch (transaction.type) {
      case TRANSACTION_TYPES.RECEIVED: {
        return {
          icons: <Image w="18px" src={receiveIcon} alt="" />,
          textMain: `+ ${truncate(
            formatNumber(
              getFullDisplayBalance(
                +get(transaction, "extraData.receiveValue"),
                +get(transaction, "extraData.receiveToken.decimals"),
              ),
              4,
            ).toString(),
            { length: 20 },
          )} ${
            get(transaction, "extraData.receiveToken.symbol") ||
            get(transaction, "extraData.receiveToken.name", "(unknown)")
          }`,
          textSub: `From: ${ellipsis(transaction.from)}`,
          action: "RECEIVED",
          className: "blue.300",
        };
      }
      case TRANSACTION_TYPES.APPROVAL: {
        return {
          icons: <Image w="18px" src={approveIcon} alt="" />,
          textMain: (
            <Text>
              {get(transaction, "extraData.token.name")} ({get(transaction, "extraData.token.symbol")})
            </Text>
          ),
          textSub: `Spender: ${ellipsis(get(transaction, "extraData.spender"))}`,
          action: "APPROVAL",
          className: "green.300",
        };
      }
      case TRANSACTION_TYPES.TRANSFER: {
        return {
          icons: <Image w="18px" src={sendIcon} alt="" />,
          textMain: `- ${formatNumber(
            getFullDisplayBalance(
              get(transaction, "extraData.sendValue"),
              +get(transaction, "extraData.sendToken.decimals"),
            ),
            4,
          )} ${
            get(transaction, "extraData.sendToken.symbol") || get(transaction, "extraData.sendToken.name", "(unknown)")
          }`,
          textSub: `To: ${ellipsis(transaction.to)}`,
          action: "TRANSFER",
          className: "purple.300",
        };
      }
      case TRANSACTION_TYPES.SWAP: {
        const sendToken = get(transaction, "extraData.sendToken", {});
        const receiveToken = get(transaction, "extraData.receiveToken", {});

        return {
          icons: (
            <Box pos="relative">
              <Image src={sendToken?.logo} fallbackSrc={defaultTokenIcon} w="18px" borderRadius="50%" />
              <Image
                pos="absolute"
                src={receiveToken?.logo}
                fallbackSrc={defaultTokenIcon}
                w="18px"
                borderRadius="50%"
                right="-5px"
                bottom="-4px"
              />
            </Box>
          ),

          textMain: `${formatNumber(
            getFullDisplayBalance(
              get(transaction, "extraData.sendValue", 0),
              +get(transaction, "extraData.sendToken.decimals"),
            ),
            4,
          )} ${
            get(transaction, "extraData.sendToken.symbol") || get(transaction, "extraData.sendToken.name", "(unknown)")
          } → ${formatNumber(
            getFullDisplayBalance(
              get(transaction, "extraData.receiveValue", 0),
              +get(transaction, "extraData.receiveToken.decimals"),
            ),
            4,
          )} ${
            get(transaction, "extraData.receiveToken.symbol") ||
            get(transaction, "extraData.receiveToken.name", "(unknown)")
          }`,
          textSub: ellipsis(transaction.to),
          action: "SWAP",
          className: "yellow.400",
        };
      }
      case TRANSACTION_TYPES.SUPPLY: {
        return {
          icons: <SupplyIconSVG />,
          textMain: `- ${formatNumber(
            getFullDisplayBalance(
              get(transaction, "extraData.sendValue", 0),
              +get(transaction, "extraData.sendToken.decimals"),
            ),
            4,
          )} ${
            get(transaction, "extraData.sendToken.symbol") || get(transaction, "extraData.sendToken.name", "(unknown)")
          }`,
          textSub: ellipsis(transaction.to),
          action: "SUPPLY",
          className: "primary.300",
        };
      }
      case TRANSACTION_TYPES.WITHDRAW: {
        return {
          icons: <WithdrawIconSVG />,

          textMain: `+ ${formatNumber(
            getFullDisplayBalance(
              get(transaction, "extraData.receiveValue", 0),
              +get(transaction, "extraData.receiveToken.decimals"),
            ),
            4,
          )} ${
            get(transaction, "extraData.receiveToken.symbol") ||
            get(transaction, "extraData.receiveToken.name", "(unknown)")
          }`,
          textSub: ellipsis(transaction.to),
          action: "WITHDRAW",
          className: "withdraw",
        };
      }
      default: {
        return {
          icons: <Box as={InteractionSVG} w="18px" stroke="gray.700" />,
          textMain: "—/—",
          textSub: ellipsis(transaction.to),
          action: "CONTRACT EXECUTION",
          className: "interaction",
        };
      }
    }
  }, [transaction]);

  return (
    <TransactionDetail
      transaction={transaction}
      textMain={displayedData.textMain}
      action={displayedData.action}
      icons={displayedData.icons}
      render={(open) => (
        <Flex
          px="5"
          py="3"
          bg={isOdd ? "gray.800" : "gray.700"}
          _hover={{ bg: transparentize("primary.300", 0.3), cursor: "pointer" }}
          onClick={open}
        >
          <Center>
            <Box className="history__tx-images">{displayedData.icons}</Box>
            <Box ml="5">
              <Box fontSize="md">{displayedData.textMain}</Box>
              <TextDeep fontSize="sm" fontWeight="semibold">
                {displayedData.textSub}
              </TextDeep>
            </Box>
          </Center>
          <Box ml="auto" textAlign="right">
            <Flex justify="flex-end">
              {transaction.status !== "success" && (
                <Center bg={transparentize("red.400", 0.2) as any} w="72px" h="22px" borderRadius="lg">
                  <FailedSVG width="12px" />
                  <Text ml="1" fontSize="xs" color="red.400">
                    Failed
                  </Text>
                </Center>
              )}
              <Box ml="2" fontSize="xs" mb="6px" fontWeight="semibold" color={displayedData.className}>
                {displayedData.action}
              </Box>
            </Flex>
            <TextDeep fontSize="sm" fontWeight="semibold">
              {moment.unix(transaction.timestamp).format("hh:mm A")}
            </TextDeep>
          </Box>
        </Flex>
      )}
    />
  );
}
