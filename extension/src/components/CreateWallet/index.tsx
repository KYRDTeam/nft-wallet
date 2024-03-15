import { Box, Button, Center, Image } from "@chakra-ui/react";
import { ReactComponent as Logo } from "src/assets/images/logos/nft-wallet.svg";
import { ReactComponent as LogoPure } from "src/assets/images/logos/krystal-pure.svg";
import { useAppSelector } from "src/hooks/useStore";
import { keysSelector } from "src/store/keys";
import CreatePassword from "./CreatePassword";
import Login from "./Login";
import RestoreAccount from "./RestoreAccount";
import CreateIllu from "src/assets/images/illus/create-illu.svg";

const CreateWallet = () => {
  const { vault, isLoading } = useAppSelector(keysSelector);

  return (
    <>
      {isLoading ? null : (
        <Center h="calc(100vh - 60px)" flexDirection="column" px="8">
          <Logo width="225" height="55" />
          {vault ? (
            <Login />
          ) : (
            <>
              <Image src={CreateIllu} />
              <Box w="100%" fontWeight="semibold" mb="5">
                <CreatePassword
                  render={(open) => (
                    <Button
                      colorScheme="primary"
                      w="100%"
                      size="lg"
                      onClick={open}
                    >
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
                    <Box
                      display="inline"
                      ml="1"
                      color="primary.300"
                      onClick={onOpen}
                      cursor="pointer"
                    >
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
