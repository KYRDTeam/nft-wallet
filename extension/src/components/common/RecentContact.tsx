import {
  Avatar,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppSelector } from "src/hooks/useStore";
import { contactSelector } from "src/store/contact";
// import { walletsSelector } from "src/store/wallets";
import { ellipsis } from "src/utils/formatBalance";

export const RecentContact = ({ onSelect }: { onSelect: (address: string) => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { contacts: wallets } = useAppSelector(contactSelector);

  return (
    <>
      <Box mt="6">
        <Flex px="2" mb="2" justifyContent="space-between">
          <Text>Recent Contact</Text>
          {wallets.length >= 3 && (
            <Button variant="link" color="primary.300" onClick={onOpen}>
              MORE
            </Button>
          )}
        </Flex>
        {wallets.length === 0 && (
          <Text fontSize="xs" fontStyle="italic" mt="2" opacity="0.75" textAlign="center">
            No Wallet added
          </Text>
        )}
        {wallets.length > 0 &&
          wallets.slice(0, 3).map((wallet: { name: string; address: string }) => (
            <Flex
              key={wallet.address}
              alignItems="center"
              cursor="pointer"
              _hover={{ bg: "gray.900" }}
              px="2"
              py="1"
              borderRadius="12"
              onClick={() => {
                onSelect(wallet.address);
              }}
            >
              <Avatar name={wallet.name || "<unknown>"} boxSize="9" mr="2" />
              <Box>
                <Text
                  noOfLines={1}
                  title={wallet.name || "<unknown>"}
                  color={wallet.name ? "whiteAlpha.900" : "whiteAlpha.500"}
                  fontSize="sm"
                >
                  {wallet.name || "<unknown>"}
                </Text>
                <Text color="whiteAlpha.500" fontSize="sm">
                  {ellipsis(wallet.address, 26, 5)}
                </Text>
              </Box>
            </Flex>
          ))}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bgColor="gray.900" p="0">
          <ModalCloseButton />
          <ModalHeader textAlign="left" py="4">
            Select Contact
          </ModalHeader>
          <ModalBody fontSize={{ base: "md", md: "lg" }} px="0" height="800px" overflowY="auto">
            {wallets.length > 0 &&
              wallets.map((wallet: { name: string; address: string }) => (
                <Flex
                  key={wallet.address}
                  alignItems="center"
                  cursor="pointer"
                  _hover={{ bg: "gray.800" }}
                  px="6"
                  py="1"
                  onClick={() => {
                    onSelect(wallet.address);
                    onClose();
                  }}
                  borderBottomWidth="1px"
                  borderBottomColor="whiteAlpha.100"
                >
                  <Avatar name={wallet.name || "<unknown>"} boxSize="9" mr="2" />
                  <Box>
                    <Text color={wallet.name ? "whiteAlpha.900" : "whiteAlpha.500"} fontSize="sm">
                      {wallet.name || "<unknown>"}
                    </Text>
                    <Text color="whiteAlpha.500" fontSize="sm">
                      {ellipsis(wallet.address, 26, 5)}
                    </Text>
                  </Box>
                </Flex>
              ))}
          </ModalBody>
          <ModalFooter mb="2" />
        </ModalContent>
      </Modal>
    </>
  );
};
