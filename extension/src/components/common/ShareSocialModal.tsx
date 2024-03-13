import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
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
import { useState } from "react";
import {
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { ReactComponent as ShareIconSvg } from "src/assets/images/icons/social_network/icon_share.svg";

export default function ShareSocialModal(props: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCopied, setCopied] = useState(false);

  return (
    <>
      <Button onClick={onOpen} p="0" bg="transparent" h="6" w="4" _hover={{ bg: "transparent" }} mt="-2">
        <ShareIconSvg stroke="#fff" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader textAlign="center">Share your referral</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text mb="2">Share this link via:</Text>
              <TelegramShareButton url={props.url} title={props.content} className="btn-react-share">
                <TelegramIcon />
              </TelegramShareButton>
              <TwitterShareButton url={props.url} title={props.content} className="btn-react-share">
                <TwitterIcon />
              </TwitterShareButton>
              <WhatsappShareButton url={props.url} title={props.content} separator=":: " className="btn-react-share">
                <WhatsappIcon />
              </WhatsappShareButton>
              <FacebookShareButton url={props.url} quote={props.content} className="btn-react-share">
                <FacebookIcon />
              </FacebookShareButton>

              <Text mt="4">Or copy Link</Text>

              <InputGroup size="md" mt="2">
                <Input pr="4.5rem" value={props.url} disabled />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.5rem"
                    size="sm"
                    onClick={() => {
                      setCopied(true);
                    }}
                    mr="2"
                    borderRadius="10"
                    colorScheme="primary"
                    fontSize="xs"
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
