import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  Text,
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
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useCallback, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { sendMessage } from "src/services/extension";
import {
  setPassword,
  setAccounts,
  resetState,
  keysSelector,
  resetKeyringController,
  setVault,
} from "src/store/keys";
import * as yup from "yup";
import RestoreNote from "./RestoreNote";
interface RestoreAccountProps {
  render: (onOpen: () => void) => JSX.Element;
  case: "RESTORE" | "FORGOT_PASSWORD";
}

const RestoreAccount = ({ render, case: _case }: RestoreAccountProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const { keyringController } = useAppSelector(keysSelector);
  const [wordCount, setWordCount] = useState(0);

  const initialRef = useRef<any>();

  const submit = useCallback(
    async (values: any, actions: any) => {
      if (_case === "RESTORE") {
        const data = await sendMessage({
          type: "create_new_vault_and_restore",
          password: values.password,
          mnemonic: values.mnemonic,
        });
        if (data.isError) {
          actions.setFieldError("mnemonic", data.error);
          return;
        } else {
          dispatch(setVault(data.vault));
          dispatch(setPassword(values.password));
        }
      } else {
        if (keyringController) {
          let errMsg = "";
          let isError = await keyringController
            .createNewVaultAndRestore(values.password, values.mnemonic)
            .then(() => {
              return false;
            })
            .catch((err: Error) => {
              errMsg = err.message;
              return true;
            });
          if (!isError) {
            dispatch(resetState());
            const vault = keyringController.store.getState();
            sendMessage({ type: "store_vault", vault });
            dispatch(resetKeyringController(vault));
            dispatch(setPassword(values.password));
            sendMessage({ type: "set_password", password: values.password });
            keyringController
              .submitPassword(values.password)
              .then((res: any) => {
                const accounts: string[] = [];
                res.keyrings.forEach((keyring: any) => {
                  accounts.push(...keyring.accounts);
                });
                dispatch(setAccounts(accounts));
              });
          } else {
            actions.setFieldError("mnemonic", errMsg);
          }
        }
      }
    },
    [_case, dispatch, keyringController]
  );

  const handleEnter = useCallback(
    (e, values, actions) => {
      if (e.key === "Enter") {
        submit(values, actions);
      }
    },
    [submit]
  );

  return (
    <>
      {render(onOpen)}
      <Modal
        onClose={onClose}
        size="full"
        isOpen={isOpen}
        initialFocusRef={initialRef}
      >
        <ModalContent fontSize="md" bg="#0F1010">
          <ModalHeader textAlign="center">
            {_case === "FORGOT_PASSWORD" ? "Reset Password" : "Import Wallet"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex">
            <Flex flexDir="column" width="100%">
              {_case === "FORGOT_PASSWORD" ? (
                <></>
              ) : (
                <Text fontSize="sm" mb={2} color="whiteAlpha.700">
                  Only the first account on this wallet will auto load. After
                  completing this process, to add additional accounts, click the
                  drop down menu, then select Create Account.
                </Text>
              )}
              <Formik
                initialValues={{
                  mnemonic: "",
                  password: "",
                  passwordConfirm: "",
                }}
                onSubmit={submit}
                validationSchema={validationSchema}
              >
                {({ handleChange, values, setFieldError }) => {
                  return (
                    <Flex as={Form} flexDir="column" width="100%">
                      <Center flexDir="column" flex="1">
                        <Field name="mnemonic">
                          {(props: any) => (
                            <FormControl>
                              <FormLabel htmlFor="mnemonic">
                                Recovery Phrase{" "}
                              </FormLabel>
                              <Flex
                                justifyContent="space-between"
                                color="whiteAlpha.500"
                                my={1}
                              >
                                <Text fontSize="sm">
                                  *Separate words with a space
                                </Text>
                                <Text fontSize="sm">
                                  Word count: {wordCount}
                                </Text>
                              </Flex>
                              <Textarea
                                ref={initialRef}
                                placeholder="Enter the secret recovery phrase"
                                borderRadius="lg"
                                p="5"
                                h="110px"
                                {...props.field}
                                bg="gray.700"
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setWordCount(
                                    e.target.value.split(" ").length
                                  );
                                }}
                                color="#F3F8F7"
                              />
                              {props.form.errors.mnemonic &&
                                props.form.touched.mnemonic && (
                                  <Box
                                    mt="2"
                                    ml="2"
                                    color="red.300"
                                    fontSize="sm"
                                  >
                                    {props.form.errors.mnemonic}
                                  </Box>
                                )}
                            </FormControl>
                          )}
                        </Field>
                        <Field name="password">
                          {(props: any) => (
                            <FormControl mt="4">
                              <FormLabel htmlFor="password">
                                New password
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
                                type="password"
                                {...props.field}
                                bg="gray.700"
                                color="#F3F8F7"
                                fontSize="25px"
                                letterSpacing={1}
                                placeholder="Enter your new password"
                                _placeholder={{
                                  fontSize: "md",
                                  letterSpacing: "unset",
                                }}
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
                                bg="gray.700"
                                color="#F3F8F7"
                                fontSize="25px"
                                letterSpacing={1}
                                placeholder="Confirm your new password"
                                _placeholder={{
                                  fontSize: "md",
                                  letterSpacing: "unset",
                                }}
                                onKeyPress={(
                                  e: any,
                                  values: any,
                                  { setFieldError }: any
                                ) => handleEnter(e, values, { setFieldError })}
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
                      </Center>
                      <Button
                        type="submit"
                        colorScheme="primary"
                        w="100%"
                        size="md"
                        mt={6}
                      >
                        Restore
                      </Button>
                      {_case === "FORGOT_PASSWORD" && (
                        <RestoreNote
                          render={(onOpen) => (
                            <Button
                              bgColor="transparent"
                              w="100%"
                              size="md"
                              mt={3}
                              onClick={onOpen}
                              _hover={{ bgColor: "transparent" }}
                            >
                              Read more
                            </Button>
                          )}
                        />
                      )}
                    </Flex>
                  );
                }}
              </Formik>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RestoreAccount;

const validationSchema = yup.object().shape({
  password: yup.string().required("*Password is required"),
  passwordConfirm: yup
    .string()
    .required("*The confirmation password is required")
    .oneOf([yup.ref("password")], "*The confirmation password is not match"),
  mnemonic: yup
    .string()
    .required("*Secret recovery phrase is required")
    .test(
      "mnemonic",
      "*Secret recovery phrase should have 12 words",
      (val?: string) => {
        return val ? val.split(" ").length === 12 : false;
      }
    ),
});
