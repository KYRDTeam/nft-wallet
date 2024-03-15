import { Link, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { EtherScanIcon, ShareIcon, TransferIcon } from "../common/icons";
import useFetch from "use-http";
import { get } from "lodash";
import useCustomToast from "src/hooks/useCustomToast";
import { NODE } from "src/config/constants/chain";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { ChainId } from "src/config/types";
import { Detail } from "./Detail";
import { Transfer } from "./Transfer";
import useCheckOwnerNFT from "./hooks/useCheckOwnerNFT";
import { useWallet } from "src/hooks/useWallet";
import { krystalApiEndPoint } from "src/config/constants/constants";

type NFTDetailType = {
  collectibleName: string;
  externalData: {
    animation: string;
    description: string;
    image: string;
    name: string;
  };
  favorite: boolean;
  tokenBalance: string;
  tokenID: string;
  tokenUrl: string;
};

const ViewMode = {
  DETAIL: "DETAIL",
  TRANSFER: "TRANSFER",
};

export const PreviewNFTModal = () => {
  // @ts-ignore
  const { collectibleAddress, tokenId } = useParams();
  const tokenID = useMemo(() => tokenId.split("?")[0], [tokenId]);

  const [view, setView] = useState(ViewMode.TRANSFER);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const { chainId } = useAppSelector(globalSelector);
  const toast = useCustomToast();
  const location = useLocation();
  const chainIdSearchParam = new URLSearchParams(location?.search).get(
    "chainId"
  );

  const { account } = useWallet();

  const {
    loading: checkingOwnerNFT,
    isOwner,
    type,
  } = useCheckOwnerNFT({
    collectibleAddress,
    tokenID,
  });

  useEffect(() => {
    if (collectibleAddress && tokenID) {
      onOpen();
    }
  }, [collectibleAddress, onOpen, tokenID]);

  // @ts-ignore
  const NFTchainId: ChainId = chainIdSearchParam || chainId;
  // page=1&pageSize=24&search=&chainId=1

  const { data, loading } = useFetch(
    `${krystalApiEndPoint}/all/v1/balance/listNftInCollection?address=${account}&collectionAddress=${collectibleAddress}&tokenID=${tokenID}&chainId=${chainId}`,
    {},
    [collectibleAddress, tokenID]
  );

  const NFTinfo: NFTDetailType = useMemo(
    () =>
      get(data, "data.items", []).find((i: any) => i?.tokenID === tokenID) ||
      {},
    [data, tokenID]
  );

  // close modal and redirect to home page
  useEffect(() => {
    if (!loading && !get(NFTinfo, "tokenID")) {
      onClose();
      toast({
        status: "error",
        title: "No NFT Found.",
      });
      history.push("/");
    }
  }, [NFTinfo, data, history, loading, onClose, toast]);

  const handleClose = useCallback(() => {
    if (get(location, "state.background")) {
      history.push("/summary");
    }
    onClose();
  }, [history, location, onClose]);

  const isDisplayedTransferButton = useMemo(() => {
    return !checkingOwnerNFT && isOwner;
  }, [checkingOwnerNFT, isOwner]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="2xl">
      <ModalOverlay backdropFilter="blur(3px) !important;" />
      <ModalContent width="sm" borderRadius="16">
        <ModalCloseButton />
        <ModalHeader textAlign="center" py="4">
          {view === ViewMode.DETAIL ? "NFT detail" : "Transfer NFT"}
        </ModalHeader>
        <ModalBody
          px="8"
          fontSize={{ base: "md", md: "lg" }}
          maxH="calc( 100vh - 200px )"
          overflowY="auto"
        >
          {view === ViewMode.DETAIL && (
            <Detail
              data={NFTinfo}
              loading={loading}
              collectibleAddress={collectibleAddress}
            />
          )}
          {view === ViewMode.TRANSFER && (
            <Transfer
              data={NFTinfo}
              loading={loading}
              collectibleAddress={collectibleAddress}
              type={type}
            />
          )}
        </ModalBody>

        <ModalFooter justifyContent="center" pb="8">
          {view === ViewMode.DETAIL && (
            <>
              {isDisplayedTransferButton && (
                <Button
                  w="10"
                  h="10"
                  p="0"
                  mr="2"
                  borderRadius="50%"
                  onClick={() => {
                    if (!isDisplayedTransferButton) return;
                    setView(ViewMode.TRANSFER);
                  }}
                >
                  <TransferIcon stroke="white" boxSize="6" />
                </Button>
              )}
              <Button
                onClick={onClose}
                w="10"
                h="10"
                p="0"
                mr="2"
                borderRadius="50%"
              >
                <ShareIcon stroke="white" boxSize="6" />
              </Button>
              <Button
                w="10"
                h="10"
                p="0"
                mr="2"
                borderRadius="50%"
                as={Link}
                href={`${
                  NODE[NFTchainId as ChainId].scanUrl
                }/token/${collectibleAddress}?a=${NFTinfo?.tokenID}`}
                target="_blank"
              >
                <EtherScanIcon stroke="white" boxSize="6" />
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
