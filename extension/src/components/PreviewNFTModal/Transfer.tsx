import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { NFT_TYPE } from "src/config/constants/constants";
import { useGasSetting } from "src/hooks/useGasSetting";
import { useSendTx } from "src/hooks/useSendTx";
import { useAppSelector } from "src/hooks/useStore";
import { useWallet } from "src/hooks/useWallet";
import { globalSelector } from "src/store/global";
import { getDataTransferNFT } from "src/utils/web3";
import { RecentContact } from "../common/RecentContact";
import { NFTitem } from "../Summary/Portfolio/TokenBalance/NFTs/NFTitem";
import { TransferNFTConfirmModal } from "./TransferNFTConfirmModal";

export const Transfer = ({
  collectibleAddress,
  loading,
  data,
  type,
}: {
  collectibleAddress: string;
  loading: boolean;
  data: any;
  type: string;
}) => {
  const { ethereum } = useWallet();
  const { chainId: localChainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { send, error: txError, loadingText } = useSendTx();
  const { view, gasPrice, priorityFee, gasLimit, gasFee } = useGasSetting();

  const getTx = useCallback(() => {
    const txData = getDataTransferNFT(
      localChainId,
      {
        contractAddress: collectibleAddress,
        fromAddress: account || "",
        toAddress: address,
        tokenID: data.tokenID,
        amount: type === NFT_TYPE.ERC1155 ? +amount : undefined,
      },
      type,
      ethereum
    );

    const tx = {
      data: txData,
      to: collectibleAddress,
      from: account,
      gasPrice,
      gasLimit,
      priorityFee,
    };

    return tx;
  }, [
    address,
    amount,
    collectibleAddress,
    account,
    data.tokenID,
    ethereum,
    gasLimit,
    gasPrice,
    localChainId,
    priorityFee,
    type,
  ]);

  const commonError = useMemo(() => error || txError, [error, txError]);

  const transfer = useCallback(() => {
    if (error) {
      return;
    }

    let tx: any;

    tx = getTx();

    if (!tx) return;

    send(tx);
  }, [error, getTx, send]);

  const onValidate = useCallback(() => {
    setError("");
    if (!account) return false;
    if (!address) {
      setError("Please enter a valid address");
      return false;
    }

    if (type === NFT_TYPE.ERC1155) {
      if (Number(amount) > +data.tokenBalance) {
        setError("Insufficient balance for the transfer");
        return false;
      }

      if (Number(amount) === 0) {
        setError("Invalid amount");
        return false;
      }
    }
    return true;
  }, [address, amount, account, data.tokenBalance, type]);

  return (
    <>
      <Box w="xs" margin="0 auto">
        {!loading && (
          <NFTitem
            key={data.tokenID}
            data={data}
            onlyPreview
            collectibleAddress={collectibleAddress}
            isMobile={false}
          />
        )}
      </Box>
      {type === NFT_TYPE.ERC1155 && (
        <Box mt="10">
          <Flex px="2" mb="1">
            <Text>NFT Amount</Text>
          </Flex>

          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type="number"
              placeholder="0"
              height="12"
              value={`${amount === "" ? "" : Number(amount)}`}
              fontSize="lg"
              isInvalid={!!error}
              errorBorderColor="red.300"
              onChange={(event) => {
                setAmount(`${Math.round(+event.target.value)}`);
              }}
            />
            <InputRightElement width="3rem" mr="4">
              <Button
                h="1.75rem"
                size="sm"
                colorScheme="primary"
                borderRadius="8"
                mt="2"
                onClick={() => {
                  setAmount(data.tokenBalance || "0");
                }}
              >
                Max
              </Button>
            </InputRightElement>
          </InputGroup>
          <Text px="2" fontSize="md" color="whiteAlpha.500">
            Balance: {data.tokenBalance}
          </Text>
        </Box>
      )}
      <Box mt="3">
        <Flex px="2" mb="1">
          <Text>Recipient Address</Text>
        </Flex>
        <Input
          placeholder="Recipient Address"
          height="12"
          value={address}
          fontSize="lg"
          isInvalid={!!error}
          errorBorderColor="red.300"
          onChange={(event) => {
            setError("");
            setAddress(event.target.value);
          }}
        />
      </Box>

      <TransferNFTConfirmModal
        data={data}
        collectibleAddress={collectibleAddress}
        onConfirm={transfer}
        onValidate={onValidate}
        destAddress={address}
        amount={amount}
        loadingText={loadingText}
        fee={{
          gasPrice,
          priorityFee,
          gasLimit,
          gasFee,
        }}
      />
      <Box px="2" mt="1">
        {!!address && view}
      </Box>
      <Text px="2" color="red.300" fontSize="md" mt="2">
        {commonError}
      </Text>

      <RecentContact
        onSelect={(address: string) => {
          setAddress(address);
        }}
      />
      <Box h="6" />
    </>
  );
};
