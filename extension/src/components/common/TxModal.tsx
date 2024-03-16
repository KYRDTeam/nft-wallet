import { Button } from "@chakra-ui/button";
import { useDisclosure, useTimeout } from "@chakra-ui/hooks";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Link, Text } from "@chakra-ui/react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay } from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NODE } from "../../config/constants/chain";
import { ChainId, TxReceipt } from "../../config/types";
import { ReactComponent as BroadcastedSVG } from "../../assets/images/icons/status-broadcasted.svg";
import { ReactComponent as DoneSVG } from "../../assets/images/icons/status-done.svg";
import { ReactComponent as FailedSVG } from "../../assets/images/icons/status-failed.svg";
import { getTxReceipt } from "../../utils/web3";
import useRefresh from "../../hooks/useRefresh";
import { useAppSelector } from "../../hooks/useStore";
import { globalSelector } from "../../store/global";
import Rating from "../Swap/Rating";
import GroupButtonAction from "../History/GroupButtonAction";
import { isEmpty } from "lodash";
import { hashSelector } from "../../store/hash";
import { useDispatch } from "react-redux";
import { updateHashItem } from "../../store/hash";
import { ellipsis } from "src/utils/formatBalance";
import { CANCEL } from "src/config/constants/constants";

const TxModal = ({
  txHash,
  txDetail,
  txType,
  messageSuccess,
  txRating,
  renderBottom,
  callbackSuccess,
  callbackFailure,
  resetData,
}: {
  txHash: string;
  txType?: "SWAP" | "TRANSFER" | "WITHDRAW" | "CLAIM" | undefined;
  txDetail?: (e?: any) => React.ReactNode;
  txRating?: boolean;
  messageSuccess?: React.ReactNode;
  renderBottom?: (receipt?: TxReceipt, onClose?: () => void) => JSX.Element;
  callbackSuccess?: () => void;
  callbackFailure?: () => void;
  resetData?: () => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hash, setHash] = useState("");
  const [receipt, setReceipt] = useState<TxReceipt>();
  const { chainId } = useAppSelector(globalSelector);
  const { fastRefresh } = useRefresh();
  const [isShowRating, setIsShowRating] = useState(false);
  const { hashList } = useAppSelector(hashSelector);
  const [dataTx, setDatTx] = useState<any>({});
  const [showTxDetail, setShowTxDetail] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!receipt && hash && chainId) {
      getTxReceipt(chainId, hash).then((txReceipt) => {
        setReceipt(txReceipt);
        if (txReceipt) setIsShowRating(!!txRating);
      });
    }
  }, [hash, fastRefresh, chainId, receipt, txRating]);

  useTimeout(() => {
    setIsShowRating(!!txRating);
  }, 60000);

  useEffect(() => {
    if (txHash) {
      onOpen();
      setHash(txHash);
    }
  }, [txHash, onOpen]);

  useEffect(() => {
    if (!receipt) return;

    if (receipt.status) {
      callbackSuccess && callbackSuccess();
      return;
    }

    callbackFailure && callbackFailure();
  }, [callbackFailure, callbackSuccess, receipt]);

  const handleCloseTxModal = useCallback(async () => {
    setReceipt(undefined);
    setIsShowRating(false);
    setHash("");
    onClose();
    !!resetData && resetData();
  }, [onClose, resetData]);

  const handleResetHash = useCallback(async (txHash, type) => {
    setReceipt(undefined);
    setHash(txHash);
    if (type === CANCEL) {
      setShowTxDetail(false);
    }
  }, []);

  useEffect(() => {
    if (dataTx.isNew) {
      setTimeout(() => {
        dispatch(updateHashItem(dataTx.hash));
      }, 1000);
    }
  }, [dataTx, dispatch]);

  useEffect(() => {
    if (hash) {
      const currentHash = hashList.find((e) => e.hash === hash);
      setDatTx(currentHash);
    }
  }, [hash, hashList]);

  const successfullyText = useMemo(() => {
    switch (txType) {
      case "TRANSFER": {
        return <Text>Successfully Transferred!</Text>;
      }
      case "SWAP": {
        return <Text>Successfully Swapped!</Text>;
      }
      case "WITHDRAW": {
        return <Text>Successfully Withdrawn!</Text>;
      }
      case "CLAIM": {
        return <Text>Successfully Claimed!</Text>;
      }
      default:
        return "Transaction confirmed!";
    }
  }, [txType]);

  return (
    <Modal onClose={handleCloseTxModal} size="lg" isOpen={isOpen} isCentered>
      <ModalOverlay backdropFilter="blur(3px) !important;" />
      <ModalContent bg="#0F1010" px="0" pb={5}>
        <ModalCloseButton />
        <ModalBody mt="5" textAlign="center">
          <Box mb={5} opacity="0.75">
            {receipt ? (
              <>
                {receipt.status ? (
                  <Box>
                    <Center
                      fontSize="2xl"
                      fontWeight="semibold"
                      mb="5"
                      gridGap="3"
                    >
                      <DoneSVG />
                      Done!
                    </Center>
                    {successfullyText}
                    {!!txDetail && showTxDetail && txDetail()}
                    {messageSuccess || ""}
                  </Box>
                ) : (
                  <Box>
                    <Center
                      fontSize="2xl"
                      fontWeight="semibold"
                      mb="5"
                      gridGap="3"
                    >
                      <FailedSVG />
                      Failed!
                    </Center>
                    <Box>Transaction is failed!</Box>
                  </Box>
                )}
              </>
            ) : (
              <Box>
                <Center fontSize="2xl" fontWeight="semibold" mb="5" gridGap="3">
                  <BroadcastedSVG />
                  Broadcasted!
                </Center>
                {!dataTx.isNew && (
                  <Box>
                    <Spinner size="xs" mr={2} color="primary.300" />
                    Waiting for the transaction to be mined
                  </Box>
                )}
              </Box>
            )}
          </Box>
          {dataTx.isNew ? (
            <Spinner size="lg" mr={2} color="primary.300" />
          ) : (
            <Flex
              as={Link}
              href={`${NODE[chainId as ChainId]?.scanUrl}/tx/${hash}`}
              isExternal
              _hover={{ textDecor: "none", bg: "brand.900" }}
              px={4}
              py={3}
              bg="gray.800"
              alignItems="center"
              justify="center"
              borderRadius="15px"
              // flexDir={{ base: "column", lg: "row" }}
            >
              <Flex alignItems="center">
                <Box opacity="0.5">Tx hash:</Box>
                <Box ml="2">
                  {hash && `${ellipsis(hash, 20, 5)}`}{" "}
                  <ExternalLinkIcon ml="2" />
                </Box>
              </Flex>
            </Flex>
          )}

          {isShowRating && <Rating txHash={hash} mt="5" />}
          <Flex mt={6} justifyContent="center">
            {(!receipt || isEmpty(receipt)) && (
              <GroupButtonAction data={dataTx} closeModalTx={handleResetHash} />
            )}
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center">
          {renderBottom
            ? renderBottom(receipt, handleCloseTxModal)
            : !isEmpty(receipt) && (
                <Button
                  onClick={handleCloseTxModal}
                  w="120px"
                  colorScheme="primary"
                >
                  Close
                </Button>
              )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TxModal;
