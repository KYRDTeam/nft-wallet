import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppSelector } from "src/hooks/useStore";
import { IPage, revokeTrustedApp, trustedAppsSelector } from "src/store/trustedApps";
import { useWallet } from "../../hooks/useWallet";
import { NiceScroll } from "src/theme";
import { useAppDispatch } from "../../hooks/useStore";
import { ReactComponent as AppsNotFoundIllu } from "src/assets/images/illus/no-apps.svg";

const TrustedApps = () => {
  const { account } = useWallet();
  const { trustedApps } = useAppSelector(trustedAppsSelector);
  const [listApps, setListApps] = useState<IPage[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const addressKey = account as keyof typeof trustedApps;
    if (account && trustedApps[addressKey]) {
      setListApps(trustedApps[addressKey]);
    } else {
      setListApps([]);
    }
  }, [account, trustedApps]);

  return (
    <Box mx={6}>
      <Text fontWeight="semibold" fontSize="2xl">
        Trusted Apps
      </Text>
      {!listApps.length && (
        <Flex direction="column" justifyContent="center" alignItems="center" mt={20}>
          <AppsNotFoundIllu />
          <Text color="whiteAlpha.600" mt={4}>
            You don't trust any app.
          </Text>
        </Flex>
      )}
      <NiceScroll p={0} mt={2} maxH="400px">
        {listApps &&
          listApps.map((app) => (
            <Flex
              key={app.domain}
              justifyContent="space-between"
              alignItems="center"
              overflow="scroll"
              w="100%"
              my={3}
              bgColor="gray.700"
              borderRadius="16px"
              pl={6}
              pr={3}
              py={3}
              mb={2}
            >
              <Text fontSize="lg">{app.domain}</Text>
              <Button
                bgColor="#FF6E40"
                color="black"
                _hover={{ bgColor: "red.300" }}
                h="35px"
                onClick={() => {
                  if (account && app.domain) {
                    dispatch(revokeTrustedApp({ address: account, domain: app.domain }));
                    setListApps(listApps.filter((a) => a.domain !== app.domain));
                  }
                }}
                borderRadius="12px"
              >
                Revoke
              </Button>
            </Flex>
          ))}
      </NiceScroll>
    </Box>
  );
};

export default TrustedApps;
