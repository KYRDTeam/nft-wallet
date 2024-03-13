import { useCallback, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useWallet } from "src/hooks/useWallet";
import ConnectWallet from "src/components/Sidebar/ConnectWallet";
import useAuth from "src/hooks/useAuth";

export default function AuthReferral({ message }: { message?: string }) {
  const { account } = useWallet();
  const [error, setError] = useState("");
  const { loading, login } = useAuth();

  const handleLogin = useCallback(() => {
    setError("");
    login();
  }, [login]);

  return (
    <>
      <Flex
        alignItems="center"
        backgroundColor="gray.600"
        borderRadius="16"
        p="6"
      >
        {!!account && (
          <Button
            colorScheme="primary"
            onClick={handleLogin}
            isLoading={loading}
          >
            Login
          </Button>
        )}
        {!account && <ConnectWallet renderWalletInfo={<></>} />}
        <Text ml="4">
          {message ||
            "To proceed with referral program, you need to verify the ownership of your wallet by signing the message."}
        </Text>
      </Flex>
      {error && (
        <Text color="yellow.300" fontStyle="italic" ml="2" mt="1">
          {error}
        </Text>
      )}
    </>
  );
}
