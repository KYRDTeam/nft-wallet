import { Box, Button, Center } from "@chakra-ui/react";
import { ReactComponent as Logo } from "src/assets/images/logos/krystal.svg";
import { ReactComponent as LogoPure } from "src/assets/images/logos/krystal-pure.svg";
import { useAppSelector } from "src/hooks/useStore";
import { keysSelector } from "src/store/keys";
import CreatePassword from "./CreatePassword";
import Login from "./Login";
import RestoreAccount from "./RestoreAccount";

const CreateWallet = () => {
  const { vault, isLoading } = useAppSelector(keysSelector);

  return (
    <>
      {isLoading ? null : (
        <Center h="calc(100vh - 60px)" flexDirection="column" px="8">
          <Logo width="250" height="55" />
          <Box opacity="0.7" mt="2">
            One Platform, All DeFi
          </Box>
          {vault ? (
            <Login />
          ) : (
            <>
              <Box w="100%" fontWeight="semibold" mt="100px" mb="5">
                <CreatePassword
                  render={(open) => (
                    <Button colorScheme="primary" w="100%" size="lg" onClick={open}>
                      Create New Wallet
                    </Button>
                  )}
                />
              </Box>

              <Box>
                or
                <RestoreAccount
                  case="RESTORE"
                  render={(onOpen) => (
                    <Box display="inline" ml="1" color="primary.300" onClick={onOpen} cursor="pointer">
                      import using Secret Recovery Phrase
                    </Box>
                  )}
                />
              </Box>
            </>
          )}

          <Center mt="auto" pos="absolute" bottom="20px" fontSize="sm">
            <Box mr="3" fontWeight="semibold">
              Powered by Krystal
            </Box>
            <LogoPure />
          </Center>
        </Center>
      )}
    </>
  );
};

export default CreateWallet;
