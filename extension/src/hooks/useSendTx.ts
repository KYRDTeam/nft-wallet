import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { updateHashList } from "src/store/hash";
import { getTransferTokenObj } from "src/utils/erc20";
import { calculateTxFee, toBigAmount } from "src/utils/helper";
import { Token, TxParams } from "../config/types";
import { globalSelector } from "../store/global";
import { estimateGas, sendRawTx, getCurrentNonce } from "../utils/web3";
import { useAppSelector } from "./useStore";
import { useWallet } from "./useWallet";
import { hashSelector } from "../store/hash";
import { keysSelector } from "src/store/keys";
import { modifyDataForTBA } from "src/utils/tba";

export const useSendTx = () => {
  const { chainId, switchChain, signTransaction } = useWallet();
  const { chainId: globalChainId } = useAppSelector(globalSelector);
  const { account: storeAccount } = useWallet();
  const [isBuildingTx, setIsBuildingTx] = useState(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [estimatingGas, setEstimatingGas] = useState(false);
  const [isConfirmTx, setIsConfirmTx] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const { hashList } = useAppSelector(hashSelector);
  const { accountsTBA, accounts } = useAppSelector(keysSelector);
  const [isTBA, setIsTBA] = useState(false);

  const account = useMemo(() => {
    if (accounts.includes(storeAccount || "")) {
      return storeAccount;
    }
    let acc = undefined;
    Object.keys(accountsTBA).forEach((e) => {
      if (!!accountsTBA[e].find((f) => f.address === storeAccount)) {
        acc = e;
        setIsTBA(true);
      }
    });
    return acc;
  }, [accounts, accountsTBA, storeAccount]);

  const dispatch = useDispatch();

  const getNextNonce = useCallback(
    async (from: string) => {
      try {
        const nonce = await getCurrentNonce(globalChainId, from);
        const currentNonce = Number(nonce);

        const dataFilter = hashList.filter(
          (e: any) => e.account === account && e.chainId === globalChainId
        );

        const listNewNonce = dataFilter.map((e: any) => Number(e.nonce)).sort();
        if (listNewNonce.length === 0) {
          return currentNonce;
        }
        const indexCurrentNonce = listNewNonce.indexOf(currentNonce);
        if (indexCurrentNonce === -1) {
          if (listNewNonce[0] > currentNonce) {
            return currentNonce + listNewNonce.length;
          }
          // dispatch(resetHashList([]));
          return currentNonce;
        }

        return (
          currentNonce +
          dataFilter.slice(indexCurrentNonce + 1, listNewNonce.length).length +
          1
        );
      } catch (err) {
        console.log(err);
      }
    },
    [account, globalChainId, hashList]
  );

  const send = useCallback(
    async (params: TxParams, buildTxFunc?: () => Promise<string>) => {
      try {
        if (!account) return;

        setError("");
        if (chainId !== globalChainId) {
          setIsSwitchingChain(true);
          switchChain(globalChainId);
          setIsSwitchingChain(false);
        }

        let txObj = isTBA
          ? {
              ...params,
              from: account,
              to: storeAccount,
              data: modifyDataForTBA(globalChainId, params, storeAccount),
            }
          : { ...params, from: account };

        if (buildTxFunc) {
          setIsBuildingTx(true);
          const data = await buildTxFunc();
          txObj = isTBA
            ? {
                ...params,
                from: account,
                to: storeAccount,
                data: modifyDataForTBA(globalChainId, params, storeAccount),
              }
            : { ...params, from: account, data: data };
          setIsBuildingTx(false);
        }

        if (!txObj.nonce) {
          const nextNonce = await getNextNonce(txObj.from);
          if (nextNonce) {
            txObj = { ...txObj, nonce: nextNonce };
          }
        }

        console.log(txObj);

        setEstimatingGas(true);
        await estimateGas(globalChainId, txObj);
        setEstimatingGas(false);

        setIsConfirmTx(true);

        const rawTx = await signTransaction(txObj, account);

        await sendRawTx(globalChainId, rawTx, (hash: any) => {
          setTxHash(hash);
          !!hash &&
            dispatch(
              updateHashList({
                ...txObj,
                hash,
                account: isTBA ? storeAccount : account,
                chainId: globalChainId,
              })
            );
        });
      } catch (error: any) {
        console.log(error);
        setError(error.message);
        setIsSwitchingChain(false);
        setEstimatingGas(false);
        setIsBuildingTx(false);
        setIsConfirmTx(false);
      }
    },
    [
      account,
      chainId,
      globalChainId,
      isTBA,
      storeAccount,
      signTransaction,
      switchChain,
      getNextNonce,
      dispatch,
    ]
  );

  useEffect(() => {
    if (txHash) setIsConfirmTx(false);
  }, [txHash]);

  const loadingText = (() => {
    if (isSwitchingChain) return "Switching chain";
    if (isBuildingTx) return "Building tx";
    if (estimatingGas) return "Estimating gas";
    if (isConfirmTx) return "Confirming";
    return "";
  })();

  const resetState = useCallback(() => {
    setTxHash("");
    setError("");
    setIsSwitchingChain(false);
    setEstimatingGas(false);
    setIsBuildingTx(false);
    setIsConfirmTx(false);
  }, []);

  return { send, loadingText, txHash, resetState, error };
};

export const useTransfer = (
  gasPrice?: string,
  gasLimit?: string,
  priorityFee?: string
) => {
  const { chainId } = useAppSelector(globalSelector);
  const {
    send,
    loadingText,
    txHash,
    resetState: resetTransferState,
    error,
  } = useSendTx();

  const gasFee = useMemo(
    () => calculateTxFee(gasPrice || 0, gasLimit || 0),
    [gasPrice, gasLimit]
  );

  const transfer = useCallback(
    (recipient: string, amount: string, token?: Token) => {
      const isMaxNativeAmount =
        token?.isNative && +token.humanizeBalance <= +amount + +gasFee * 1.05;

      const amountToSend = isMaxNativeAmount
        ? Number(amount) - Number(gasFee) * 1.05
        : amount;

      send(
        {
          to: token?.isNative ? recipient : token?.address,
          value: token?.isNative
            ? toBigAmount(amountToSend, token.decimals)
            : "0",
          gasPrice,
          gasLimit,
          priorityFee,
        },
        async () => {
          if (token) {
            const data = getTransferTokenObj(
              chainId,
              token?.address,
              recipient,
              toBigAmount(amount, token?.decimals)
            );
            return data || "";
          } else {
            return "";
          }
        }
      );
    },
    [chainId, gasPrice, gasLimit, priorityFee, gasFee, send]
  );

  return { transfer, loadingText, txHash, resetTransferState, error };
};
