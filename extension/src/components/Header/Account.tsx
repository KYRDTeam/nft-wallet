import { Box, Flex, Text } from "@chakra-ui/react";
import { ellipsis } from "src/utils/formatBalance";
import { CheckIcon } from "@chakra-ui/icons";
import { useAppSelector } from "src/hooks/useStore";
import { keysSelector, setSelectedAccount } from "src/store/keys";
import { useAppDispatch } from "src/hooks/useStore";
import { useCallback } from "react";
import { fetchNetWorth } from "src/store/wallets";
import { transparentize } from "@chakra-ui/theme-tools";
import { useWallet } from "src/hooks/useWallet";

interface AccountProps {
  account: string;
  accountName: string;
  key: string;
  onClose: () => void;
}

export const Account = ({ account, accountName, onClose }: AccountProps) => {
  const { selectedAccount } = useAppSelector(keysSelector);
  const dispatch = useAppDispatch();
  const { account: currentAccount } = useWallet();

  const handleSelect = useCallback(() => {
    if (currentAccount !== account) {
      dispatch(setSelectedAccount(account));
      dispatch(fetchNetWorth({ address: account, isForceSync: false }));
    }
    onClose();
  }, [account, currentAccount, dispatch, onClose]);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      _hover={{
        bg: transparentize("#1DE9B6", 0.2),
        borderRadius: "16px",
        cursor: "pointer",
      }}
    >
      <Box
        px={5}
        py={2}
        cursor="pointer"
        onClick={handleSelect}
        width="200px"
        maxW="200px"
        overflow="hidden"
        fontSize={15}
        transition="all .3s ease 0s"
      >
        <Text display="block" fontSize="16px" mb={1}>
          {accountName}
        </Text>
        <Text color="#fff" opacity={0.5} fontSize="14px">{`${ellipsis(account, 10, 5)}`}</Text>
      </Box>
      {selectedAccount === account && <CheckIcon color="primary.500" mr={6}></CheckIcon>}
    </Flex>
  );
};
