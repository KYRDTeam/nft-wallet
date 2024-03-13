import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, BoxProps, Center } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Textarea } from "@chakra-ui/textarea";
import { useCallback, useEffect, useState } from "react";
import Rate from "react-rating";
import { rate } from "src/utils/krystalService";
import { ReactComponent as KrystalDino } from "src/assets/images/illus/krystal-dino.svg";
import { trim } from "lodash";
interface RatingProps {
  txHash: string;
}

const Rating = ({ txHash, ...props }: RatingProps & BoxProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [star, setStar] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChangeRate = useCallback(
    (value) => {
      setStar(value);
      onOpen();
    },
    [onOpen]
  );

  useEffect(() => {
    setError("");
  }, [isOpen, content, star]);

  const send = useCallback(async () => {
    try {
      if (star <= 3 && trim(content) === "") {
        setError(
          "Please leave some comments that will help us improve better."
        );
      } else {
        setSubmitting(true);
        const result = await rate(txHash, star, "swap", content);
        if (result) {
          setIsSubmitted(true);
        }
        setSubmitting(false);
      }
    } catch (error: any) {
      setError(error.message);
      setSubmitting(false);
    }
  }, [content, star, txHash]);

  return (
    <Box {...props}>
      <Center opacity="0.7" mb="5">
        How satisfied are you?
      </Center>
      <Rate
        initialRating={star}
        readonly={isSubmitted}
        onChange={handleChangeRate}
        emptySymbol={
          <Box
            className="fas fa-star"
            mx="2"
            fontSize="20px"
            color="whiteAlpha.500"
          />
        }
        fullSymbol={
          <Box
            className="fas fa-star"
            mx="2"
            fontSize="20px"
            color="primary.300"
          />
        }
      />

      <Modal onClose={onClose} size="lg" isOpen={isOpen} isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent bg="gray.700" p={3} pb={5}>
          <ModalCloseButton />
          <ModalBody mt="5">
            {isSubmitted ? (
              <Center flexDir="column">
                <KrystalDino />
                <Button w="150px" mt="10" mb="5" onClick={onClose}>
                  Close
                </Button>
              </Center>
            ) : (
              <>
                <Box textAlign="center">
                  <Center mb="5" fontSize="lg" fontWeight="semibold">
                    How satisfied are you?
                  </Center>
                  <Rate
                    initialRating={star}
                    onChange={handleChangeRate}
                    emptySymbol={
                      <Box
                        className="fas fa-star"
                        mx="2"
                        fontSize="20px"
                        color="whiteAlpha.500"
                      />
                    }
                    fullSymbol={
                      <Box
                        className="fas fa-star"
                        mx="2"
                        fontSize="20px"
                        color="primary.300"
                      />
                    }
                  />
                </Box>

                <Box mt="5" mb="3">
                  Detail valuation
                </Box>
                <Textarea
                  bg="gray.800"
                  border="0"
                  rows={5}
                  onChange={(e) => setContent(e.target.value)}
                />
                {error && (
                  <Box mt="3" fontSize="sm" color="red.300">
                    {error}
                  </Box>
                )}

                <Center mt="5">
                  <Button
                    onClick={send}
                    w="120px"
                    colorScheme="primary"
                    isLoading={submitting}
                    disabled={submitting}
                  >
                    Send
                  </Button>
                </Center>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Rating;
