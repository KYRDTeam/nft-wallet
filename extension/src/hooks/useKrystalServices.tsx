import { Box } from "@chakra-ui/layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SMART_WALLET_PROXY } from "../config/constants/contracts";
import { EarnBalanceToken, Platform, RateType, Token } from "../config/types";
import { globalSelector, setGasPrices } from "../store/global";
import { calculatePriceDifference, calculateTxFee, roundNumber, toBigAmount } from "../utils/helper";
import {
  buildSwapAndDepositTx,
  buildSwapTx,
  buildWithdrawTx,
  fetchGasPrices,
  fetchRates,
  fetchRefPrice,
} from "../utils/krystalService";
import useRefresh from "./useRefresh";
import { useSendTx } from "./useSendTx";
import { useAppDispatch, useAppSelector } from "./useStore";
import { useWallet } from "./useWallet";

export const useRates = (
  src?: Token,
  srcAmount?: string,
  dest?: Token,
  userAddress?: string,
  platformWallet?: string,
) => {
  const [rates, setRates] = useState<RateType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { chainId } = useAppSelector(globalSelector);
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    let cancelUpdateRequest = false;
    if (srcAmount && +srcAmount > 0) {
      fetchRates(chainId, src, srcAmount, dest, userAddress)
        .then((data) => {
          if (!cancelUpdateRequest) {
            setRates(data);
            setIsLoading(false);
          }
        })
        .catch(console.log);
    } else {
      setIsLoading(false);
      setRates(undefined);
    }
    return () => {
      cancelUpdateRequest = true;
    };
  }, [chainId, src, srcAmount, dest, userAddress, platformWallet, fastRefresh]);

  useEffect(() => {
    if (srcAmount && +srcAmount > 0) {
      setIsLoading(true);
      setRates(undefined);
    }
  }, [srcAmount, src?.address, dest?.address]);

  return { rates, isLoading };
};

export const useRefPrice = (rate?: number, src?: Token, dest?: Token) => {
  const [refPrice, setRefprice] = useState<{ refPrice: string; sources: string[] }>();

  const { chainId } = useAppSelector(globalSelector);
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    let cancelUpdateRequest = false;
    fetchRefPrice(chainId, src?.address, dest?.address)
      .then((data) => {
        if (!cancelUpdateRequest) {
          setRefprice(data);
        }
      })
      .catch(console.log);
    return () => {
      cancelUpdateRequest = true;
    };
  }, [chainId, src?.address, dest?.address, fastRefresh]);

  const priceDifference = useMemo(() => {
    if (rate && refPrice) {
      return calculatePriceDifference(rate, +refPrice?.refPrice);
    }
  }, [rate, refPrice]);

  const refPriceDOM = useCallback(() => {
    if (priceDifference) {
      let color = "white";

      if (priceDifference > 0) {
        color = "primary.300";
      }

      if (priceDifference <= -2 && priceDifference > -5) {
        color = "yellow.400";
      }

      if (priceDifference <= -5) {
        color = "red.400";
      }

      return (
        <Box color={color}>
          {priceDifference > 0 && "+"}
          {roundNumber(priceDifference, 2)}%
        </Box>
      );
    } else {
      return <Box>--</Box>;
    }
  }, [priceDifference]);

  return { refPrice, refPriceDOM, priceDifference };
};

export const useFetchGasPrices = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    fetchGasPrices(chainId)
      .then((data: any) => dispatch(setGasPrices(data)))
      .catch(console.log);
  }, [chainId, fastRefresh, dispatch]);
};

