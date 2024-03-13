import React, { useMemo } from "react";
import { Box, Flex } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { useAppSelector } from "src/hooks/useStore";
import { keysSelector } from "src/store/keys";
import { NiceScroll } from "src/theme";
import { ellipsis } from "src/utils/formatBalance";
import { useWallet } from "src/hooks/useWallet";
import Gravatar from "react-gravatar";

type Props = {
  onSelect: (e?: any) => void;
};

const AccountsInWallet = ({ onSelect }: Props) => {
  const { accountsName } = useAppSelector(keysSelector);
  const { account } = useWallet();

  const listAccount = useMemo(() => {
    return Object.keys(accountsName).filter((accountId) => accountId !== account) || [];
  }, [account, accountsName]);

  return (
    <Flex w="100%" flexDirection="column" mt={3}>
      <Text fontSize="lg" mb={2}>
        Address book
      </Text>
      <Box>
        <NiceScroll maxH="145px" p={0}>
          {listAccount.map((account: any) => (
            // <Box
            // py={1}
            // borderRadius={4}
            // _hover={{ bg: transparentize("primary.300", 0.3), cursor: "pointer" }}
            // key={account}
            // onClick={() => onSelect(account)}
            // >
            //   <Text>{accountsName[account]}</Text>
            //   <Text fontSize="sm" color="gray.400">
            //     {ellipsis(account, 10, 8)}
            //   </Text>
            // </Box>
            <Flex
              alignItems="center"
              wordBreak="break-word"
              py={1}
              borderRadius={4}
              _hover={{ bg: "gray.900", cursor: "pointer" }}
              key={account}
              onClick={() => onSelect(account)}
            >
              <Box as={Gravatar} email={account} size={30} mr="2" borderRadius="50%" protocol="http://" />
              <Box>
                <Box>{accountsName[account] || "Account address"}</Box>
                <Box opacity="0.75" fontSize="sm">
                  {ellipsis(account, 30, 5)}
                </Box>
              </Box>
            </Flex>
          ))}
        </NiceScroll>
        {listAccount.length === 0 && (
          <Text fontSize="xs" fontStyle="italic" mt="2" opacity="0.75" textAlign="center">
            No account added
          </Text>
        )}
      </Box>
    </Flex>
  );
};
export default AccountsInWallet;
