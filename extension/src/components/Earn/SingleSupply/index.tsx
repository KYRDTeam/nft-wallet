import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import InputAmount from "src/components/common/InputAmount";
import { useAppSelector } from "src/hooks/useStore";
import { EarnToken, Platform } from "src/config/types";
import { Button } from "@chakra-ui/button";
import { useTokenAllowance } from "src/hooks/useTokenAllowance";
import { SMART_WALLET_PROXY } from "src/config/constants/contracts";
import { globalSelector } from "src/store/global";
import ApproveTokenModal from "src/components/common/ApproveTokenModal";
import { NODE } from "src/config/constants/chain";
import { useWallet } from "src/hooks/useWallet";
import ConnectWallet from "src/components/Sidebar/ConnectWallet";
import { SlideFade } from "@chakra-ui/transition";
import useSetSupplyUrl from "../useSetSupplyUrl";
import { ArrowDownIcon } from "src/components/icons";
import { earnSelector } from "src/store/earn";
import SupplyConfirmModal from "./SupplyConfirmModal";
import SelectPlatform from "../SelectPlatform";

const SingleSupply = ({ setIsSingleSupply }: { setIsSingleSupply: (f: boolean) => void }) => {
  const { chainId } = useAppSelector(globalSelector);
  const { earnList } = useAppSelector(earnSelector);
  const { account } = useWallet();
  const [amount, setAmount] = useState("");

  const [token, setToken] = useState<EarnToken>();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>();
  const [error, setError] = useState("");

  useSetSupplyUrl({ destToken: token, setDestToken: setToken });

  const tokenAllowance = useTokenAllowance(token?.address, SMART_WALLET_PROXY[chainId]);

  const isNativeToken = useMemo(
    () => NODE[chainId].address.toLowerCase() === token?.address.toLowerCase(),
    [token, chainId],
  );

  useEffect(() => {
    if (!selectedPlatform) {
      setSelectedPlatform(token?.overview[0]);
    }
  }, [token, selectedPlatform]);

  const isValidForSupply = token && amount;

  useEffect(() => {
    setError("");
  }, [amount, chainId, account, token?.address]);

  const handleOpenConfirmModal = useCallback(
    (onOpenModal) => {
      if (account?.toLowerCase() !== account) {
        setError("Please switch to the imported wallet to make the transaction.");
      } else if (token && +amount > +token?.humanizeBalance) {
        setError("Insufficient balance.");
      } else if (isValidForSupply) onOpenModal();
    },
    [isValidForSupply, account, token, amount],
  );

  return (
    <Box>
      <Box mb="4">Enter the amount</Box>
      <InputAmount
        value={amount}
        selectedToken={token as any}
        setSelectedToken={setToken as any}
        tokens={earnList as any}
        onChange={setAmount}
        onMax={() => setAmount(token?.humanizeBalance || "")}
        balance={token?.formattedBalance}
      />

      <Flex fontSize="xs" mt="5">
        If you don’t have {token?.symbol}, you can
        <Text color="primary.200" ml="1" cursor="pointer" onClick={() => setIsSingleSupply(false)}>
          Swap Now
        </Text>
      </Flex>

      <Center my="5">
        <ArrowDownIcon />
      </Center>

      <SelectPlatform token={token} selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />

      <Box mt="8" />
      <ConnectWallet
        renderConnectBtn={(onOpen) => (
          <Button w="100%" colorScheme="primary" onClick={onOpen}>
            Connect wallet
          </Button>
        )}
        renderWalletInfo={
          <>
            {isNativeToken || +tokenAllowance > 0 ? (
              <SupplyConfirmModal
                token={token as any}
                amount={amount}
                platform={selectedPlatform}
                render={(onOpen) => (
                  <Button
                    w="100%"
                    colorScheme="primary"
                    disabled={!isValidForSupply}
                    onClick={() => {
                      handleOpenConfirmModal(onOpen);
                    }}
                  >
                    Supply
                  </Button>
                )}
              />
            ) : (
              <ApproveTokenModal
                srcAmount={amount}
                srcToken={token as any}
                render={(onOpen) => (
                  <Button
                    w="100%"
                    colorScheme="primary"
                    disabled={!isValidForSupply}
                    onClick={() => {
                      handleOpenConfirmModal(onOpen);
                    }}
                  >
                    Approve
                  </Button>
                )}
              />
            )}
          </>
        }
      />

      <SlideFade in={!!error} offsetY="5px">
        <Center color="red.400" fontSize="sm" mt="3" textAlign="center">
          {error}
        </Center>
      </SlideFade>
    </Box>
  );
};

export default SingleSupply;
