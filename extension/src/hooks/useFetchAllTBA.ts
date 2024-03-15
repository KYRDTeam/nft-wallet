import { getTBAs } from "src/utils/web3";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useStore";
import { setAllAccountTBAs } from "src/store/keys";
import { TBA_HELPER_CONTRACT } from "src/config/constants/contracts";
import { keysSelector } from "../store/keys";
import { ChainId } from "src/config/types";
import { SUPPORTED_TBA_CHAINS } from "src/config/constants/constants";

export const useFetchAllTBA = () => {
  const dispatch = useAppDispatch();
  const { accounts, tbaFetchRef } = useAppSelector(keysSelector);

  const fetchData = useCallback(
    async (chainId: ChainId) => {
      await Promise.all(
        accounts.map(async (address) => {
          let tbaAddresses = await getTBAs(
            chainId,
            address,
            TBA_HELPER_CONTRACT
          );
          dispatch(
            setAllAccountTBAs({
              account: address || "",
              addresses: tbaAddresses,
              tba: false,
              chainId: chainId,
            })
          );
        })
      );
    },
    [accounts, dispatch]
  );

  useEffect(() => {
    SUPPORTED_TBA_CHAINS.forEach((chainId) => {
      fetchData(chainId);
    });
  }, [accounts, fetchData, tbaFetchRef]);
};
