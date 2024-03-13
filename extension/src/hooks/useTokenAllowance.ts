import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { approveToken, getTokenAllowance } from "../utils/erc20";
import { useWallet } from "./useWallet";
import useRefresh from "./useRefresh";
import { useAppSelector } from "./useStore";
import { globalSelector } from "src/store/global";
import { NODE } from "src/config/constants/chain";
import { Token } from "src/config/types";
import BigNumber from "bignumber.js";
import { useInterval } from "@chakra-ui/react";

export const useTokenAllowance = (tokenAddress?: string, spender?: string) => {
  const [allowance, setAllowance] = useState("0");
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { fastRefresh } = useRefresh();

  useEffect(() => setAllowance("0"), [tokenAddress]);

  useEffect(() => {
    async function getAllowance() {
      if (allowance === "0" && account && tokenAddress && spender && chainId) {
        const allowance = await getTokenAllowance(
          chainId,
          tokenAddress,
          account,
          spender
        );
        setAllowance(allowance);
      }
    }
    getAllowance();
  }, [account, allowance, tokenAddress, fastRefresh, spender, chainId]);

  return allowance;
};

export const useTokenAllowanceV2 = (
  token: Token,
  spender: string,
  amount: number
) => {
  const [allowance, setAllowance] = useState("0");
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();

  const [loading, setLoading] = useState(true);

  const isIntervalRequest = useRef(false);
  useEffect(() => {
    isIntervalRequest.current = false;
  }, [token.address, amount]);

  const getAllowance = useCallback(async () => {
    if (!account) return;
    if (!token.address) return;

    !isIntervalRequest.current && setLoading(true);
    const allowance = await getTokenAllowance(
      chainId,
      token.address,
      account,
      spender
    );

    setAllowance(allowance);

    !isIntervalRequest.current && setLoading(false);
  }, [account, chainId, spender, token.address]);

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  useInterval(() => {
    isIntervalRequest.current = true;
    getAllowance();
  }, 10000);

  const isApproved = useMemo(() => {
    // native token
    if (
      token.address &&
      NODE[chainId].address.toLowerCase() === token.address.toLowerCase()
    ) {
      return true;
    }

    return new BigNumber(allowance)
      .dividedBy(new BigNumber(10).pow(token.decimals))
      .isGreaterThanOrEqualTo(+amount);
  }, [chainId, token?.address, token.decimals, allowance, amount]);

  return { allowance, loading, reload: getAllowance, isApproved };
};

export const useApprove = () => {
  const { account, chainId, ethereum } = useWallet();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleApprove = useCallback(
    async (address: string, spender: string) => {
      setError("");

      if (account && chainId) {
        setLoading(true);
        try {
          const tx = await approveToken(
            chainId,
            address,
            spender,
            account,
            ethereum
          );
          setLoading(false);
          return tx;
        } catch (e: any) {
          console.log(e.message);
          setError(e.message);
          setLoading(false);
          return;
        }
      }
    },
    [account, chainId, ethereum]
  );

  return {
    onApprove: handleApprove,
    error,
    loading,
  };
};
