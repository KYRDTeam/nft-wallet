import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Flex,
  Text,
  Button,
  Image,
  Avatar,
} from "@chakra-ui/react";

import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useMemo, useState } from "react";
import { useAppSelector } from "src/hooks/useStore";
import { ellipsis } from "src/utils/formatBalance";
import { IconSend } from "./icons/IconSend";
import { IconBin } from "./icons/IconBin";
import { IconEdit } from "./icons/IconEdit";
import New from "./New";
import Edit from "./Edit";
import EmptyContact from "src/assets/images/icons/empty_contact.svg";
import { contactSelector, removeContact } from "src/store/contact";
import { useAppDispatch } from "src/hooks/useStore";
import { useHistory } from "react-router-dom";

const DEFAULT = "default";
const NEW = "new";
const EDIT = "edit";

export const ManageContact = ({ render }: { render: (onOpen: () => void) => JSX.Element }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [accountSelected, setAccountSelected] = useState<any>(null);
  const [typeModal, setTypeModal] = useState(DEFAULT);
  const { contacts } = useAppSelector(contactSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const title = useMemo(() => {
    switch (typeModal) {
      case NEW:
        return "Add a New Contact";
      case EDIT:
        return "Edit Contact";
      case DEFAULT:
        return "Manage Contact";
      default:
        return "Manage Contact";
    }
  }, [typeModal]);

  const handleDelete = (id: string) => {
    if (!id) {
      return;
    }
    dispatch(removeContact(id));
  };

  const handleClose = () => {
    setAccountSelected(null);
    setTypeModal(DEFAULT);
  };

  return (
    <>
      {render(onOpen)}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          handleClose();
          onClose();
        }}
        isCentered
        size="full"
      >
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent w="400px" maxWidth="100%" bgColor="gray.900">
          {typeModal !== DEFAULT && (
            <ChevronLeftIcon
              position="absolute"
              left="20px"
              top="26px"
              boxSize={8}
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                setAccountSelected(null);
                setTypeModal(DEFAULT);
              }}
            />
          )}
          <ModalHeader textAlign={typeModal === DEFAULT ? "left" : "center"} px="5" py="7">
            {title}
          </ModalHeader>
          {typeModal === DEFAULT && <ModalCloseButton top="26px" right="10px" />}
          <ModalBody px="5">
            {typeModal === DEFAULT && (
              <>
                <Box h={"calc(100vh - 200px)"} overflow="scroll">
                  {!contacts.length && (
                    <Box mt="100px">
                      <Flex justifyContent="center" alignItems="center">
                        <Image src={EmptyContact} alt="empty contact" w="100px" h="100px" />
                      </Flex>
                      <Text fontSize="sm" textAlign="center" color="#A4ABBB" mt="6">
                        Your contact is empty
                      </Text>
                    </Box>
                  )}

                  {!!contacts.length &&
                    contacts.map((contact: any) => {
                      return (
                        <Flex
                          alignItems="center"
                          wordBreak="break-word"
                          py={3}
                          borderRadius={4}
                          _hover={{ bg: "gray.900", cursor: "pointer" }}
                          key={contact.id}
                        >
                          <Avatar name={contact.name || "<unknown>"} mr="2" boxSize="9" />

                          <Box w="100%">
                            <Text
                              noOfLines={1}
                              title={contact.name || "<unknown>"}
                              color={contact.name ? "whiteAlpha.900" : "whiteAlpha.500"}
                            >
                              {contact.name || "<unknown>"}
                            </Text>
                            <Flex justifyContent="space-between" alignItems="center">
                              <Text opacity="0.75" fontSize="sm">
                                {ellipsis(contact.address, 20, 5)}
                              </Text>
                              <Flex>
                                <Box
                                  mr="2"
                                  _hover={{
                                    color: "primary.300",
                                    stroke: "primary.300",
                                    svg: { stroke: "primary.300" },
                                  }}
                                  onClick={() => history.push(`/transfer?address=${contact.address}`)}
                                >
                                  <IconSend />
                                </Box>

                                <Box
                                  mr="2"
                                  _hover={{
                                    color: "primary.300",
                                    stroke: "primary.300",
                                    svg: { stroke: "primary.300" },
                                  }}
                                  onClick={() => {
                                    setTypeModal(EDIT);
                                    setAccountSelected(contact);
                                  }}
                                >
                                  <IconEdit />
                                </Box>

                                <Box
                                  mr="2"
                                  _hover={{
                                    color: "primary.300",
                                    stroke: "primary.300",
                                    svg: { stroke: "primary.300" },
                                  }}
                                  onClick={() => handleDelete(contact.id)}
                                >
                                  <IconBin />
                                </Box>
                              </Flex>
                            </Flex>
                          </Box>
                        </Flex>
                      );
                    })}
                </Box>
                <Button
                  variant="outline"
                  w="100%"
                  my="6"
                  onClick={() => {
                    setTypeModal(NEW);
                  }}
                >
                  + Add Contact
                </Button>
              </>
            )}

            {typeModal === NEW && <New handleClose={handleClose} />}
            {!!accountSelected && typeModal === EDIT && <Edit data={accountSelected} handleClose={handleClose} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
