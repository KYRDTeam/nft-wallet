import { Box, Collapse, Flex, Image, Text } from "@chakra-ui/react";
import { ellipsis } from "src/utils/formatBalance";
import { useAppSelector } from "src/hooks/useStore";
import { enableTBA, keysSelector, setSelectedAccount } from "src/store/keys";
import { useAppDispatch } from "src/hooks/useStore";
import { useCallback } from "react";
import { fetchNetWorth } from "src/store/wallets";
import { useWallet } from "src/hooks/useWallet";
import CopyBtn from "../common/CopyBtn";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChevronDownIcon, ChevronUpIcon, EditIcon } from "@chakra-ui/icons";
import ChainIcon from "../icons/Chain";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
} from "@chakra-ui/react";
// import { CopyIcon } from "@chakra-ui/icons";
import { setAccountsTBA } from "src/store/keys";
import { createTBA } from "src/utils/tba";
import { globalSelector } from "src/store/global";
import { Tooltip } from "@chakra-ui/tooltip";
import PureLogo from "../../assets/images/logos/nft-wallet-pure.svg";

interface AccountProps {
  account: string;
  accountName: string;
  key: string;
  onClose: () => void;
}

export const Account = ({ account, accountName, onClose }: AccountProps) => {
  const { selectedAccount, accountsTBA } = useAppSelector(keysSelector);
  const dispatch = useAppDispatch();
  const { account: currentAccount } = useWallet();
  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onClose: onCloseModal,
    onOpen: onOpenModal,
  } = useDisclosure();
  const { chainId } = useAppSelector(globalSelector);

  const handleSelect = useCallback(() => {
    if (currentAccount !== account) {
      dispatch(setSelectedAccount(account));
      dispatch(fetchNetWorth({ address: account, isForceSync: false }));
    }
    onClose();
  }, [account, currentAccount, dispatch, onClose]);

  const handleSelectTBA = useCallback(
    (address: string) => {
      dispatch(enableTBA({ account, address }));
      dispatch(setSelectedAccount(address));
      dispatch(fetchNetWorth({ address, isForceSync: false }));
      onClose();
    },
    [account, dispatch, onClose]
  );

  const handleCreateTBA = useCallback(async () => {
    // const address = await createTBA(chainId);
    // dispatch(
    //   setAccountsTBA({
    //     account: account || "",
    //     address,
    //     tba: false,
    //     chainId: chainId,
    //   })
    // );
  }, [account, chainId, dispatch]);

  return (
    <Flex
      direction="column"
      bg="#0F1010"
      borderRadius="16px"
      px={4}
      pb={2}
      my={2}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        cursor="pointer"
        py={2}
        borderBottom="1px dashed"
        borderColor="whiteAlpha.300"
      >
        <Box
          cursor="pointer"
          onClick={handleSelect}
          width="200px"
          maxW="200px"
          overflow="hidden"
          fontSize={15}
          transition="all .3s ease 0s"
        >
          <Flex align="center">
            <Image src={PureLogo} w={5} h={5} />
            <Text display="block" fontSize="16px" mx={1}>
              {accountName}
            </Text>
            <Tooltip label="Click to edit" placement="top">
              <EditIcon boxSize="3" color="whiteAlpha.700" cursor="pointer" />
            </Tooltip>
          </Flex>
          <Flex align="center">
            <Text
              color="#fff"
              opacity={0.5}
              fontSize="16px"
              mr={1}
            >{`${ellipsis(account, 10, 5)}`}</Text>
            <CopyBtn data={account} />
          </Flex>
        </Box>
        <Flex
          align="center"
          justify="center"
          borderRadius="full"
          w={5}
          h={5}
          border="1px solid"
          borderColor="whiteAlpha.600"
          background={
            selectedAccount === account ? "primary.200" : "transparent"
          }
        >
          {selectedAccount === account && (
            <Flex
              align="center"
              justify="center"
              borderRadius="full"
              w={2}
              h={2}
              border="1px solid"
              borderColor="white"
            />
          )}
        </Flex>
      </Flex>
      <Flex
        onClick={onToggle}
        align="center"
        justify="space-between"
        cursor="pointer"
        mt={2}
      >
        <Flex>
          Smart Accounts
          {accountsTBA?.[account]?.length && (
            <Text ml={1} borderRadius="8px" background="#1E2020" px={1.5}>
              {accountsTBA?.[account]?.length}
            </Text>
          )}
        </Flex>
        {isOpen ? (
          <ChevronUpIcon boxSize={5} />
        ) : (
          <ChevronDownIcon boxSize={5} />
        )}
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        {accountsTBA?.[account]?.map((item) => (
          <Flex
            align="center"
            justifyContent="space-between"
            py={1}
            px={2}
            cursor="pointer"
            onClick={() => handleSelectTBA(item?.address)}
            borderRadius="12px"
            border="1px solid"
            borderColor="whiteAlpha.300"
            mt={2}
          >
            <Flex align="center">
              <Text
                color="#fff"
                opacity={0.5}
                fontSize="16px"
                mr={1}
              >{`${ellipsis(item?.address, 10, 5)}`}</Text>
              <CopyBtn data={item?.address} />
              <ChainIcon chainId={item?.chainId} boxSize={3.5} ml={1} />
            </Flex>
            <Flex
              align="center"
              justify="center"
              borderRadius="full"
              w={4}
              h={4}
              border="1px solid"
              borderColor="whiteAlpha.600"
              background={
                selectedAccount === item?.address && item?.isEnabled
                  ? "primary.200"
                  : "transparent"
              }
              mr={1}
            >
              {selectedAccount === item?.address && item?.isEnabled && (
                <Flex
                  align="center"
                  justify="center"
                  borderRadius="full"
                  w={2}
                  h={2}
                  border="1px solid"
                  borderColor="white"
                />
              )}
            </Flex>
          </Flex>
        ))}
        <Flex
          align="center"
          justify="center"
          onClick={onOpenModal}
          cursor="pointer"
          mt={2}
          fontWeight="semibold"
        >
          <Image
            src="data:image/png;base64,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"
            w={4}
            h={4}
            mr={2}
            cursor="pointer"
            onClick={onOpenModal}
          />
          Create Smart Account
        </Flex>
      </Collapse>
      <Modal isOpen={isOpenModal} onClose={onCloseModal} isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bg="black">
          <ModalHeader textAlign="center" pt="4" fontSize="xl">
            Confirm Create TBA Account
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            px="8"
            pb={4}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button colorScheme="primary" onClick={handleCreateTBA}>
              Create
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
