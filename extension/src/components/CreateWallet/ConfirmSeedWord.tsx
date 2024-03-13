import { Button } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@chakra-ui/modal";
import { Textarea } from "@chakra-ui/textarea";
import { Field, Form, Formik } from "formik";
import { useCallback, useRef, useState } from "react";
import { sendMessage } from "src/services/extension";
import * as yup from "yup";
import CongratulationsCreateWallet from "./CongratulationsCreateWallet";

const ConfirmSeedWord = ({ render, wordList }: { render: (onOpen: () => void) => JSX.Element; wordList: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [wordCount, setWordCount] = useState(0);
  const [vault, setVault] = useState<{ vault: string }>({ vault: "" });

  const initialRef = useRef<any>();
  const finalRef = useRef<any>();

  const submit = useCallback(async () => {
    const data = await sendMessage({ type: "store_vault" });
    setVault(data);
  }, []);

  return (
    <>
      {render(onOpen)}
      <Modal onClose={onClose} size="full" isOpen={isOpen} initialFocusRef={initialRef} finalFocusRef={finalRef}>
        <ModalContent fontSize="md" bg="black">
          <ModalHeader mt={3}>Confirm Secret Recovery Phrase</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" pb="10" pt="0">
            <Formik
              initialValues={{
                wordList: "",
              }}
              onSubmit={submit}
              validateOnChange={false}
              validationSchema={() => validationSchema(wordList)}
            >
              {({ handleChange, isValid }) => {
                return (
                  <Flex as={Form} flexDir="column" justifyContent="center" mt={10}>
                    <Center flexDir="column">
                      <Box>Please select each phrase in order to make sure it is correct.</Box>
                      <Field name="wordList">
                        {(props: any) => (
                          <FormControl mt="5">
                            <Flex justifyContent="space-between" color="whiteAlpha.500">
                              <Text fontSize="sm">*Separate words with a space</Text>
                              <Text fontSize="sm">Word count: {wordCount}</Text>
                            </Flex>
                            <Textarea
                              ref={initialRef}
                              placeholder="Enter the secret recovery phrase"
                              borderRadius="lg"
                              p="5"
                              h="110px"
                              mt={4}
                              {...props.field}
                              bg="gray.700"
                              onChange={(e: any) => {
                                handleChange(e);
                                setWordCount(e.target.value.split(" ").length);
                              }}
                              color="#F3F8F7"
                            />
                            {props.form.errors.wordList && props.form.touched.wordList && (
                              <Box mt="2" ml="2" color="red.300" fontSize="sm">
                                {props.form.errors.wordList}
                              </Box>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    </Center>
                    <Box h="40px" mt="auto">
                      <CongratulationsCreateWallet
                        render={(onOpen) => (
                          <Button
                            type="submit"
                            colorScheme="primary"
                            w="100%"
                            size="md"
                            onClick={isValid ? onOpen : () => {}}
                          >
                            Confirm
                          </Button>
                        )}
                        vault={vault}
                      />
                    </Box>
                  </Flex>
                );
              }}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmSeedWord;

const validationSchema = (wordList: string) =>
  yup.object().shape({
    wordList: yup
      .string()
      .required("*The secret recovery phrase is required")
      .trim()
      .oneOf([wordList], "*The secret recovery phrase is not match"),
  });
