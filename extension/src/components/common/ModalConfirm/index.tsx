import React from "react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay } from "@chakra-ui/modal";
import { Button, Flex } from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactElement;
  onConfirm?: () => void;
};

const ModalConfirm = ({ isOpen, onClose, children, onConfirm }: Props) => {
  return (
    <Modal onClose={onClose} size="lg" isOpen={isOpen} isCentered>
      <ModalOverlay backdropFilter="blur(3px) !important;" />
      <ModalContent bg="gray.700" p={3} pb={5}>
        <ModalCloseButton />
        <ModalBody mt="5" textAlign="center">
          {children}
        </ModalBody>
        <ModalFooter>
          <Flex alignItems="center" justifyContent="space-around" w="100%">
            <Button w="100%" borderRadius={16} colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            {!!onConfirm && (
              <Button
                w="100%"
                ml="5"
                borderRadius={16}
                colorScheme="primary"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Confirm
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalConfirm;
