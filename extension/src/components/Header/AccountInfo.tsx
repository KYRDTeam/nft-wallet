import {
  Flex,
  Text,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
} from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
// import { CopyIcon } from "@chakra-ui/icons";
import { Tag } from "src/theme";
import AccountDetailModal from "src/components/Header/AccountDetailModal";
import { useClipboard, useDisclosure } from "@chakra-ui/hooks";
import { useWallet } from "src/hooks/useWallet";
import { ellipsis } from "src/utils/formatBalance";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { keysSelector, setAccountsTBA } from "src/store/keys";
import Copy from "src/assets/images/icons/copy.svg";
// import { trustedAppsSelector } from "../../store/trustedApps";
import useGetPageInfo from "src/hooks/useGetPageInfo";
import { useCallback } from "react";
import { createTBA } from "src/utils/tba";
import { globalSelector } from "src/store/global";

const AccountInfo = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { account } = useWallet();
  const { accountsName } = useAppSelector(keysSelector);
  const { hasCopied, onCopy } = useClipboard(account || "");
  // const { trustedApps } = useAppSelector(trustedAppsSelector);
  const { pageInfo } = useGetPageInfo();
  const { chainId } = useAppSelector(globalSelector);

  const dispatch = useAppDispatch();

  const handleCreateTBA = useCallback(async () => {
    const address = await createTBA(chainId);

    dispatch(
      setAccountsTBA({
        account: account || "",
        address,
        tba: false,
        chainId: chainId
      })
    );
  }, [account, chainId, dispatch]);

  return (
    <Flex alignItems="center" mb={4}>
      <AccountDetailModal
        render={(onOpen) => (
          <Tag
            px="3"
            cursor="pointer"
            onClick={onOpen}
            fontSize="sm"
            display="flex"
            mr={4}
          >
            {/* {!pageInfo?.domain ? (
              <></>
            ) : trustedApps[account || ""]?.find(
                (item: any) => item.domain === pageInfo?.domain
              ) ? (
              <Text
                backgroundColor="#1DE9B6"
                p="1"
                borderRadius="100%"
                mr={2}
              ></Text>
            ) : (
              <Text
                backgroundColor="red.500"
                p="1"
                borderRadius="100%"
                mr={2}
              ></Text>
            )} */}
            {!!pageInfo?.domain && (
              <Text
                backgroundColor="#1DE9B6"
                p="1"
                borderRadius="100%"
                mr={2}
              ></Text>
            )}
            <Text color="#fff" fontSize="16px" mr="10px">
              {account && accountsName[account]}
            </Text>
            <Text color="#fff" opacity={0.5} fontSize="14px">
              {ellipsis(account || "", 9, 4)}
            </Text>
          </Tag>
        )}
      />
      <Flex align="center">
        <Tooltip
          label={hasCopied ? "Copied!" : "Copy"}
          placement="bottom"
          bg="gray.500"
          color="whiteAlpha.700"
          hasArrow
          mt={2}
          closeDelay={500}
          _hover={{
            opacity: 0.7,
          }}
        >
          <Image
            src={Copy}
            alt="copy icon"
            w="4"
            h="4"
            cursor="pointer"
            onClick={onCopy}
          />
        </Tooltip>
        <Tooltip
          label="Upgrade to TBA wallet"
          placement="bottom"
          bg="gray.500"
          color="whiteAlpha.700"
          hasArrow
          mt={2}
          _hover={{
            opacity: 0.7,
          }}
        >
          <Flex background="gray.500" ml={2}>
            <Image
              src="data:image/png;base64,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"
              w={4}
              h={4}
              cursor="pointer"
              onClick={onOpen}
            />
          </Flex>
        </Tooltip>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
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

export default AccountInfo;
