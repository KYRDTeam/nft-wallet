import { Box, Flex } from "@chakra-ui/layout";
import { useAppSelector } from "src/hooks/useStore";
import { walletsSelector } from "src/store/wallets";
import Gravatar from "react-gravatar";
import { ellipsis } from "src/utils/formatBalance";
import ListWalletsModal from "../ManageWallets/ListWalletsModal";
import { transparentize } from "@chakra-ui/theme-tools";

// FIXME: pls move to use <RecentContact />
const TransferList = ({
  setRecipientAddr,
}: {
  setRecipientAddr: (s: string) => void;
}) => {
  const { wallets } = useAppSelector(walletsSelector);
  return (
    <Box>
      <Flex justify="space-between" alignItems="baseline" my="5">
        <Box>Contacts</Box>
        <ListWalletsModal
          render={(onOpen) => (
            <Box
              fontSize="sm"
              cursor="pointer"
              color="primary.300"
              onClick={onOpen}
            >
              MORE
            </Box>
          )}
        />
      </Flex>
      {wallets.map((wallet) => (
        <Flex
          mt="3"
          p="2"
          key={wallet.address}
          borderRadius="xl"
          alignItems="center"
          cursor="pointer"
          _hover={{ bg: transparentize("primary.200", 0.1) as any }}
          onClick={() => setRecipientAddr(wallet.address)}
        >
          <Box
            as={Gravatar}
            email={wallet.address}
            size={30}
            borderRadius="50%"
          />
          <Box ml="5">
            <Box>{wallet.name}</Box>
            <Box opacity="0.75" fontSize="sm">
              {ellipsis(wallet.address, 20, 10)}
            </Box>
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default TransferList;
