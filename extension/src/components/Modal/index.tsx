import React from "react";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
} from "@chakra-ui/react";

type Props = {
  children: React.ReactElement;
  props?: any;
  isOpen: boolean;
  onClose: (e?: any) => void;
  title: string;
  onConfirm?: (e?: any) => void;
  onCancel?: (e?: any) => void;
  textConfirm?: string;
  textCancel?: string;
};

const ModalCommon = ({
  props,
  children,
  isOpen,
  onClose,
  title,
  onCancel,
  onConfirm,
  textCancel,
  textConfirm,
}: Props) => {
  const hasFooter = textCancel || textConfirm;
  const hasTwoButton = textCancel && textConfirm;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="full" {...props}>
      <ModalOverlay backdropFilter="blur(3px) !important;" />
      <ModalContent w="400px" maxWidth="100%" bgColor="gray.900">
        <ModalHeader p="7">{title}</ModalHeader>
        <ModalCloseButton top="27px" right="17px" bg="transparent" border="0" color="white" />
        <ModalBody p="0" minH="calc(100vh - 200px)">
          {children}
        </ModalBody>
        {hasFooter && (
          <ModalFooter justifyContent="space-between" px="7" mb="5">
            {!!textCancel && (
              <Button minW={hasTwoButton ? "40" : "100%"} colorScheme="gray" mr={3} onClick={onCancel} color="white">
                {textCancel}
              </Button>
            )}
            {textConfirm && (
              <Button minW={hasTwoButton ? "40" : "100%"} colorScheme="primary" onClick={onConfirm}>
                {textConfirm}
              </Button>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCommon;
