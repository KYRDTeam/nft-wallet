import { getTBAs } from "src/utils/web3";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useStore";
import { setAllAccountTBAs } from "src/store/keys";
import { TBA_HELPER_CONTRACT } from "src/config/constants/contracts";
import { keysSelector } from "../store/keys";
import { ChainId } from "src/config/types";
import { SUPPORTED_TBA_CHAINS } from "src/config/constants/constants";
import { useState } from "react";

export const useFetchAllTBA = () => {
  const dispatch = useAppDispatch();
  const { accounts, tbaFetchRef } = useAppSelector(keysSelector);
  const [tbas, setTbas] = useState<
    { account: string; address: string; tba: boolean; chainId: ChainId }[]
  >([]);
  const [count, setCount] = useState(0);

  const fetchData = useCallback(
    async (chainId: ChainId) => {
      await Promise.all(
        accounts.map(async (address) => {
          let tbaAddresses = await getTBAs(
            chainId,
            address,
            TBA_HELPER_CONTRACT
          );
          let tbaItems: {
            account: string;
            address: string;
            tba: boolean;
            chainId: ChainId;
          }[] = [];
          (tbaAddresses || []).forEach((item: any) => {
            tbaItems.push({
              account: address || "",
              address: item,
              tba: false,
              chainId: chainId,
            });
          });
          setTbas((prev) => [...prev, ...tbaItems]);
          setCount((prev) => prev + 1);
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accounts, dispatch]
  );

  useEffect(() => {
    setTbas([]);
    setCount(0);
    SUPPORTED_TBA_CHAINS.forEach((chainId) => {
      fetchData(chainId);
    });
  }, [accounts, fetchData, tbaFetchRef]);

  useEffect(() => {
    if (count === SUPPORTED_TBA_CHAINS.length * accounts.length) {
      dispatch(setAllAccountTBAs(tbas));
    }
  }, [accounts.length, count, dispatch, tbas]);
};
