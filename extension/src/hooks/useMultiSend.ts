import { MultiSendRecipientType } from "./../config/types/index";
import { useCallback, useMemo, useState } from "react";
import useFetch from "use-http";
import { useSendTx } from "./useSendTx";
import { get } from "lodash";
import { hexToNumber } from "web3-utils";

export const useMultiSend = (
  gasPrice?: string,
  gasLimit?: string,
  priorityFee?: string,
  setInitialGasLimit?: (gasLimit: any) => void
) => {
  const { post } = useFetch("/v1/transfer/buildMultisendTx");
  const [txObject, setTxObject] = useState({});
  const [loadingBuildTx, setLoadingBuildTx] = useState(false);

  const {
    send,
    loadingText,
    txHash,
    resetState: resetSwapState,
    error,
  } = useSendTx();

  const buildTx = useCallback(
    async (params: {
      senderAddress: string;
      sends: MultiSendRecipientType[];
    }) => {
      try {
        setLoadingBuildTx(true);
        const { txObject } = await post(params);

        setTxObject(txObject);
        setInitialGasLimit &&
          setInitialGasLimit(hexToNumber(get(txObject, "gasLimit")));
      } catch (e) {
        console.log(e);
      }
      setLoadingBuildTx(false);
    },
    [post, setInitialGasLimit]
  );

  const transfer = useCallback(() => {
    try {
      send({
        ...txObject,
        gasPrice,
        priorityFee,
      });
    } catch (e) {
      console.log(e);
    }
  }, [gasPrice, priorityFee, send, txObject]);

  const loadingTxt = useMemo(() => {
    if (loadingBuildTx) return "Building Tx";
    return loadingText;
  }, [loadingBuildTx, loadingText]);

  return {
    transfer,
    loadingText: loadingTxt,
    txHash,
    resetSwapState,
    error,
    buildTx,
    txObject,
  };
};
