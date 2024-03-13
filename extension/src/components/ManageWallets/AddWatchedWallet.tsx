import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { GridItem, SimpleGrid, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Field, Form, Formik } from "formik";
import { useCallback, useRef } from "react";
import { toChecksumAddress, isAddress } from "web3-utils";
import { NODE } from "../../config/constants/chain";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { globalSelector } from "../../store/global";
import { addWallet, editWallet } from "../../store/wallets";

const AddWatchedWalletModal = ({
  render,
  name,
  address,
}: {
  render: (onOpen: () => void) => JSX.Element;
  name?: string;
  address?: string;
}) => {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef<any>();
  const finalRef = useRef<any>();

  const validateAddress = useCallback((value) => {
    if (!value) {
      return "The address is required.";
    }
    if (!isAddress(value)) {
      return "The address is invalid.";
    }
  }, []);

  const submit = useCallback(
    (values) => {
      const formatValue = {
        name: values.name,
        address: toChecksumAddress(values.address).toLowerCase(),
      };

      if (address) {
        dispatch(editWallet(formatValue));
      } else {
        dispatch(addWallet(formatValue));
      }
      onClose();
    },
    [dispatch, onClose, address]
  );

  return (
    <>
      {render(onOpen)}
      <Modal
        onClose={onClose}
        size="sm"
        isOpen={isOpen}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader textAlign="center">
            {address ? "Edit" : "Add"} Watched Wallet
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ name: name || "", address: address || "" }}
            onSubmit={submit}
          >
            <Form>
              <ModalBody px="10">
                <Field name="name">
                  {(props: any) => (
                    <FormControl id="name">
                      <FormLabel htmlFor="name">Label of wallet</FormLabel>
                      <Input
                        height="12"
                        name="name"
                        {...props.field}
                        ref={initialRef}
                        placeholder="Eg.John's wallet"
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="address" validate={validateAddress}>
                  {(props: any) => (
                    <FormControl mt="4">
                      <FormLabel htmlFor="address">
                        {NODE[chainId].name} address
                      </FormLabel>
                      <Input
                        height="12"
                        id="address"
                        {...props.field}
                        placeholder={`A valid ${NODE[chainId].name} address`}
                        disabled={!!address}
                      />
                      {props.form.errors.address && props.form.touched.address && (
                        <Text mt="2" ml="2" color="red.300" fontSize="sm">
                          {props.form.errors.address}
                        </Text>
                      )}
                    </FormControl>
                  )}
                </Field>
              </ModalBody>
              <ModalFooter mt="6" mb="5" px="10">
                <SimpleGrid columns={2} gridGap="7" w="100%">
                  <GridItem>
                    <Button w="100%" onClick={onClose}>
                      Cancel
                    </Button>
                  </GridItem>
                  <GridItem>
                    <Button type="submit" colorScheme="primary" w="100%">
                      Confirm
                    </Button>
                  </GridItem>
                </SimpleGrid>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddWatchedWalletModal;
