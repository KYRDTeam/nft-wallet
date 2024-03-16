import { Flex, Text } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import { Tag } from "src/theme";
import AccountDetailModal from "src/components/Header/AccountDetailModal";
import { useWallet } from "src/hooks/useWallet";
import { ellipsis } from "src/utils/formatBalance";
import { useAppSelector } from "src/hooks/useStore";
import { keysSelector } from "src/store/keys";
import useGetPageInfo from "src/hooks/useGetPageInfo";
import { WalletIcon } from "../common/icons";
import { EditIcon } from "@chakra-ui/icons";
import CopyBtn from "../common/CopyBtn";

const AccountInfo = () => {
  const { account } = useWallet();
  const { accountsName } = useAppSelector(keysSelector);
  // const { trustedApps } = useAppSelector(trustedAppsSelector);
  const { pageInfo } = useGetPageInfo();

  return (
    <AccountDetailModal
      render={(onOpen) => (
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
          onClick={onOpen}
          cursor="pointer"
        >
          <Tag px="3" fontSize="sm" display="flex" mr={4} bg="#1E2020">
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
          <Flex align="center">
            <CopyBtn data={account || ""} w={4} h={4} mr={2} />
            <Tooltip label="Click to edit" placement="top">
              <EditIcon boxSize={4} color="whiteAlpha.600" cursor="pointer" />
            </Tooltip>
          </Flex>
        </Flex>
      )}
    />
  );
};

export default AccountInfo;
