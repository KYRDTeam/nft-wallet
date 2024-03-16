import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const RestoreNote = ({
  render,
}: {
  render: (onOpen: () => void) => JSX.Element;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {render(onOpen)}
      <Modal onClose={onClose} size="full" isOpen={isOpen}>
        <ModalContent fontSize="md" px={4} bg="#0F1010">
          <ModalHeader>Reset Password Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="whiteAlpha.800">
              We does not keep a copy of your password. If you’re having trouble
              unlocking your account, you will need to reset your wallet. You
              can do this by providing the Secret Recovery Phrase you used when
              you set up your wallet.
            </Text>
            <Text fontSize="sm" mt={4} color="whiteAlpha.800">
              This action will delete your current wallet and Secret Recovery
              Phrase from this device, along with the list of accounts you’ve
              curated. After resetting with a Secret Recovery Phrase, you’ll see
              a list of accounts based on the Secret Recovery Phrase you use to
              reset. This new list will automatically include accounts that have
              a balance. You’ll also be able to re-add any other accounts
              created previously. Custom accounts that you’ve imported will need
              to be re-added, and any custom tokens you’ve added to an account
              will need to be re-added as well.
            </Text>
            <Text fontSize="sm" mt={4} color="whiteAlpha.800">
              Make sure you’re using the correct Secret Recovery Phrase before
              proceeding. You will not be able to undo this.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RestoreNote;
