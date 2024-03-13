import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  SimpleGrid,
  useDisclosure,
  Checkbox,
  Link,
  Box,
} from "@chakra-ui/react";

import { CoinBaseIcon, MetaMaskIcon, WalletConnectIcon } from "../icons";
import { useWallet } from "../../hooks/useWallet";
import { WalletType } from "../../config/types";

type WalletSypportedType = { type: WalletType; name: string; Icon: React.FC };

const WalletSupported: WalletSypportedType[] = [
  { type: WalletType.METAMASK, name: "MetaMask", Icon: MetaMaskIcon },
  { type: WalletType.COINBASE, name: "CoinBase", Icon: CoinBaseIcon },
  {
    type: WalletType.WALLET_CONNECT,
    name: "Wallet Connect",
    Icon: WalletConnectIcon,
  },
];

const ConnectWallet = ({
  renderConnectBtn,
  renderWalletInfo,
}: {
  renderConnectBtn?: (onOpen: () => void) => JSX.Element;
  renderWalletInfo: JSX.Element;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useWallet();
  const [isAllow, setAllow] = useState(false);

  useEffect(() => {
    setAllow(false);
  }, [isOpen, account]);

  const [isConnecting] = useState<boolean>(false);

  const connect = useCallback(async (type: WalletType) => {}, []);

  if (account) return renderWalletInfo;

  return (
    <>
      {renderConnectBtn ? (
        <Box className="open-connect-modal">{renderConnectBtn(onOpen)}</Box>
      ) : (
        <Button
          className="open-connect-modal"
          colorScheme="primary"
          onClick={onOpen}
        >
          Connect wallet
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent borderRadius="12px">
          <ModalHeader px={10} py={6} textAlign="center">
            Import your Wallet
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px={6} pb={10}>
            <Checkbox
              className="import-wallet-rule-checkbox"
              colorScheme="primary"
              checked={isAllow}
              onChange={(event) => {
                setAllow(event.target.checked);
              }}
              marginBottom="4"
            >
              I accept
              <Link
                href="https://files.krystal.app/terms.pdf"
                target="_blank"
                color="primary.200"
                display="inline"
                marginX="1"
              >
                Terms of Use
              </Link>
              and
              <Link
                href="https://files.krystal.app/privacy.pdf"
                target="_blank"
                color="primary.200"
                display="inline"
                marginX="1"
              >
                Privacy Policy
              </Link>
              .
            </Checkbox>
            <Text marginTop="6">Choose Wallet</Text>
            <SimpleGrid columns={2} spacing={5} marginTop="4">
              {WalletSupported.map((wallet: WalletSypportedType) => (
                <Button
                  borderRadius="lg"
                  size="lg"
                  width="full"
                  className="connect-wallet"
                  paddingX={{ base: 2, md: 4 }}
                  justifyContent="flex-start"
                  onClick={() => {
                    connect(wallet.type);
                  }}
                  disabled={!isAllow || isConnecting}
                  key={wallet.type}
                  _hover={{ bg: "gray.500", cursor: "pointer" }}
                >
                  {/* @ts-ignore */}
                  <wallet.Icon boxSize={{ base: 6, md: 8 }} />
                  <Text ml={2} fontSize={{ base: "xs", md: "sm" }}>
                    {wallet.name}
                  </Text>
                </Button>
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConnectWallet;
