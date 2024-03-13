import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { InfoIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import {
  Box,
  Center,
  Flex,
  Link,
  UnorderedList,
  ListItem,
} from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "src/hooks/useStore";
import { sendMessage } from "src/services/extension";
import { setPassword } from "src/store/keys";
import * as yup from "yup";
import GenerateSeedWord from "./GenerateSeedWord";

const CreatePassword = ({
  render,
}: {
  render: (onOpen: () => void) => JSX.Element;
}) => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mnemonic, setMnemonic] = useState("");

  const initialRef = useRef<any>();
  const finalRef = useRef<any>();

  const submit = useCallback(
    async (values, openSeedWordsModal) => {
      const data = await sendMessage({
        type: "create_new_vault",
        password: values.password,
      });
      setMnemonic(data.mnemonic);
      dispatch(setPassword(values.password));
      openSeedWordsModal();
    },
    [dispatch]
  );

  return (
    <>
      {render(onOpen)}
      <Modal
        onClose={onClose}
        size="full"
        isOpen={isOpen}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <ModalContent bg="black">
          <ModalHeader mt={3}>Create New Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" pb="10" pt="0">
            <GenerateSeedWord
              mnemonic={mnemonic}
              render={(onOpen) => (
                <Formik
                  initialValues={{
                    password: "",
                    passwordConfirm: "",
                    acceptTerm: false,
                  }}
                  onSubmit={(values) => submit(values, onOpen)}
                  validationSchema={validationSchema}
                >
                  {(props) => (
                    <Flex as={Form} w="100%" flexDir="column">
                      <Center flexDir="column" flex="1">
                        <Field name="password">
                          {(props: any) => (
                            <FormControl mt="4">
                              <FormLabel htmlFor="password">
                                New password{" "}
                                <Tooltip
                                  label={
                                    <UnorderedList>
                                      <ListItem>
                                        Minimum password length of 8 characters
                                      </ListItem>
                                      <ListItem>
                                        Minimum of three of the following mix of
                                        character types: uppercase, lowercase,
                                        numbers, and symbol
                                      </ListItem>
                                    </UnorderedList>
                                  }
                                  fontSize="sm"
                                  placement="top-end"
                                  border="1px solid"
                                  borderColor="whiteAlpha.500"
                                  borderRadius="10px"
                                  ml={10}
                                >
                                  <InfoIcon ml={2} w={3} h={3} />
                                </Tooltip>
                              </FormLabel>
                              <Input
                                height="12"
                                id="password"
                                ref={initialRef}
                                type="password"
                                {...props.field}
                                fontSize="25px"
                                letterSpacing={1}
                                bg="gray.700"
                                mt={2}
                                color="#F3F8F7"
                              />
                              {props.form.errors.password &&
                                props.form.touched.password && (
                                  <Box
                                    mt="2"
                                    ml="2"
                                    color="red.300"
                                    fontSize="sm"
                                  >
                                    {props.form.errors.password}
                                  </Box>
                                )}
                            </FormControl>
                          )}
                        </Field>
                        <Field name="passwordConfirm">
                          {(props: any) => (
                            <FormControl mt="4">
                              <FormLabel htmlFor="passwordConfirm">
                                Confirm password
                              </FormLabel>
                              <Input
                                height="12"
                                id="passwordConfirm"
                                type="password"
                                {...props.field}
                                fontSize="25px"
                                letterSpacing={1}
                                bg="gray.700"
                                mt={2}
                                color="#F3F8F7"
                              />
                              {props.form.errors.passwordConfirm &&
                                props.form.touched.passwordConfirm && (
                                  <Box
                                    mt="2"
                                    ml="2"
                                    color="red.300"
                                    fontSize="sm"
                                  >
                                    {props.form.errors.passwordConfirm}
                                  </Box>
                                )}
                            </FormControl>
                          )}
                        </Field>
                        <Field type="checkbox" name="acceptTerm">
                          {(props: any) => (
                            <FormControl mt="6">
                              <Checkbox colorScheme="primary" {...props.field}>
                                I accept
                                <Link
                                  href="https://files.krystal.app/terms.pdf"
                                  target="_blank"
                                  color="primary.200"
                                  display="inline"
                                  marginX="1"
                                >
                                  Terms of Use
                                </Link>
                                and
                                <Link
                                  href="https://files.krystal.app/privacy.pdf"
                                  target="_blank"
                                  color="primary.200"
                                  display="inline"
                                  marginX="1"
                                >
                                  Privacy Policy
                                </Link>
                                .
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                      </Center>
                      <Box h="40px" mt="auto">
                        <Button
                          type="submit"
                          colorScheme="primary"
                          w="100%"
                          disabled={!props.values.acceptTerm}
                          size="md"
                        >
                          Create
                        </Button>
                      </Box>
                    </Flex>
                  )}
                </Formik>
              )}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePassword;

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required("*Password is required")
    .test("len", "*Password must be 8 characters long", (val) =>
      val ? val.length >= 8 : false
    ),
  passwordConfirm: yup
    .string()
    .required("*The confirmation password is required")
    .oneOf([yup.ref("password")], "*The confirmation password is not match"),
});
