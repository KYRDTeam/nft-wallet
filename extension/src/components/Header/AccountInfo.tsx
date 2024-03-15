import { Flex, Text, Image } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
// import { CopyIcon } from "@chakra-ui/icons";
import { Tag } from "src/theme";
import AccountDetailModal from "src/components/Header/AccountDetailModal";
import { useClipboard } from "@chakra-ui/hooks";
import { useWallet } from "src/hooks/useWallet";
import { ellipsis } from "src/utils/formatBalance";
import { useAppSelector } from "src/hooks/useStore";
import { keysSelector } from "src/store/keys";
import Copy from "src/assets/images/icons/copy.svg";
// import { trustedAppsSelector } from "../../store/trustedApps";
import useGetPageInfo from "src/hooks/useGetPageInfo";
import { WalletIcon } from "../common/icons";
import { EditIcon } from "@chakra-ui/icons";

const AccountInfo = () => {
  const { account } = useWallet();
  const { accountsName } = useAppSelector(keysSelector);
  const { hasCopied, onCopy } = useClipboard(account || "");
  // const { trustedApps } = useAppSelector(trustedAppsSelector);
  const { pageInfo } = useGetPageInfo();

  return (
    <Flex
      alignItems="center"
      mt={1}
      mb={2}
      mx={2}
      pr={3}
      py={1}
      bg="#1E2020"
      justify="space-between"
      borderRadius="12px"
    >
      <AccountDetailModal
        render={(onOpen) => (
          <Tag
            px="3"
            cursor="pointer"
            onClick={onOpen}
            fontSize="sm"
            display="flex"
            mr={4}
            bg="#1E2020"
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
            <WalletIcon stroke="#ffffff" boxSize={4} mr={2} />
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
            mr={2}
            w="4"
            h="4"
            cursor="pointer"
            onClick={onCopy}
          />
        </Tooltip>
        <Tooltip label="Click to edit" placement="top">
          <EditIcon boxSize={4} color="whiteAlpha.600" cursor="pointer" />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default AccountInfo;
