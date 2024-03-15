import {
  Box,
  Image,
  Flex,
  Center,
  Text,
  Link,
  BoxProps,
  useMediaQuery,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import Logo from "../../assets/images/logos/nft-wallet.svg";
import PureLogo from "../../assets/images/logos/nft-wallet-pure.svg";
import { ReactComponent as ExchangeIcon } from "../../assets/images/icons/exchange-icon.svg";
import { ReactComponent as BellIcon } from "../../assets/images/icons/bell.svg";
import { ReactComponent as SwapSvg } from "../../assets/images/icons/swap.svg";
import { ReactComponent as SummarySvg } from "../../assets/images/icons/summary.svg";
import { ReactComponent as MarketSvg } from "../../assets/images/icons/market.svg";
import { ReactComponent as EarnSvg } from "../../assets/images/icons/earn.svg";
import { ReactComponent as ExploreSvg } from "../../assets/images/icons/explore.svg";
import { ReactComponent as SettingSvg } from "../../assets/images/icons/setting.svg";
import { ReactComponent as CampaignSvg } from "../../assets/images/icons/campaign.svg";
import { ReactComponent as HistorySvg } from "../../assets/images/icons/history.svg";
import { ReactComponent as KrystalPointSvg } from "../../assets/images/icons/refferal_icon.svg";
import { ReactComponent as RocketIconSvg } from "../../assets/images/icons/rocket.svg";

import { ChainIcon } from "../icons";
import { Tag } from "../../theme";
import ImportWalletBox from "./ImportWalletBox";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import SelectChain from "../common/SelectChain";
import { NODE } from "../../config/constants/chain";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector, setCurrency } from "src/store/global";
import { SupportedCurrencyType } from "src/config/types";
import { BASE_CURRENCY } from "src/config/constants/constants";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

interface SidebarProp {
  isOpen?: boolean;
  closedrawer?: () => void;
  onToggle?: () => void;
}

