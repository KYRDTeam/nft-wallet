import { InfoIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import ApproveTokenModal from "src/components/common/ApproveTokenModal";
import TokenLogo from "src/components/common/TokenLogo";
import { TooltipCommon } from "src/components/common/TooltipCommon";
import { MULTI_SEND_CONTRACT } from "src/config/constants/contracts";
import { Token } from "src/config/types";
import { useAppSelector } from "src/hooks/useStore";
import { useTokenAllowanceV2 } from "src/hooks/useTokenAllowance";
import { globalSelector } from "src/store/global";
import { formatCurrency } from "src/utils/formatBalance";

export const TokenMultiSendItem = ({
  token,
  amount,
  checkApprove,
  ...props
}: {
  token: Token;
  amount: number;
  checkApprove: (isApproved: boolean) => void;
  [restProps: string]: any;
}) => {
  const { chainId } = useAppSelector(globalSelector);

  const { isApproved, loading, reload } = useTokenAllowanceV2(
    token,
    MULTI_SEND_CONTRACT[chainId],
    amount
  );

  const handleOpenConfirmModal = useCallback((onOpenModal) => {
    onOpenModal();
  }, []);

  useEffect(() => {
    checkApprove(isApproved);
  }, [isApproved, checkApprove, loading]);

  const isInsufficientBalance = useMemo(() => {
    return +token.humanizeBalance < +amount;
  }, [amount, token.humanizeBalance]);

  return (
    <Flex
      justifyContent="space-between"
      px="6"
      py="3"
      borderBottom="1px solid"
      {...props}
    >
      <Flex alignItems="center">
        <TokenLogo src={token.logo} mr="2" />
        <Text fontSize="xl">{token.symbol}</Text>
        <ApproveTokenModal
          srcToken={token as any}
          spender={MULTI_SEND_CONTRACT[chainId]}
          onSuccess={reload}
          render={(onOpen) => (
            <>
              {!isApproved && (
                <Button
                  size="xs"
                  ml="2"
                  colorScheme="primary"
                  isLoading={loading}
                  onClick={() => handleOpenConfirmModal(onOpen)}
                >
                  Approve
                </Button>
              )}
            </>
          )}
        />
      </Flex>
      <Flex
        alignItems="center"
        color={+token.humanizeBalance < +amount ? "red.300" : "whiteAlpha.700"}
      >
        <Text fontSize="xl">{formatCurrency(amount)}</Text>
        {isInsufficientBalance && (
          <TooltipCommon label="Insufficient balance for the transfer">
            <InfoIcon boxSize="4" ml="2" />
          </TooltipCommon>
        )}
      </Flex>
    </Flex>
  );
};
