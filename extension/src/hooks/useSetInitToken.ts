import { useEffect, useMemo } from "react";

import useActiveTokens from "./useActiveTokens";
import usePrevious from "./usePrevious";
import { useAppSelector } from "./useStore";
import { globalSelector } from "src/store/global";

import { NODE } from "src/config/constants/chain";
import { Token } from "src/config/types";
import { differenceWith, isEqual, isEmpty } from "lodash";
import { useLocation } from "react-router-dom";

const useSetInitToken = ({
  token,
  setToken,
  exchange = false,
}: {
  token?: Token;
  setToken: (e?: Token) => void;
  exchange?: boolean;
}) => {
  const { activeTokens: allTokenSupported } = useActiveTokens({});
  const { chainId } = useAppSelector(globalSelector);
  const prevActiveTokens = usePrevious(allTokenSupported);
  const prevChainId = usePrevious(chainId);

  const location = useLocation();

  const params: any = useMemo(() => {
    const queryString = location.search;

    let params = new URLSearchParams(queryString);
    return params;
  }, [location.search]);

  const currentAddress = useMemo(() => {
    if (prevChainId !== chainId) {
      return NODE[chainId].address;
    }
    return token?.address ?? NODE[chainId].address;
  }, [chainId, prevChainId, token?.address]);

  useEffect(() => {
    const initValue = params.get("token") || NODE[chainId].address;

    if (!token && !exchange) {
      const defaultToken = allTokenSupported.find((t: any) => t.address.toLowerCase() === initValue);
      setToken(defaultToken);
    }
  }, [allTokenSupported, chainId, setToken, token, params, exchange]);

  useEffect(() => {
    if (differenceWith(prevActiveTokens, allTokenSupported, isEqual).length > 0) {
      const defaultToken = allTokenSupported.find((t: any) => t.address.toLowerCase() === currentAddress);
      if (!isEmpty(defaultToken)) {
        setToken(defaultToken);
      }
    }
  }, [allTokenSupported, prevActiveTokens, currentAddress, setToken, chainId, exchange]);
};

export default useSetInitToken;
