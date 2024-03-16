import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Center, Flex } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@chakra-ui/modal";
import { useRef } from "react";
import ConfirmSeedWord from "./ConfirmSeedWord";

interface GenerateSeedWordProps {
  render: (onOpen: () => void) => JSX.Element;
  mnemonic: string;
}

const GenerateSeedWord = ({ render, mnemonic }: GenerateSeedWordProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef<any>();

  return (
    <>
      {render(onOpen)}
      <Modal
        onClose={onClose}
        size="full"
        isOpen={isOpen}
        initialFocusRef={initialRef}
      >
        <ModalContent fontSize="md" bg="#0F1010">
          <ModalHeader mt={3}>Secret Recovery Phrase</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" pb="10" pt="0">
            <Flex flexDir="column" justifyContent="center">
              <Center flexDir="column" flex="1">
                <Box>
                  We will give you a list of 12 random words. Please{" "}
                  <Box display="inline" color="yellow.500">
                    write down on paper
                  </Box>{" "}
                  and keep safe.
                </Box>
                <Box mt="4">
                  This paper is{" "}
                  <Box display="inline" color="yellow.500">
                    the only way
                  </Box>{" "}
                  to restore your Wallet if you lose your device or forget your
                  password.
                </Box>
                <Box
                  borderRadius="lg"
                  p="6"
                  mt="10"
                  bg="gray.700"
                  css={{ wordSpacing: "15px" }}
                  color="#F3F8F7"
                >
                  {mnemonic}
                </Box>
              </Center>
              <Box h="40px" mt="auto">
                <ConfirmSeedWord
                  wordList={mnemonic}
                  render={(onOpen) => (
                    <Button
                      colorScheme="primary"
                      w="100%"
                      size="md"
                      onClick={onOpen}
                      ref={initialRef}
                    >
                      Next
                    </Button>
                  )}
                />
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GenerateSeedWord;
