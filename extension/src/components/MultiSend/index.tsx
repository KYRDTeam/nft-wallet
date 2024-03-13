import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { Container, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { MultiSendSummary } from "./MultisendSummary";
import * as Yup from "yup";
import { Formik } from "formik";
import { MultiSendForm } from "./MultiSendForm";
import { isAddress } from "web3-utils";
import ConnectWallet from "../Sidebar/ConnectWallet";
import MultiSendConfirmModal from "./MultiSendConfirmModal";
import { groupByTokenByRecipients } from "src/utils/helper";
import { useAppSelector } from "src/hooks/useStore";
import get from "lodash/get";
import { isEmpty, isString } from "lodash";
import { DEFAULT_RECIPIENT_MULTISEND } from "src/config/constants/constants";
import { Token } from "src/config/types";
import { globalSelector } from "src/store/global";
import { MULTI_SEND_CONTRACT } from "src/config/constants/contracts";
import { ChainIcon } from "../icons";

const MultiSend = () => {
  const history = useHistory();
  const openTransferModalRef = useRef(() => {});
  const formRef = useRef(null);
  const tokenApproved = useRef<{ [address: string]: boolean }>({});

  const { chainId } = useAppSelector(globalSelector);

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const initialValues = {
    recipients: [DEFAULT_RECIPIENT_MULTISEND, DEFAULT_RECIPIENT_MULTISEND, DEFAULT_RECIPIENT_MULTISEND],
  };

  const validationSchema = Yup.object().shape({
    recipients: Yup.array()
      .of(
        Yup.object().shape({
          address: Yup.string()
            .test("isAddress", "Address is invalid.", (value) => !!value && isAddress(value))
            .required(),
          token: Yup.object().required("Please select a token."),
          amount: Yup.string()
            .required("Invalid amount.")
            .when("token", (token: any) => {
              const currentTokenBalance = +get(token, "humanizeBalance", 0);
              return Yup.number()
                .typeError("Amount must be a number.")
                .test("greaterThanZero", "Invalid amount.", (value) => !!value && +value > 0)
                .max(currentTokenBalance, "Insufficient balance.");
            }),
        }),
      )
      .test("isEmpty", "Please add more recipient.", (recipients) => !isEmpty(recipients))
      .test(
        "summaryOverBalance",
        "Insufficient balance.",
        // @ts-ignore
        (recipients: any[]) => {
          const groupTokenFromRecipients = groupByTokenByRecipients(recipients);
          const isInsufficientBalance = groupTokenFromRecipients.find(
            ({ token, amount }: { token: Token; amount: number }) => +token.humanizeBalance < +amount,
          );
          return !isInsufficientBalance;
        },
      ),
  });

  const handleSubmit = useCallback(
    (values, actions) => {
      const isExistedTokenUnapproved = !!values.recipients
        .map(({ token }: { token: Token }) => token.address && tokenApproved.current[token.address.toLowerCase()])
        .filter((isApproved: boolean) => !isApproved).length;

      // all tokens are approved with enough allowance
      if (isExistedTokenUnapproved) {
        actions.setFieldError("common", "Please approve token with enough allowance.");
        actions.setSubmitting(false);
        return;
      }

      openTransferModalRef.current();
    },
    [],
  );

  const setTokenApproved = useCallback(({ address, isApproved }: { address: string; isApproved: boolean }) => {
    tokenApproved.current[address.toLowerCase()] = isApproved;
  }, []);

  useEffect(() => {
    const resetForm = get(formRef, "current.resetForm", () => {});
    resetForm();
  }, [chainId]);

  const isMultiSendAvailable = useMemo(() => !!MULTI_SEND_CONTRACT[chainId], [chainId]);

  return (
    <Container maxW={{ base: "full", lg: "container.xl" }}>
      <Flex justify="center" maxW="100%" direction={{ base: "column", xl: "row" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnBlur={false}
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          {(props) => {
            const groupTokenByAmount = groupByTokenByRecipients(props.values.recipients);

            const commonError =
              (isString(get(props.errors, "recipients")) && get(props.errors, "recipients")) ||
              get(props.errors, "common");

            return (
              <>
                <Box flex={{ base: "1", xl: "2" }}>
                  <Heading as="h2" size="lg" mb="5" textAlign="center" pos="relative" pl="4">
                    <Button
                      fontSize="md"
                      p="0"
                      left="4"
                      position="absolute"
                      border="1px solid"
                      borderColor="transparent"
                      backgroundColor="transparent"
                      color="whiteAlpha.600"
                      _hover={{ bg: "transparent", color: "primary.300" }}
                      _active={{ bg: "transparent", color: "primary.300" }}
                      onClick={goBack}
                    >
                      <ArrowBackIcon mr="2" />
                      Back
                    </Button>
                    Multi-Send
                  </Heading>
                  {!isMultiSendAvailable && (
                    <Flex alignItems="center" opacity="0.75">
                      <ChainIcon chainId={chainId || 1} boxSize={20} />
                      <Box ml="5">Coming soon</Box>
                    </Flex>
                  )}
                  {!!isMultiSendAvailable && (
                    <Box bg="gray.700" w="full" maxW="100%" borderRadius="16" py="4">
                      <MultiSendForm {...props} />
                    </Box>
                  )}
                </Box>
                {!!isMultiSendAvailable && (
                  <Box
                    flex={{ base: "1", xl: "1" }}
                    bg="gray.700"
                    my={{ base: 4, xl: 14 }}
                    ml={{ base: 0, xl: 6 }}
                    borderRadius="16"
                    height="fit-content"
                    py="3"
                  >
                    <MultiSendSummary
                      tokenSummary={groupTokenByAmount}
                      setTokenApproved={({ address, isApproved }: { address: string; isApproved: boolean }) => {
                        if (props.isSubmitting) return;
                        setTokenApproved({ address, isApproved });
                      }}
                      submitButton={
                        <ConnectWallet
                          renderConnectBtn={(onOpen) => (
                            <Button w="100%" colorScheme="primary" onClick={onOpen}>
                              Import wallet
                            </Button>
                          )}
                          renderWalletInfo={
                            <MultiSendConfirmModal
                              recipients={props.values.recipients}
                              tokenSummary={groupTokenByAmount}
                              callbackSuccess={props.resetForm}
                              callbackClose={() => {
                                props.setSubmitting(false);
                              }}
                              render={(onOpen: () => void, loadingText: string) => {
                                openTransferModalRef.current = onOpen;
                                return (
                                  <>
                                    <Button
                                      height="12"
                                      fontWeight="bold"
                                      fontSize="md"
                                      w="100%"
                                      colorScheme="primary"
                                      isLoading={props.isSubmitting}
                                      loadingText={loadingText}
                                      onClick={() => {
                                        props.submitForm();
                                      }}
                                    >
                                      Transfer
                                    </Button>
                                  </>
                                );
                              }}
                            />
                          }
                        />
                      }
                    />
                    <Box p="6" pt="2" pb="4">
                      {commonError && (
                        <Text color="yellow.300" fontStyle="italic" mt="2" px="2">
                          {commonError}
                        </Text>
                      )}
                    </Box>
                  </Box>
                )}
              </>
            );
          }}
        </Formik>
      </Flex>
    </Container>
  );
};

export default MultiSend;
