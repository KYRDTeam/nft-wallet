import {
  Avatar,
  Box,
  Divider,
  Flex,
  ModalCloseButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { NFTitem } from "../Summary/Portfolio/TokenBalance/NFTs/NFTitem";
import { ellipsis } from "src/utils/formatBalance";
import { useAppSelector } from "src/hooks/useStore";
import { walletsSelector } from "src/store/wallets";
import InfoField from "../common/InfoField";
import { formatNumber } from "src/utils/helper";
import { NODE } from "src/config/constants/chain";
import { globalSelector } from "src/store/global";
import { usePrice } from "src/hooks/useTokens";

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

export const TransferNFTConfirmModal = ({
  data,
  collectibleAddress,
  destAddress,
  amount,
  onConfirm,
  onValidate,
  loadingText,
  fee,
}: {
  data: NFTDetailType;
  collectibleAddress: string;
  destAddress: string;
  amount: string;
  onConfirm: () => void;
  onValidate: () => boolean;
  loadingText: string;
  fee: {
    gasPrice: any;
    priorityFee: any;
    gasLimit: any;
    gasFee: any;
  };
}) => {
  const { chainId } = useAppSelector(globalSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { wallets } = useAppSelector(walletsSelector);

  const { getPrice } = usePrice();
  const nativeUsdPrice = getPrice(NODE[chainId].address);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const destContact = useMemo(() => {
    return wallets.find(
      (wallet: { address: string }) =>
        wallet.address.toLowerCase() === destAddress.toLowerCase()
    );
  }, [destAddress, wallets]);

  return (
    <>
      <Button
        w="full"
        colorScheme="primary"
        mt="6"
        onClick={() => {
          const isValid = onValidate();
          if (isValid) {
            onOpen();
          }
        }}
        isLoading={!!loadingText}
        loadingText={loadingText}
      >
        Transfer
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="3xl">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent width="sm" borderRadius="16">
          <ModalCloseButton />
          <ModalHeader textAlign="center" py="4">
            Transfer Confirmation
          </ModalHeader>
          <ModalBody
            px="8"
            fontSize={{ base: "md", md: "lg" }}
            maxH="calc( 100vh - 250px )"
            overflowY="auto"
          >
            <Box w="xs" margin="0 auto">
              <NFTitem
                key={data.tokenID}
                data={data}
                onlyPreview
                collectibleAddress={collectibleAddress}
                isMobile={false}
              />
            </Box>
            <Box>
              <Flex
                alignItems="center"
                cursor="pointer"
                px="2"
                py="1"
                borderRadius="12"
              >
                <Avatar name={"<unknown>"} boxSize="10" mr="2" />
                <Box>
                  <Text
                    color={destContact ? "whiteAlpha.900" : "whiteAlpha.500"}
                  >
                    {destContact ? destContact.name : "<unknown>"}
                  </Text>
                  <Text color="whiteAlpha.500">
                    {ellipsis(destAddress, 18, 5)}
                  </Text>
                </Box>
              </Flex>
              <Divider mt="2" />
              <Flex justifyContent="space-between" mt="4">
                <Text fontSize="md">NFT Amount to Transfer</Text>
                <Text fontSize="md">{amount || 1}</Text>
              </Flex>
              <Box bgColor="gray.800" px="6" py="4" mt="4" borderRadius="16">
                <InfoField
                  title="Maximum gas fee"
                  tooltip="The actual cost of the transaction is generally lower than the maximum estimated cost."
                  content={
                    <Text>
                      {formatNumber(fee.gasFee)} {NODE[chainId].currencySymbol}
                    </Text>
                  }
                />
                <InfoField
                  content={
                    <Flex direction="column" alignItems="flex-end">
                      <Text color="whiteAlpha.700" fontSize="sm">
                        ≈ {formatNumber(+fee.gasFee * nativeUsdPrice)} USD
                      </Text>
                      <Text color="whiteAlpha.700" fontSize="sm">
                        {fee.gasPrice} (Gas Price) * {fee.gasLimit} (Gas Limit)
                      </Text>
                    </Flex>
                  }
                />
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter justifyContent="space-evenly" pb="8" px="8">
            <Button
              mr="4"
              colorScheme="gray"
              onClick={() => {
                onClose();
              }}
              flex="1"
            >
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              flex="1"
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
