import { useHistory, useParams } from "react-router-dom";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
} from "@chakra-ui/modal";
import { useDisclosure, Text, Button, Box, useToast } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { useWallet } from "src/hooks/useWallet";
import ConnectWallet from "../Sidebar/ConnectWallet";
import { useSign } from "src/hooks/useSign";
import useFetch from "use-http";

const RegisterReferralCode = () => {
  const { referralCode }: { referralCode: string } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const history = useHistory();

  const { sign, isConfirming, error } = useSign();
  const { account } = useWallet();

  const { post: registerReferrer } = useFetch("/v1/account/registerReferrer");

  const registerReferralCode = useCallback(async () => {
    if (!account) {
      onClose();
      return;
    }

    const signature = await sign(referralCode, account, "");

    if (!signature) {
      return;
    }

    const response = await registerReferrer({
      address: account,
      referralCode,
      signature,
    });

    if (response.success) {
      history.push("/");

      toast({
        title: "Success",
        description: "Referral code successfully registered!",
        status: "success",
        duration: 9000,
        isClosable: true,
        variant: "subtle",
        position: "top",
      });
    } else {
      toast({
        title: "Error",
        description: response.error,
        status: "error",
        duration: 9000,
        isClosable: true,
        variant: "subtle",
        position: "top",
      });
    }

    onClose();
  }, [account, history, onClose, referralCode, registerReferrer, sign, toast]);

  useEffect(() => {
    if (referralCode) {
      onOpen();
    }
  }, [onOpen, referralCode]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="12px" pt="4" pb="8" w="sm">
          <ModalHeader textAlign="center">Welcome to Krystal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box textAlign="center">
              <Text fontWeight="bold">
                You can earn rewards by accepting the referral code below
              </Text>
              <Text
                fontWeight="bold"
                fontSize="xl"
                borderRadius="12"
                bg="gray.700"
                display="inline-block"
                px="6"
                py="1"
                my="3"
              >
                {referralCode}
              </Text>
              <Text color="whiteAlpha.600">
                You need to sign the code to accept it <br /> (It's secure &
                doesn't cost any gas fee)
              </Text>

              <Box mt="8">
                <ConnectWallet
                  renderConnectBtn={(onOpen: () => void) => (
                    <Button w="100%" colorScheme="primary" onClick={onOpen}>
                      Connect wallet
                    </Button>
                  )}
                  renderWalletInfo={
                    <Button
                      w="100%"
                      colorScheme="primary"
                      onClick={registerReferralCode}
                      disabled={isConfirming}
                    >
                      Sign & Accept
                    </Button>
                  }
                />
              </Box>
              {error !== "" && (
                <Text color="red.300" mt="2">
                  {error}
                </Text>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RegisterReferralCode;
