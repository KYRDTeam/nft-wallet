import { Box, Center, Flex, Link, Divider } from "@chakra-ui/layout";
import { useMemo } from "react";

import { NODE } from "src/config/constants/chain";
import { Tag } from "src/theme";
import SelectChain from "../common/SelectChain";
import { ChainIcon } from "../icons";
import { ReactComponent as ExchangeIcon } from "src/assets/images/icons/exchange-icon.svg";
import { ReactComponent as HistorySvg } from "../../assets/images/icons/history.svg";
import { useWallet } from "src/hooks/useWallet";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { lock } from "src/store/keys";
import {
  Button,
  Image,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  Skeleton,
  DrawerFooter,
  Icon,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import Logo from "src/assets/images/logos/nft-wallet.svg";
import ImportIcon from "src/components/icons/menubar/ImportIcon";
import SettingIcon from "src/components/icons/menubar/SettingIcon";
import LockIcon from "src/components/icons/menubar/LockIcon";
import ViewIcon from "src/components/icons/menubar/ViewIcon";
import AddIcon from "src/components/icons/menubar/AddIcon";

import { HamburgerIcon } from "@chakra-ui/icons";
import { keysSelector } from "src/store/keys";
import { Account } from "./Account";
import AddAccountModal from "./AddAccountModal";
import ImportAccountModal from "./ImportAccountModal";
import { NiceScroll } from "src/theme";
import { globalSelector } from "src/store/global";
import { hashSelector } from "src/store/hash";
import AccountInfo from "./AccountInfo";
import { ReactComponent as LogoPure } from "src/assets/images/logos/krystal-pure.svg";
import ExpandView from "../icons/ExpandView";

const Header = () => {
  const dispatch = useAppDispatch();
  const { accountsName } = useAppSelector(keysSelector);
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  // const [isMobile] = useMediaQuery("(max-width: 720px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const { pathname } = useLocation();
  const { hashList } = useAppSelector(hashSelector);

  const filterHashList = useMemo(() => {
    const dataFilter = hashList.filter(
      (e: any) => e.account === account && e.chainId === chainId
    );
    return dataFilter;
  }, [account, hashList, chainId]);

  const handleLock = () => {
    dispatch(lock());
    history.push("/");
    onClose();
  };

  if (!account) {
    return null;
  }
  return (
    <Box px="4">
      <Flex py="4" justify="space-between" alignItems="center">
        <SelectChain
          render={(chainId) => (
            <Tag w="135px" alignItems="center">
              {chainId && <ChainIcon chainId={chainId || 1} boxSize={5} />}
              <Box mx="2">{chainId && NODE[chainId]?.name}</Box>
              <ExchangeIcon />
            </Tag>
          )}
        />
        <Flex>
          <Tag
            pl="5px"
            pr="7px"
            py="2"
            cursor="pointer"
            mr={4}
            borderRadius="100%"
            _hover={{ opacity: "0.7" }}
          >
            <Box as={NavLink} to="/history" position="relative">
              <HistorySvg width="20" stroke="#ffffff" />
              {!!filterHashList.length && (
                <Text
                  backgroundColor="#F45532"
                  p="3px"
                  borderRadius="100%"
                  style={{ position: "absolute", top: "2px", right: "0px" }}
                />
              )}
            </Box>
          </Tag>
          <Center>
            <Tag
              p={2}
              cursor="pointer"
              borderRadius="100%"
              _hover={{ opacity: "0.7" }}
            >
              <Button
                p={0}
                borderRadius="md"
                bg="transparent"
                _hover={{ bg: "transparent" }}
                onClick={onOpen}
                outline="none"
                _focus={{ outline: "none", bg: "transparent" }}
                _active={{ outline: "none", bg: "transparent" }}
                minWidth="unset"
              >
                <HamburgerIcon boxSize="4" strokeWidth={1} color="#ffffff" />
              </Button>
            </Tag>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent
                w="350px"
                maxW="350px"
                height="100vh"
                background="#080808"
              >
                <DrawerCloseButton top="24px" />
                <DrawerHeader py="5" px="7">
                  <Box
                    cursor="pointer"
                    onClick={() => {
                      history.push("/");
                      onClose();
                    }}
                  >
                    <Image src={Logo} alt="Krystal logo" h={10} />
                  </Box>
                </DrawerHeader>
                <Divider />
                <DrawerBody
                  display="flex"
                  flexDirection="column"
                  // justifyContent="space-between"
                  alignItems="flex-start"
                  p={0}
                >
                  <Flex w="100%" flexDirection="column" my={1}>
                    <Flex justify="space-between" px={4} mt={2}>
                      <Text fontSize="md">My Wallets</Text>
                      <Text color="primary.200" cursor="pointer">
                        Manage
                      </Text>
                    </Flex>
                    <NiceScroll maxH="210px" p={0} px={4}>
                      {!!accountsName && (
                        <Box mt={2}>
                          {Object.keys(accountsName).map((account) => (
                            <Account
                              account={account}
                              accountName={accountsName[account]}
                              key={account}
                              onClose={onClose}
                            />
                          ))}
                        </Box>
                      )}
                      {!accountsName && (
                        <Box mt={4}>
                          <Skeleton height="50px" mt="0" mb="2" />
                          <Skeleton height="50px" mt="0" mb="2" />
                          <Skeleton height="50px" mt="0" mb="2" />
                        </Box>
                      )}
                    </NiceScroll>
                  </Flex>
                  <Divider />
                  <Box px={4} pt={6}>
                    <Flex
                      fontWeight="400"
                      cursor="pointer"
                      alignItems="center"
                      _hover={{
                        color: "primary.300",
                        stroke: "primary.300",
                        svg: { stroke: "primary.300" },
                      }}
                      mb={5}
                    >
                      <AddAccountModal
                        render={(onOpen) => (
                          <Flex
                            onClick={onOpen}
                            w="100%"
                            fontWeight="400"
                            alignItems="center"
                          >
                            <AddIcon />
                            <Text ml="2">Create Wallet</Text>
                          </Flex>
                        )}
                        onCloseDrawer={onClose}
                      />
                    </Flex>
                    <Flex
                      fontWeight="400"
                      cursor="pointer"
                      alignItems="center"
                      _hover={{
                        color: "primary.300",
                        stroke: "primary.300",
                        svg: { stroke: "primary.300" },
                      }}
                      mb={5}
                    >
                      <ImportAccountModal
                        render={(onOpen) => (
                          <Flex
                            onClick={onOpen}
                            w="100%"
                            fontWeight="400"
                            alignItems="center"
                          >
                            <ImportIcon />
                            <Text ml="2">Import Wallet</Text>
                          </Flex>
                        )}
                        onCloseDrawer={onClose}
                      />
                    </Flex>
                    <Flex
                      _hover={{
                        color: "primary.300",
                        stroke: "primary.300",
                        svg: { stroke: "primary.300" },
                      }}
                      mb={5}
                    >
                      <Link
                        href={`${NODE[chainId].scanUrl}/address/${account}`}
                        isExternal
                        textDecoration="none !important"
                        fontWeight="400"
                        display="flex"
                        alignItems="center"
                      >
                        <ViewIcon />
                        <Text ml="2">View on {NODE[chainId].scanName}</Text>
                      </Link>
                    </Flex>
                    <Flex
                      onClick={() => global.chrome.runtime.openOptionsPage()}
                      fontWeight="400"
                      cursor="pointer"
                      alignItems="center"
                      color="#ffff"
                      opacity={0.95}
                      _hover={{
                        color: "primary.300",
                        stroke: "primary.300",
                        svg: { stroke: "primary.300" },
                      }}
                      mb={5}
                    >
                      <Icon mr={2} w={4} h={4}>
                        <ExpandView />
                      </Icon>
                      <Text>Expand view</Text>
                    </Flex>
                    <Flex
                      _hover={{
                        color: "primary.300",
                        stroke: "primary.300",
                        svg: { stroke: "primary.300" },
                      }}
                      mb={5}
                    >
                      <Box
                        cursor="pointer"
                        onClick={() => {
                          history.push("/settings");
                          onClose();
                        }}
                        textDecoration="none !important"
                        fontWeight="400"
                        display="flex"
                        alignItems="center"
                      >
                        <SettingIcon />
                        <Text ml="2">Settings</Text>
                      </Box>
                    </Flex>
                    <Flex
                      onClick={handleLock}
                      fontWeight="400"
                      cursor="pointer"
                      alignItems="center"
                      color="#F45532"
                      _hover={{
                        color: "primary.300",
                        stroke: "primary.300",
                        svg: { stroke: "primary.300" },
                      }}
                      mb={5}
                    >
                      <LockIcon />
                      <Text ml="2">Lock Wallet</Text>
                    </Flex>
                  </Box>
                </DrawerBody>
                <DrawerFooter>
                  <Flex fontSize="sm" align="center" justify="center" w="100%">
                    <Box mr="3" fontWeight="semibold">
                      Powered by Krystal
                    </Box>
                    <LogoPure />
                  </Flex>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Center>
        </Flex>
      </Flex>
      {["/"].includes(pathname) && <AccountInfo />}
    </Box>
  );
};

export default Header;
