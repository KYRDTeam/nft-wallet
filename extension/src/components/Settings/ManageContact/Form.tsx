import { Box, Flex, Text, Input, Button } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import useCustomToast from "src/hooks/useCustomToast";
import { useAppDispatch } from "src/hooks/useStore";
import { addNewContact, updateContact, removeContact } from "src/store/contact";
import { isAddress } from "web3-utils";
import { IconBin } from "./icons/IconBin";
import { IconSend } from "./icons/IconSend";
import { Form, Formik } from "formik";
import * as yup from "yup";

type AccountProps = {
  id: string;
  name: string;
  address: string;
};

const FormContact = ({
  initValues,
  isEdit = false,
  handleClose,
}: {
  initValues: AccountProps;
  isEdit?: boolean;
  handleClose: (e?: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const toast = useCustomToast();
  const history = useHistory();

  const validationSchema = yup.object().shape({
    name: yup.string().max(255, "*Name has a maximum limit of 255 characters."),
    address: yup
      .string()
      .required("*The address is required")
      .test("valid", "*Address is invalid", (val) => !!val && isAddress(val)),
  });

  const handleSubmit = ({ values }: { values: AccountProps }) => {
    if (isEdit) {
      dispatch(updateContact(values));
    } else {
      dispatch(addNewContact({ ...values, id: Math.random().toString(36).slice(-20) }));
    }
    handleClose();
    return;
  };

  const handleDelete = (id: string) => {
    if (!id) {
      return;
    }
    dispatch(removeContact(id));
    handleClose();
  };

  return (
    <Formik
      initialValues={initValues}
      onSubmit={(values) => handleSubmit({ values })}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
      }: {
        values: AccountProps;
        errors: any;
        touched: any;
        setFieldValue: any;
      }) => (
        <Box as={Form}>
          <Box mt="7" mb="4">
            <Flex ml="2" mb="4">
              <Text>Name</Text>
            </Flex>
            <Input
              placeholder="Name"
              _placeholder={{ fontSize: "16px" }}
              bgColor="#222"
              height="12"
              fontSize="lg"
              errorBorderColor="red.300"
              isInvalid={true}
              border={`${touched.name && errors.name ? "1px solid #FC8181" : "1px solid #222"}`}
              value={values.name}
              onChange={(e) => setFieldValue("name", e.target.value)}
              focusBorderColor="primary.300"
            />
            {touched.name && errors.name && (
              <Box mt="2" ml="2" color="red.300" fontSize="sm">
                {errors.name}
              </Box>
            )}
          </Box>

          <Box mt="7" mb="4">
            <Flex ml="2" mb="4">
              <Text>Address</Text>
            </Flex>
            <Input
              placeholder="Address"
              _placeholder={{ fontSize: "16px" }}
              bgColor="#222"
              height="12"
              fontSize="lg"
              isInvalid={!!errors.address}
              errorBorderColor="red.300"
              name="address"
              value={values.address}
              onChange={(e) => setFieldValue("address", e.target.value)}
              focusBorderColor="primary.300"
              border={`${touched.address && errors.address ? "1px solid #FC8181" : "1px solid #222"}`}
            />
            {touched.address && errors.address && (
              <Box mt="2" ml="2" color="red.300" fontSize="sm">
                {errors.address}
              </Box>
            )}
          </Box>
          {isEdit && (
            <Box borderTop="1px solid #3B3E3C" py="8">
              <Flex
                mb="6"
                alignItems="center"
                _hover={{
                  color: "primary.300",
                  stroke: "primary.300",
                  svg: { stroke: "primary.300" },
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (!isAddress(values.address)) {
                    toast({
                      status: "error",
                      title: "Address is invalid",
                    });
                    return;
                  }
                  history.push(`/transfer?address=${values.address}`);
                }}
              >
                <IconSend />
                <Text ml="5">Send</Text>
              </Flex>
              <Flex
                color="#FF6E40"
                alignItems="center"
                _hover={{
                  color: "primary.300",
                  stroke: "primary.300",
                  svg: { stroke: "primary.300" },
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(values.id)}
              >
                <IconBin />
                <Text ml="5">Delete Contact</Text>
              </Flex>
            </Box>
          )}

          <Button colorScheme="primary" w="100%" my="6" type="submit">
            {isEdit ? "Done" : "Add"}
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default FormContact;
