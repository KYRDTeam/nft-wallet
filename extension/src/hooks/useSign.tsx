import { get } from "lodash";
import { useCallback, useState } from "react";
import { signMessage } from "src/utils/web3";
import { useWallet } from "./useWallet";

export const useSign = () => {
  const { chainId, ethereum, account } = useWallet();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");

  const sign = useCallback(
    async (message: string, address: string, password: string) => {
      setError("");
      if (!account) return;
      setIsConfirming(true);

      try {
        const signature = await signMessage(
          // @ts-ignore
          chainId,
          message,
          address,
          password,
          ethereum
        );

        setIsConfirming(false);
        return signature;
      } catch (e) {
        setIsConfirming(false);
        setError(get(e, "message", "Something went wrong!"));
        return "";
      }
    },
    [account, chainId, ethereum]
  );

  return { sign, isConfirming, error };
};
