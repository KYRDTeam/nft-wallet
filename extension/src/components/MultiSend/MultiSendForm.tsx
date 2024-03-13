import { CloseIcon, DeleteIcon, SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { Field, FieldArray, FieldAttributes, Form } from "formik";
import { AutoSizer, List } from "react-virtualized";
import { get, isEmpty, isEqual } from "lodash";
import { useCallback, useMemo } from "react";
import { DEFAULT_RECIPIENT_MULTISEND } from "src/config/constants/constants";
import Confirm from "../common/Confirm";

import InputAmountV2 from "../common/InputAmount.v2";
import InputRecipientAddress from "../common/InputRecipientAddress";
import { UploadCSV } from "./UploadCSV";
import { Token } from "src/config/types";

const RecipientField = ({
  recipient,
  index,
  setFieldValue,
  touched,
  errors,
  arrayHelpers,
  ...props
}: {
  setFieldValue: any;
  recipient: any;
  index: any;
  touched: any;
  errors: any;
  arrayHelpers: any;
  [attr: string]: any;
}) => {
  const errorAmount =
    (get(touched, `recipients.${index}.token`) && get(errors, `recipients.${index}.token`)) ||
    (get(touched, `recipients.${index}.amount`) && get(errors, `recipients.${index}.amount`));

  return (
    <Flex
      key={index}
      direction={{ base: "column", xl: "row" }}
      {...props}
      height="fit-content"
      justifyContent={{ xl: "space-around" }}
      alignItems={{ xl: "center" }}
      w={{ xl: "100%" }}
    >
      <Box mr={{ base: 0, xl: 3 }} pl={{ base: 4, xl: 0 }} fontSize="xl">
        {index + 1}.
      </Box>
      <Box mr={{ base: 0, xl: 4 }} my={{ base: 2, xl: 0 }}>
        <Field name={`recipients.${index}.address`}>
          {({ field, form: { touched, errors } }: FieldAttributes<any>) => {
            const error = get(touched, field.name) && get(errors, field.name);
            return (
              <InputRecipientAddress
                isInvalid={!!error}
                {...field}
                errorMessage={error}
                onChange={(address) => setFieldValue(field.name, address)}
              />
            );
          }}
        </Field>
      </Box>
      <Box my={{ base: 2, xl: 0 }}>
        <InputAmountV2
          value={recipient.amount}
          onChange={(value) => {
            setFieldValue(`recipients.${index}.amount`, value);
          }}
          selectedToken={recipient.token || null}
          setSelectedToken={(token: Token) => {
            setFieldValue(`recipients.${index}.token`, token);
          }}
          balance={recipient?.token?.formattedBalance}
          errorMessage={errorAmount}
          hiddenBalance
        />
      </Box>
      <Box pl="2">
        <Button
          p="0"
          mt="2.5"
          w="8"
          h="8"
          display={{ base: "none", xl: "block" }}
          bg="transparent"
          onClick={() => {
            arrayHelpers && arrayHelpers.remove(index);
          }}
        >
          <CloseIcon boxSize="3" />
        </Button>
        <Button
          p={{ base: "2", md: "0" }}
          mt="2.5"
          w={{ base: "auto", md: "8" }}
          h="8"
          display={{ base: "flex", xl: "none" }}
          color="red.300"
          leftIcon={<DeleteIcon />}
          onClick={() => {
            arrayHelpers && arrayHelpers.remove(index);
          }}
        >
          Remove
        </Button>
      </Box>
    </Flex>
  );
};

export const MultiSendForm = ({
  values,
  setFieldValue,
  errors,
  touched,
  resetForm,
}: {
  values: any;
  setFieldValue: any;
  errors: any;
  touched: any;
  resetForm: any;
}) => {
  const renderRow = useCallback(
    ({ index, key, style, arrayHelpers }: { index: number; key: any; style: any; arrayHelpers: any }) => {
      return (
        <RecipientField
          key={key}
          style={style}
          recipient={values.recipients[index]}
          index={index}
          setFieldValue={setFieldValue}
          touched={touched}
          errors={errors}
          arrayHelpers={arrayHelpers}
        />
      );
    },
    [errors, setFieldValue, touched, values.recipients],
  );
  const isDirtyForm = useMemo(() => {
    return values.recipients.find((recipient: any) => !isEqual(recipient, DEFAULT_RECIPIENT_MULTISEND));
  }, [values.recipients]);

  const [isMobile] = useMediaQuery("(max-width: 720px)");

  return (
    <Form>
      <Flex mb="4" px="4" justifyContent="space-between">
        <UploadCSV setFieldValue={setFieldValue} currentRecipients={values.recipients || []} />
      </Flex>
      <Divider />
      <FieldArray
        name="recipients"
        render={(arrayHelpers) => (
          <>
            <Box height="calc( 100vh - 350px )" px="0" w="full">
              {isEmpty(values.recipients) && (
                <Text textAlign="center" color="whiteAlpha.500" fontStyle="italic">
                  Please add more recipient
                </Text>
              )}

              <AutoSizer>
                {({ width, height }) => {
                  return (
                    <List
                      width={width}
                      height={height}
                      rowHeight={isMobile ? 210 : 80}
                      rowRenderer={({ index, key, style }) => renderRow({ index, key, style, arrayHelpers })}
                      rowCount={values.recipients.length}
                      style={{ padding: "10px 20px" }}
                    />
                  );
                }}
              </AutoSizer>
            </Box>
            <Divider />
            <Flex justifyContent="space-between" px="6" pt="4" alignItems="center">
              <Button
                leftIcon={<SmallAddIcon />}
                pl="4"
                color="primary.300"
                onClick={() => {
                  arrayHelpers.push(DEFAULT_RECIPIENT_MULTISEND);
                }}
              >
                Add more
              </Button>
              <Flex alignItems="center">
                {isDirtyForm && (
                  <Confirm
                    render={(onOpen) => (
                      <Button color="red.300" leftIcon={<DeleteIcon />} px="3" onClick={onOpen}>
                        Clear All
                      </Button>
                    )}
                    content="All data do you enter will be delete!"
                    onConfirm={resetForm}
                  />
                )}
                <Text pl="4">Total: {values.recipients.length} Recipients</Text>
              </Flex>
            </Flex>
          </>
        )}
      />
    </Form>
  );
};
