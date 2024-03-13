import { useMemo } from "react";
import {
  Button,
  Text,
  Flex,
  Menu,
  MenuButton,
  Center,
  MenuList,
  Link,
  MenuItem,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";

import { ChainIcon } from "../icons";
import { ChainId } from "../../config/types";
import { NODE, SUPPORTED_CHAINS } from "../../config/constants/chain";
import { useWallet } from "../../hooks/useWallet";
import { useAppSelector } from "../../hooks/useStore";
import { globalSelector } from "src/store/global";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";

export default function WalletInformation() {
  const [isMobile] = useMediaQuery("(max-width: 550px)");
  const { tokens } = useChainTokenSelector();
  const { chainId } = useAppSelector(globalSelector);

  const { account, switchChain, deactivate } = useWallet();

  const ethBalance = useMemo(() => {
    if (chainId) {
      return (
        tokens.find(
          (t) =>
            t.address.toLowerCase() ===
            NODE[chainId as ChainId]?.address.toLowerCase()
        )?.formattedBalance || "0"
      );
    }
    return "0";
  }, [tokens, chainId]);

  const accountEllipsis = account
    ? `${account.substring(0, 5)}...${account.substring(account.length - 4)}`
    : null;

  return (
    <Flex>
      <Menu key="1">
        <MenuButton
          bgColor="gray.600"
          rightIcon={<ChevronDownIcon />}
          marginRight="4"
          paddingX="2"
          borderRadius="full"
          as={Button}
        >
          <Flex alignItems="center">
            <ChainIcon
              chainId={chainId || ChainId.MAINNET}
              boxSize={6}
              marginRight="2"
            />
            <Text
              fontSize="sm"
              marginRight="2"
              display={{ base: "none", md: "block" }}
            >
              {NODE[chainId as ChainId].name}
            </Text>
          </Flex>
        </MenuButton>
        <MenuList bgColor="gray.600" width="18">
          {SUPPORTED_CHAINS.map((targetChainId: ChainId) => {
            return (
              <MenuItem
                icon={<ChainIcon chainId={targetChainId} boxSize={6} />}
                justifyContent="flex-start"
                key={targetChainId.toString()}
                disabled={chainId === targetChainId}
                onClick={() => {
                  if (chainId === targetChainId) return;
                  switchChain(targetChainId);
                }}
              >
                <Text fontSize="sm" marginRight="2">
                  {NODE[targetChainId].name}
                </Text>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton>
          <Flex bgColor="gray.700" borderRadius="30px" fontSize={14}>
            {!isMobile && (
              <Center px="4" h="9">
                {+ethBalance} {NODE[chainId as ChainId].currencySymbol}
              </Center>
            )}
            <Center px="4" bgColor="gray.600" borderRadius="18" h="9">
              {accountEllipsis}
            </Center>
          </Flex>
        </MenuButton>
        <MenuList bgColor="gray.600">
          <Link
            href={`${NODE[chainId as ChainId].scanUrl}/address/${account}`}
            _hover={{ textDecoration: "none" }}
            isExternal
          >
            <MenuItem justifyContent="space-between">
              View on {NODE[chainId as ChainId].scanName}
              <ExternalLinkIcon mx="2px" />
            </MenuItem>
          </Link>
          <MenuItem
            onClick={() => {
              deactivate();
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
