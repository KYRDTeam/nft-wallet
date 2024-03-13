import { useEffect, useRef } from "react";
import { globalSelector, setFetchingMarket, setMarket } from "src/store/global";
import { fetchTokenOverview } from "src/utils/krystalService";
import useRefresh from "./useRefresh";
import { useAppDispatch, useAppSelector } from "./useStore";

export const useMarket = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);
  const forceUpdate = useRef(false);
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    forceUpdate.current = true;
  }, [chainId]);

  useEffect(() => {
    let cancelUpdateRequest = false;
    dispatch(setFetchingMarket(forceUpdate.current));

    fetchTokenOverview(chainId)
      .then((marketTokens) => {
        if (!cancelUpdateRequest) {
          dispatch(
            setMarket({
              market: marketTokens as any,
              isForceUpdate: true,
            })
          );
          dispatch(setFetchingMarket(false));
          forceUpdate.current = false;
        }
      })
      .catch((e) => {
        dispatch(setFetchingMarket(false));
        forceUpdate.current = false;
        throw e;
      });

    return () => {
      cancelUpdateRequest = true;
    };
  }, [chainId, dispatch, fastRefresh]);
};
