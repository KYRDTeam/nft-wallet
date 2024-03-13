import React, { ReactElement } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Button, useDisclosure } from "@chakra-ui/react";

export default function Confirm({
  title = "Are you sure?",
  content = "",
  render,
  onConfirm,
}: {
  title?: string | ReactElement;
  content?: string | ReactElement;
  render: (onOpen: () => void) => React.ReactElement;
  onConfirm: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {render(onOpen)}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader textAlign="center" pt="8">
            {title}
          </ModalHeader>
          <ModalCloseButton bg="transparent" border="0" color="white" />
          <ModalBody px="6" textAlign="center">
            {content}
          </ModalBody>
          <ModalFooter py="10" justifyContent="space-evenly">
            <Button
              w="40"
              colorScheme="gray"
              mr={3}
              onClick={onClose}
              color="white"
            >
              Cancel
            </Button>
            <Button
              w="40"
              colorScheme="primary"
              onClick={() => {
                onClose();
                onConfirm();
              }}
            >
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
