import { globalSelector, setAppSettings } from "./../store/global";
import { useCallback, useEffect } from "react";
import { KRYSTAL_API } from "src/config/constants/constants";
import { ChainId } from "src/config/types";
import { useAppSelector } from "./useStore";
import { useDispatch } from "react-redux";

export default function useFetchAppSettings() {
  const { chainId } = useAppSelector(globalSelector);
  const dispatch = useDispatch();

  const fetchPageSettings = useCallback(async () => {
    try {
      const response = await fetch(
        `${KRYSTAL_API[chainId as ChainId]}/v1/mkt/banners`
      );
      const result = await response.json();
      dispatch(setAppSettings(result.banners));
    } catch (e) {
      throw e;
    }
  }, [chainId, dispatch]);

  useEffect(() => {
    fetchPageSettings();
  }, [fetchPageSettings]);
}
