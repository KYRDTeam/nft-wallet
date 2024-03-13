import { Button } from "@chakra-ui/button";
import { useClipboard, useDisclosure } from "@chakra-ui/hooks";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Link, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { useEffect, useState } from "react";
import { ReactComponent as CopyIconSvg } from "../../assets/images/icons/copy.svg";
import { NODE } from "../../config/constants/chain";
import useCustomToast from "../../hooks/useCustomToast";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { globalSelector } from "../../store/global";
import { removeWallet, walletsSelector } from "../../store/wallets";
import { ellipsis } from "../../utils/formatBalance";
import { ReactComponent as AddWalletSVG } from "../../assets/images/icons/watch-wallet.svg";
import { TextDeep } from "../../theme";
import AddWatchedWalletModal from "./AddWatchedWallet";

const ListWalletsModal = ({
  render,
}: {
  render: (onOpen: () => void) => JSX.Element;
}) => {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [copiedWallet, setCopiedWallet] = useState<string>();
  const { hasCopied, onCopy } = useClipboard(copiedWallet || "");
  const toast = useCustomToast();

  useEffect(() => {
    if (copiedWallet) {
      onCopy();
      setCopiedWallet(undefined);
    }
  }, [copiedWallet, onCopy, setCopiedWallet]);

  useEffect(() => {
    if (hasCopied) {
      toast({
        status: "success",
        title: "Copied!",
      });
    }
  }, [hasCopied, toast]);

  const { wallets } = useAppSelector(walletsSelector);

  return (
    <>
      {render(onOpen)}
      <Modal onClose={onClose} size="sm" isOpen={isOpen} isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent px="5">
          <ModalHeader textAlign="center" pt="7" pb="0">
            Manage Wallets
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {wallets.length === 0 && (
              <Center mt="7" flexDir="column">
                <AddWalletSVG />
                <TextDeep mt="5">
                  Your list of watched wallets is empty
                </TextDeep>
              </Center>
            )}
            {wallets.map((wallet) => (
              <Flex
                alignItems="center"
                justify="space-between"
                mt="5"
                key={wallet.address}
              >
                <Box>
                  <Text mb="1" textTransform="capitalize">
                    {wallet.name}
                  </Text>

                  <Text fontSize="sm" color="whiteAlpha.600">
                    <Link
                      href={`${NODE[chainId].scanUrl}/address/${wallet.address}`}
                      isExternal
                    >
                      {ellipsis(wallet.address, 14, 10)}
                    </Link>
                  </Text>
                </Box>
                <Center gridGap="3">
                  <Tooltip label="Click to copy" placement="top">
                    <Box
                      as={CopyIconSvg}
                      cursor="pointer"
                      onClick={() => setCopiedWallet(wallet.address)}
                    />
                  </Tooltip>
                  <AddWatchedWalletModal
                    name={wallet.name}
                    address={wallet.address}
                    render={(onOpen) => (
                      <Tooltip label="Click to edit" placement="top">
                        <EditIcon
                          onClick={onOpen}
                          boxSize="3"
                          color="whiteAlpha.700"
                          cursor="pointer"
                        />
                      </Tooltip>
                    )}
                  />
                  <Tooltip label="Click to delete" placement="top">
                    <DeleteIcon
                      onClick={() => dispatch(removeWallet(wallet.address))}
                      boxSize="3"
                      color="whiteAlpha.600"
                      cursor="pointer"
                    />
                  </Tooltip>
                </Center>
              </Flex>
            ))}
          </ModalBody>
          <ModalFooter my="6">
            <AddWatchedWalletModal
              render={(onOpen) => (
                <Button onClick={onOpen} w="100%">
                  <AddIcon mr="3" />
                  Add watched wallet
                </Button>
              )}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListWalletsModal;