export const useSwap = (gasPrice?: string, gasLimit?: string, priorityFee?: string) => {
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { send, loadingText, txHash, resetState: resetSwapState, error } = useSendTx();

  const gasFee = useMemo(() => calculateTxFee(gasPrice || 0, gasLimit || 0), [gasPrice, gasLimit]);

  const swap = useCallback(
    (srcAmount: string, destAmount: string, slippage: string, srcToken?: Token, destToken?: Token, rate?: RateType) => {
      const isMaxNativeAmount = srcToken?.isNative && +srcToken.humanizeBalance <= +srcAmount + +gasFee * 1.05;
      const isWrapTx = rate?.platform.toLowerCase().includes("wrap");
      const toWrapContract = srcToken?.isNative ? destToken?.address : srcToken?.address;

      const srcAmountToSend = isMaxNativeAmount && rate ? Number(srcAmount) - Number(gasFee) * 1.05 : srcAmount;

      let realDestAmount: string | number = destAmount;
      if (isMaxNativeAmount && rate) {
        realDestAmount = +srcAmountToSend * rate.humanizeRate;
      }
      const minDestAmount = +realDestAmount - +realDestAmount * (+slippage / 100);

      send(
        {
          to: isWrapTx ? toWrapContract : SMART_WALLET_PROXY[chainId],
          value: srcToken?.isNative ? toBigAmount(srcAmountToSend, srcToken.decimals) : "0",
          gasPrice,
          gasLimit,
          priorityFee,
        },
        () =>
          buildSwapTx(chainId, {
            userAddress: account,
            hint: rate?.hint,
            src: srcToken?.address,
            dest: destToken?.address,
            srcAmount: toBigAmount(srcAmountToSend, srcToken?.decimals),
            minDestAmount: toBigAmount(minDestAmount, destToken?.decimals),
          }),
      );
    },
    [account, chainId, gasPrice, gasLimit, priorityFee, gasFee, send],
  );

  return { swap, loadingText, txHash, resetSwapState, error };
};

export const useSwapAndDeposit = (
  srcAmount: string | number,
  minDestAmount: number,
  platform?: Platform,
  rate?: RateType,
  srcToken?: Token,
  destToken?: Token,
  gasPrice?: string,
  gasLimit?: string,
  priorityFee?: string,
) => {
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { send, loadingText, txHash, resetState: resetSwapState, error } = useSendTx();

  const buildTx = useCallback(async () => {
    return buildSwapAndDepositTx(chainId, {
      lendingPlatform: platform?.name,
      userAddress: account,
      hint: rate?.hint,
      src: srcToken?.address,
      dest: destToken?.address,
      srcAmount: toBigAmount(srcAmount, srcToken?.decimals),
      minDestAmount: toBigAmount(minDestAmount, destToken?.decimals),
    });
  }, [
    chainId,
    platform?.name,
    account,
    rate?.hint,
    srcToken?.address,
    srcToken?.decimals,
    destToken?.address,
    destToken?.decimals,
    srcAmount,
    minDestAmount,
  ]);

  const swap = useCallback(() => {
    send(
      {
        to: SMART_WALLET_PROXY[chainId],
        value: srcToken?.isNative ? toBigAmount(srcAmount, srcToken.decimals) : "0",
        gasPrice,
        gasLimit,
        priorityFee,
      },
      async () => {
        const data = await buildTx();
        return data.data;
      },
    );
  }, [chainId, gasPrice, gasLimit, priorityFee, srcAmount, srcToken, send, buildTx]);

  return { buildTx, swap, loadingText, txHash, resetSwapState, error };
};

export const useWithdraw = (
  amount: string,
  token?: EarnBalanceToken,
  platform?: string,
  gasPrice?: string,
  gasLimit?: string,
  priorityFee?: string,
) => {
  const { chainId } = useAppSelector(globalSelector);
  const { account } = useWallet();
  const { send, loadingText, txHash, resetState, error } = useSendTx();
  const [receiveContract, setReceiveContract] = useState<string>();

  const buildTx = useCallback(async () => {
    const builtData = await buildWithdrawTx(chainId, {
      lendingPlatform: platform,
      userAddress: account,
      token: token?.address,
      amount: toBigAmount(amount || 1, token?.decimals),
    });
    setReceiveContract(builtData.to);
    return builtData;
  }, [chainId, platform, account, token?.address, token?.decimals, amount]);

  const withdraw = useCallback(() => {
    if (receiveContract) {
      send(
        {
          from: account,
          to: receiveContract,
          gasPrice,
          gasLimit,
          priorityFee,
        },
        async () => {
          const data = await buildTx();
          return data.data;
        },
      );
    }
  }, [account, gasPrice, gasLimit, priorityFee, receiveContract, send, buildTx]);

  return { buildTx, withdraw, loadingText, txHash, resetState, error };
};
