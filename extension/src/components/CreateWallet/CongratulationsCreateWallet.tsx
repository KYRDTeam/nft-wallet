import { Image, useDisclosure } from "@chakra-ui/react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@chakra-ui/modal";
import { Button } from "@chakra-ui/button";
import { useAppDispatch } from "src/hooks/useStore";
import { useCallback, useRef } from "react";
import { setVault } from "src/store/keys";
import CongratulationImg from "src/assets/images/illus/congratulations.svg";

interface CongratulationsCreateWalletProps {
  render: (onOpen: () => void) => JSX.Element;
  vault: { vault: string };
}

const CongratulationsCreateWallet = ({ render, vault }: CongratulationsCreateWalletProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  const initialRef = useRef<any>();

  const submit = useCallback(async () => {
    dispatch(setVault(vault));
  }, [dispatch, vault]);

  return (
    <>
      {render(onOpen)}
      <Modal onClose={onClose} size="full" isOpen={isOpen} initialFocusRef={initialRef}>
        <ModalContent fontSize="md" bg="black">
          <ModalHeader mt={3}>Congratulations</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" pb="10" pt="0">
            <Flex flexDir="column" justifyContent="center">
              <Image src={CongratulationImg} alt="congratulations-create-wallet" />
              <Text>
                You have completed all of your steps properly. Keep your Secret Recovery Phrase safe, it's your
                responsibility!
              </Text>
              <Text color="whiteAlpha.500" mt={2}>
                *We cannot recover your Secret Recovery Phrase.
              </Text>
              <Box h="40px" mt="auto">
                <Button colorScheme="primary" w="100%" size="md" onClick={submit} ref={initialRef}>
                  Done
                </Button>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CongratulationsCreateWallet;
