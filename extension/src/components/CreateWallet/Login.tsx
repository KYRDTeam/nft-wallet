import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { flatten } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { sendMessage } from "src/services/extension";
import { keysSelector, setAccounts, setSelectedAccount } from "src/store/keys";
import RestoreAccount from "./RestoreAccount";

const Login = () => {
  const dispatch = useAppDispatch();
  const { keyringController, selectedAccount, accountsTBA } =
    useAppSelector(keysSelector);
  const inputRef = useRef<any>();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const submit = useCallback(
    (values) => {
      keyringController.submitPassword(values.password).then((res: any) => {
        const accounts: string[] = [];
        res.keyrings.forEach((keyring: any) => {
          accounts.push(...keyring.accounts);
        });
        dispatch(setAccounts(accounts));
        if (
          selectedAccount &&
          (accounts.includes(selectedAccount) ||
            flatten(
              Object.values(accountsTBA).map((item) =>
                item.map((i) => i.address)
              )
            ).includes(selectedAccount?.toLowerCase()))
        ) {
          dispatch(setSelectedAccount(selectedAccount));
        }
      });
      sendMessage({ type: "set_password", password: values.password });
    },
    [keyringController, dispatch, selectedAccount, accountsTBA]
  );

  const validate = useCallback(
    (values) => {
      return keyringController
        .verifyPassword(values.password)
        .catch((e: Error) => {
          const errors = { password: "" };
          errors.password = e.message;
          return errors;
        });
    },
    [keyringController]
  );

  return (
    <Box w="100%" fontWeight="semibold" mt="50px" mb="5">
      <Formik
        initialValues={{
          password: "123456789",
        }}
        validate={validate}
        onSubmit={submit}
      >
        <Form>
          <Field name="password">
            {(props: any) => (
              <FormControl mt="4">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  height="12"
                  id="password"
                  type="password"
                  ref={inputRef}
                  {...props.field}
                  fontSize="25px"
                  letterSpacing={1}
                  bg="gray.700"
                  mt={2}
                  color="#F3F8F7"
                />
                {props.form.errors.password && props.form.touched.password && (
                  <Box mt="2" ml="2" color="red.300" fontSize="sm">
                    {props.form.errors.password}
                  </Box>
                )}
              </FormControl>
            )}
          </Field>
          <Button
            mt="10"
            type="submit"
            colorScheme="primary"
            w="100%"
            size="md"
          >
            Unlock
          </Button>
        </Form>
      </Formik>
      <Box mt={3}>
        <RestoreAccount
          case="FORGOT_PASSWORD"
          render={(onOpen) => (
            <Flex
              onClick={onOpen}
              w="100%"
              fontWeight="semibold"
              alignItems="center"
              justifyContent="center"
            >
              <Text cursor="pointer">Forgot password?</Text>
            </Flex>
          )}
        />
      </Box>
    </Box>
  );
};

export default Login;