const Sidebar = (props: SidebarProp & BoxProps) => {
  const { isOpen, onToggle, ...restProps } = props;

  const [isMobile] = useMediaQuery("(max-width: 550px)");
  const { chainId, currency } = useAppSelector(globalSelector);
  const dispatch = useDispatch();

  const changeCurrency = useCallback(
    (currency: SupportedCurrencyType) => {
      dispatch(setCurrency(currency));
    },
    [dispatch]
  );

  return (
    <Box
      {...restProps}
      w={isOpen ? "180px" : "64px"}
      bg="gray.700"
      minH="100vh"
      pos="fixed"
      transition="0.3s"
      zIndex="100"
      // overflow="auto"
    >
      <Center py="5" px="4" as={NavLink} to="/">
        {isOpen ? (
          <Image w={134} src={Logo} alt="Krystal logo" />
        ) : (
          <Image src={PureLogo} alt="Krystal logo" />
        )}
      </Center>
      <Box px="4">
        <SelectChain
          render={(chainId) => (
            <Tag
              w="100%"
              p={isOpen ? "2" : "0"}
              justify={isOpen ? "space-between" : "center"}
            >
              <Center flex="none">
                {chainId && <ChainIcon chainId={chainId || 1} boxSize={5} />}
                {isOpen && <Box ml="2">{chainId && NODE[chainId]?.name}</Box>}
              </Center>
              {isOpen && <ExchangeIcon />}
            </Tag>
          )}
        />
      </Box>
      <Flex px="4" mt="4" flexDir={isOpen ? "row" : "column"} gridGap="3">
        <ImportWalletBox isOpen={isOpen} />
        <Link as={NavLink} to="/notifications">
          <Tag borderRadius="12px" px="1">
            <BellIcon />
          </Tag>
        </Link>
      </Flex>

      {!isMobile && (
        <Center
          onClick={onToggle}
          w="24px"
          h="24px"
          borderRadius="50%"
          pos="absolute"
          cursor="pointer"
          mt="10px"
          right="-12px"
          transition="0.3s"
          bg="gray.700"
          border="1px solid black"
          _hover={{ borderColor: "primary.200" }}
        >
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </Center>
      )}

      <Box
        mt="5"
        px="4"
        fontSize={isOpen ? "md" : "0px"}
        _notFirst={{
          a: {
            ":hover , &.active": {
              color: "primary.300",
              stroke: "primary.300",
              svg: { stroke: "primary.300" },
            },
          },
          p: { display: isOpen ? "block" : "none" },
        }}
        maxHeight="calc( 100vh - 300px )"
        overflowY="auto"
      >
        <Flex as={NavLink} to="/summary" py="3" onClick={props.closedrawer}>
          <SummarySvg width="24" stroke="#ffffff" />
          <Text fontWeight="semibold" ml="3">
            Summary
          </Text>
        </Flex>
        <Flex
          as={NavLink}
          to={`/swap?chainId=${chainId}`}
          py="3"
          onClick={props.closedrawer}
        >
          <SwapSvg width="24" stroke="#ffffff" />
          <Text fontWeight="semibold" ml="3">
            Swap
          </Text>
        </Flex>
        <Flex as={NavLink} to="/earn" py="3" onClick={props.closedrawer}>
          <EarnSvg width="24" stroke="#ffffff" />
          <Text fontWeight="semibold" ml="3">
            Earn
          </Text>
        </Flex>
        <Flex
          as={Link}
          href="https://go.krystal.app"
          py="3"
          onClick={props.closedrawer}
          isExternal
        >
          <RocketIconSvg
            width="20"
            height="20"
            stroke="#ffffff"
            fill="#ffffff"
          />
          <Text fontWeight="semibold" ml="3">
            KrystalGo
          </Text>
        </Flex>
        <Flex as={NavLink} to="/explore" py="3" onClick={props.closedrawer}>
          <ExploreSvg width="24" stroke="#ffffff" />
          <Text fontWeight="semibold" ml="3">
            Explore
          </Text>
        </Flex>
        <Flex as={NavLink} to="/market" py="3" onClick={props.closedrawer}>
          <MarketSvg width="24" stroke="#ffffff" />
          <Text fontWeight="semibold" ml="3">
            Market
          </Text>
        </Flex>
        <Flex as={NavLink} to="/history" py="3" onClick={props.closedrawer}>
          <HistorySvg width="24" stroke="#ffffff" />
          <Text fontWeight="semibold" ml="3">
            History
          </Text>
        </Flex>
        <Flex as={NavLink} to="/referral" py="3" onClick={props.closedrawer}>
          <KrystalPointSvg width="20" height="20" stroke="#ffffff" />
          <Text fontWeight="semibold" ml="3">
            Referral
          </Text>
        </Flex>
        <Flex as={NavLink} to="/campaign" py="3" onClick={props.closedrawer}>
          <CampaignSvg width="24" stroke="#ffffff" />
          <Text fontWeight="semibold" ml="3">
            Campaign
          </Text>
        </Flex>
        <Flex as={NavLink} to="/settings" py="3" onClick={props.closedrawer}>
          <SettingSvg width="24" stroke="#ffffff" />
          <Text fontWeight="semibold" ml="3">
            Settings
          </Text>
        </Flex>
      </Box>
      {chainId && currency && (
        <Box pos="fixed" bottom="6" left={isOpen ? 4 : 3}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={
                <ChevronDownIcon display={isOpen ? "block" : "none"} />
              }
              px={isOpen ? 4 : 2}
              w={isOpen ? "120px" : "40px"}
            >
              <Text textAlign="left" textTransform="uppercase">
                {currency}
              </Text>
            </MenuButton>
            <MenuList>
              {BASE_CURRENCY[chainId].map((currency: SupportedCurrencyType) => (
                <MenuItem
                  key={currency}
                  textTransform="uppercase"
                  onClick={() => {
                    changeCurrency(currency);
                  }}
                >
                  <Text>{currency}</Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
