import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { SlideFade } from "@chakra-ui/transition";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import ApproveTokenModal from "src/components/common/ApproveTokenModal";
import GasSettings from "src/components/common/GasSettings";
import InfoField from "src/components/common/InfoField";
import InputAmount from "src/components/common/InputAmount";
import TxModal from "src/components/common/TxModal";
import { NODE } from "src/config/constants/chain";
import { EarnBalance, EarnBalanceToken } from "src/config/types";
import { useWithdraw } from "src/hooks/useKrystalServices";
import { useAppSelector } from "src/hooks/useStore";
import { useTokenAllowance } from "src/hooks/useTokenAllowance";
import { usePrice } from "src/hooks/useTokens";
import { earnSelector, setEarnBalances } from "src/store/earn";
import { globalSelector } from "src/store/global";
import { getFullDisplayBalance } from "src/utils/formatBalance";
import { calculateTxFee, formatNumber } from "src/utils/helper";
import BigNumber from "bignumber.js";
interface WithdrawModalProps {
  token: EarnBalanceToken;
  platform: string;
  render: (onOpen: () => void) => JSX.Element;
}

const WithdrawModal = ({ token, platform, render }: WithdrawModalProps) => {
  const dispatch = useDispatch();

  const { chainId } = useAppSelector(globalSelector);
  const { earnBalances } = useAppSelector(earnSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure();
  const [amount, setAmount] = useState("");

  const [gasPrice, setGasPrice] = useState<string>();
  const [priorityFee, setPriorityFee] = useState<string>();
  const [gasLimit, setGasLimit] = useState<string>();
  const [defaultGasLimit, setDefaultGasLimit] = useState("1000000");
  const [error, setError] = useState<string>();
  const [contractToApprove, setContractToApprove] = useState<string>();
  const { getPrice } = usePrice();
  const nativeUsdPrice = getPrice(NODE[chainId].address);

  // save amount value because amount is reset after close modal.
  const amountRef = useRef("0");
  // check update earnBalance store to avoid effect.
  const isUpdated = useRef(false);

  const {
    withdraw,
    loadingText,
    txHash,
    buildTx,
    resetState,
    error: txError,
  } = useWithdraw(amount, token, platform, gasPrice, gasLimit, priorityFee);

  const balance = getFullDisplayBalance(token.supplyBalance, token.decimals);
  const value = getPrice(token.address) * +balance;

  const tokenAllowance = useTokenAllowance(token?.interestBearingTokenAddress, contractToApprove);

  const gasFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

  useEffect(() => {
    if (isOpenConfirm) {
      buildTx()
        .then((data) => {
          setGasLimit(data.gasLimit);
          setDefaultGasLimit(data.gasLimit);
          setContractToApprove(data.to);
        })
        .catch(console.log);
    }
  }, [isOpenConfirm, buildTx]);

  const handleConfirm = useCallback(() => {
    if (+amount === 0) {
      setError("Please enter the valid amount");
    } else if (+amount > +balance) {
      setError("Insufficient balance.");
    } else {
      isUpdated.current = false;
      amountRef.current = amount;
      withdraw();
    }
  }, [withdraw, amount, balance]);

  const handleCloseModal = useCallback(() => {
    onCloseConfirm();
    setError("");
    setAmount("");
    resetState();
  }, [onCloseConfirm, resetState]);

  useEffect(() => {
    setError("");
    resetState();
  }, [amount, resetState]);

  useEffect(() => {
    if (txHash) handleCloseModal();
  }, [txHash, handleCloseModal]);

  const openModal = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const updateStoreEarnBalance = useCallback(() => {
    if (isUpdated.current) return;
    isUpdated.current = true;
    const updatedEarnBalance = earnBalances.map((earnBalance: EarnBalance) => {
      if (earnBalance.name !== platform) {
        return earnBalance;
      }

      return {
        ...earnBalance,
        balances: earnBalance.balances
          .map((earnToken: EarnBalanceToken) => {
            if (earnToken.address !== token.address) return earnToken;

            const currentSupplyBalance = new BigNumber(earnToken.supplyBalance);
            const restSupplyBalance = currentSupplyBalance.minus(
              new BigNumber(amountRef.current).multipliedBy(new BigNumber(10).pow(earnToken.decimals || 0)),
            );
            return {
              ...earnToken,
              supplyBalance: restSupplyBalance.toString(),
            };
          })
          .filter((earnToken: EarnBalanceToken) => {
            return new BigNumber(earnToken.supplyBalance).isGreaterThan(0);
          }),
      };
    });

    dispatch(setEarnBalances(updatedEarnBalance));
  }, [dispatch, earnBalances, platform, token.address]);

  return (
    <>
      {render(openModal)}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader textAlign="center">Withdraw {token.symbol}</ModalHeader>
          <ModalCloseButton bg="transparent" border="0" color="white" />
          <ModalBody px="10" pt="6">
            <Flex key={token.address} justify="space-between" px="3">
              <Center gridGap="2">
                <Image src={token.logo} w="24px" />
                <Box>{formatNumber(balance, 4)}</Box>
                <Box>{token.symbol}</Box>
              </Center>
              <Box>${formatNumber(value, 2)}</Box>
            </Flex>
          </ModalBody>
          <ModalFooter py="10" justifyContent="space-evenly">
            <Button w="40" colorScheme="primary" mr={3} onClick={onOpenConfirm}>
              Withdraw
            </Button>
            <Button
              w="40"
              colorScheme="primary"
              as={NavLink}
              to={`/supply?chainId=${chainId}&address=${token.address}`}
            >
              Supply more
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenConfirm} onClose={handleCloseModal} isCentered>
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent>
          <ModalHeader textAlign="center" pt="8">
            Withdraw confirmation
          </ModalHeader>
          <ModalCloseButton bg="transparent" border="0" color="white" />
          <ModalBody px="10">
            <Box mb="4">Enter the amount</Box>
            <InputAmount
              value={amount}
              onChange={setAmount}
              onMax={() => setAmount(balance || "")}
              selectedToken={token as any}
              tokens={[token as any]}
              balance={"" + formatNumber(balance, 4)}
            />
            <Box background="gray.800" borderRadius="16" p="6" my="4" pt="4">
              <InfoField
                content={
                  <GasSettings
                    gasPrice={gasPrice}
                    setGasPrice={setGasPrice}
                    gasLimit={gasLimit}
                    setGasLimit={setGasLimit}
                    priorityFee={priorityFee}
                    setPriorityFee={setPriorityFee}
                    defaultGasLimit={defaultGasLimit}
                  />
                }
              />

              <InfoField
                title="Maximum gas fee"
                tooltip="The actual cost of the transaction is generally lower than the maximum estimated cost."
                content={
                  <Text>
                    {formatNumber(gasFee)} {NODE[chainId].currencySymbol}
                  </Text>
                }
              />
              <InfoField
                content={
                  <Flex direction="column" alignItems="flex-end">
                    <Text color="whiteAlpha.700" fontSize="sm">
                      ≈ {formatNumber(+gasFee * nativeUsdPrice, 2)} USD
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="sm">
                      {gasPrice} (Gas Price) * {gasLimit} (Gas Limit)
                    </Text>
                  </Flex>
                }
              />
            </Box>
            <SlideFade in={!!txError || !!error} offsetY="5px">
              <Center color="red.400" fontSize="sm" mt="3" textAlign="center">
                {error || txError.slice(0, 80)}
              </Center>
            </SlideFade>
          </ModalBody>
          <ModalFooter py="10" justifyContent="space-evenly">
            <Button w="40" colorScheme="gray" mr={3} onClick={handleCloseModal} color="white">
              Cancel
            </Button>
            {!token.requiresApproval || +tokenAllowance > 0 ? (
              <Button
                w="40"
                colorScheme="primary"
                loadingText={loadingText}
                disabled={loadingText !== ""}
                isLoading={loadingText !== ""}
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            ) : (
              <ApproveTokenModal
                srcToken={
                  {
                    address: token.interestBearingTokenAddress,
                    symbol: token.interestBearingTokenSymbol,
                  } as any
                }
                spender={contractToApprove}
                render={(onOpen) => (
                  <Button w="40" colorScheme="primary" onClick={onOpen}>
                    Approve
                  </Button>
                )}
              />
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <TxModal
        txHash={txHash}
        txType="WITHDRAW"
        callbackSuccess={() => {
          updateStoreEarnBalance();
        }}
        txDetail={() => (
          <Box mt="2">
            <Text>
              {formatNumber(amountRef.current, 4)} {token?.symbol}
            </Text>
          </Box>
        )}
      />
    </>
  );
};

export default WithdrawModal;
