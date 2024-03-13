import { CheckIcon, ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Center,
  Divider,
  Flex,
  Link,
  Text,
} from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { useWallet } from "../../hooks/useWallet";
import { Tag } from "../../theme";
import ConnectWallet from "./ConnectWallet";
import { ReactComponent as AddIconSvg } from "../../assets/images/icons/add-2.svg";
import { ReactComponent as WalletIconSvg } from "../../assets/images/icons/wallet.svg";
import { ReactComponent as CopyIconSvg } from "../../assets/images/icons/copy.svg";
import { NODE } from "../../config/constants/chain";
import { ChainId } from "../../config/types";
import { usePrevious } from "@chakra-ui/hooks";
import { useCallback, useEffect } from "react";
import ListWalletsModal from "../ManageWallets/ListWalletsModal";
import { ellipsis } from "../../utils/formatBalance";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { globalSelector } from "../../store/global";
import AddWatchedWalletModal from "../ManageWallets/AddWatchedWallet";
import { selectWallet, walletsSelector } from "../../store/wallets";
import { transparentize } from "@chakra-ui/theme-tools";
import { Tooltip } from "@chakra-ui/tooltip";

const ImportWalletBox = ({
  isOpen,
  ...props
}: {
  isOpen?: boolean;
  props?: BoxProps;
}) => {
  const dispatch = useAppDispatch();
  const { account, deactivate, tried } = useWallet();
  const { chainId } = useAppSelector(globalSelector);
  const { wallets, currentWallet } = useAppSelector(walletsSelector);

  const prevAccount = usePrevious(account);

  // auto sync wallet when the account on the metamask is changed
  useEffect(() => {
    if (account) {
      if (!currentWallet || (prevAccount && prevAccount !== account))
        dispatch(selectWallet(account));
    }
  }, [currentWallet, account, prevAccount, dispatch]);

  useEffect(() => {
    if (tried && !account && !!currentWallet) {
      dispatch(selectWallet());
    }
  }, [account, currentWallet, dispatch, tried]);

  const onCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
  }, []);

  return (
    <Menu {...props}>
      <MenuButton className="open-wallets-box">
        {isOpen ? (
          <Tag pl="3" pr="2" fontSize="xs" cursor="pointer">
            <Box mr="2" cursor="pointer">
              {currentWallet
                ? ellipsis(currentWallet || "", 5, 3)
                : "Add wallet"}
            </Box>
            <ChevronDownIcon w="4" />
          </Tag>
        ) : (
          <Tag>
            <Center>
              <WalletIconSvg width="18px" />
            </Center>
          </Tag>
        )}
      </MenuButton>
      <MenuList p="30px" w="300px">
        <ConnectWallet
          renderConnectBtn={(onOpen) => (
            <Box
              cursor="pointer"
              onClick={() => {
                onOpen();
              }}
            >
              <Flex justify="space-between" alignItems="center">
                <Text fontWeight="bold">Imported Wallet</Text>
                {!account && <AddIconSvg stroke="#ffffff" />}
              </Flex>
              <Text fontSize="xs" fontStyle="italic" mt="2" opacity="0.75">
                No Wallet connected
              </Text>
            </Box>
          )}
          renderWalletInfo={
            <>
              <Flex justify="space-between" alignItems="center">
                <Text fontWeight="bold">Imported Wallet</Text>
              </Flex>

              <Flex
                as={MenuItem}
                mt="2"
                alignItems="center"
                cursor="pointer"
                onClick={() => dispatch(selectWallet(account || ""))}
                borderRadius="xl"
                p="2"
                closeOnSelect={true}
                _hover={{
                  backgroundColor: transparentize("primary.300", 0.25),
                }}
              >
                <CheckIcon
                  color="primary.800"
                  mr="3"
                  opacity={
                    account?.toLowerCase() === currentWallet?.toLowerCase()
                      ? 1
                      : 0
                  }
                />
                <Box>
                  <Text fontSize="sm">My wallet</Text>
                  <Flex
                    fontSize="xs"
                    mt="2"
                    color="whiteAlpha.600"
                    alignItems="center"
                  >
                    {ellipsis(account || "", 16, 5)}
                    <Tooltip label="Copy" placement="top" hasArrow>
                      <Box
                        mx="2"
                        cursor="pointer"
                        onClick={(e:any) => {
                          onCopy(account || "");
                          e.stopPropagation();
                        }}
                        _hover={{ color: "red" }}
                      >
                        <CopyIconSvg stroke="#848584" />
                      </Box>
                    </Tooltip>
                    <Tooltip
                      label={`View on ${NODE[chainId].scanName}`}
                      placement="top"
                      hasArrow
                    >
                      <Box
                        as={Link}
                        cursor="pointer"
                        href={`${
                          NODE[chainId as ChainId].scanUrl
                        }/address/${account}`}
                        isExternal
                      >
                        <ExternalLinkIcon
                          boxSize="14px"
                          color="whiteAlpha.700"
                        />
                      </Box>
                    </Tooltip>
                  </Flex>
                </Box>
              </Flex>
            </>
          }
        />

        <Divider my="5" />

        <Flex justify="space-between" alignItems="center">
          <Text fontWeight="bold">Watched Wallets</Text>
          <AddWatchedWalletModal
            render={(onOpen) => (
              <Box cursor="pointer" onClick={onOpen}>
                <AddIconSvg stroke="#ffffff" />
              </Box>
            )}
          />
        </Flex>
        {wallets.length === 0 ? (
          <Text fontSize="xs" fontStyle="italic" mt="2" opacity="0.75">
            No Wallet added
          </Text>
        ) : (
          <>
            {wallets.map((wallet) => (
              <Flex
                as={MenuItem}
                key={wallet.address}
                // mt="5"
                alignItems="center"
                cursor="pointer"
                onClick={() => dispatch(selectWallet(wallet.address))}
                closeOnSelect={true}
                borderRadius="xl"
                p="2"
                _hover={{
                  backgroundColor: transparentize("primary.300", 0.25),
                }}
              >
                <CheckIcon
                  color="primary.800"
                  mr="3"
                  opacity={
                    currentWallet?.toLowerCase() ===
                    wallet.address.toLowerCase()
                      ? 1
                      : 0
                  }
                />
                <Box>
                  <Text fontSize="sm" textTransform="capitalize">
                    {wallet.name}
                  </Text>
                  <Flex
                    fontSize="xs"
                    mt="2"
                    color="whiteAlpha.600"
                    alignItems="center"
                  >
                    {ellipsis(wallet.address || "", 16, 5)}
                    <Tooltip label="Copy" placement="top" hasArrow>
                      <Box
                        mx="2"
                        cursor="pointer"
                        onClick={(e:any) => {
                          onCopy(wallet.address || "");
                          e.stopPropagation();
                        }}
                      >
                        <CopyIconSvg stroke="#848584" />
                      </Box>
                    </Tooltip>
                    <Tooltip
                      label={`View on ${NODE[chainId].scanName}`}
                      placement="top"
                      hasArrow
                    >
                      <Box
                        as={Link}
                        cursor="pointer"
                        href={`${NODE[chainId as ChainId].scanUrl}/address/${
                          wallet.address
                        }`}
                        isExternal
                      >
                        <ExternalLinkIcon
                          boxSize="14px"
                          color="whiteAlpha.700"
                        />
                      </Box>
                    </Tooltip>
                  </Flex>
                </Box>
              </Flex>
            ))}
          </>
        )}

        <Divider my="5" />

        <ListWalletsModal
          render={(onOpen) => (
            <Box
              px="3"
              py="2"
              borderRadius="xl"
              _hover={{ bg: "gray.600" }}
              cursor="pointer"
              onClick={onOpen}
            >
              Manage Wallets
            </Box>
          )}
        />
        {account && (
          <>
            <Divider my="5" />
            <Box
              onClick={() => {
                deactivate();
                dispatch(selectWallet());
              }}
              px="3"
              py="2"
              borderRadius="xl"
              _hover={{ bg: "gray.600" }}
              cursor="pointer"
            >
              Disconnect
            </Box>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export default ImportWalletBox;
