import { useCallback, useEffect, useMemo, useRef } from "react";
import useActiveTokens from "src/hooks/useActiveTokens";
import { NODE } from "../../config/constants/chain";
import { Token } from "../../config/types";
import { useQuery } from "../../hooks/useQuery";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { globalSelector, setChainId } from "../../store/global";

export const useSetSwapUrl = ({
  srcToken,
  setSrcToken,
  destToken,
  setDestToken,
}: {
  srcToken?: Token;
  setSrcToken: (token?: Token) => void;
  destToken?: Token;
  setDestToken: (token?: Token) => void;
}) => {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);
  const { query, setQuery } = useQuery();

  const { activeTokens: allTokenSupported } = useActiveTokens({});

  const defaultSrcToken = useMemo(
    () =>
      allTokenSupported.find(
        (t) => t.address.toLowerCase() === NODE[chainId].address
      ),
    [allTokenSupported, chainId]
  );

  useEffect(() => {
    const queryChainId = query.get("chainId");
    if (queryChainId) {
      dispatch(setChainId(+queryChainId));
    }
  }, [dispatch]); // eslint-disable-line

  const prevSrcToken = useRef<any>(undefined);
  const prevDestToken = useRef<any>(undefined);

  let srcAddress = query.get("srcAddress") || "";
  const destAddress = query.get("destAddress") || "";

  const syncSrcToken = useCallback(() => {
    if (srcAddress === prevSrcToken.current) return;

    prevSrcToken.current = srcAddress || "";

    let srcTokenUpdated = allTokenSupported.find(
      (token: Token) => token.address.toLowerCase() === srcAddress.toLowerCase()
    );

    if (
      !srcTokenUpdated &&
      defaultSrcToken?.address &&
      destAddress !== defaultSrcToken?.address
    ) {
      srcTokenUpdated = defaultSrcToken;
    }

    setSrcToken(srcTokenUpdated);
  }, [
    allTokenSupported,
    defaultSrcToken,
    destAddress,
    setSrcToken,
    srcAddress,
  ]);

  const syncDestToken = useCallback(() => {
    if (destAddress === prevDestToken.current) return;

    prevDestToken.current = destAddress || "";

    if (destAddress === srcAddress) {
      setDestToken(undefined);
      return;
    }

    let destTokenUpdated = allTokenSupported.find(
      (token: Token) =>
        token.address.toLowerCase() === destAddress.toLowerCase()
    );

    setDestToken(destTokenUpdated);
  }, [allTokenSupported, destAddress, setDestToken, srcAddress]);

  useEffect(() => {
    syncSrcToken();
    syncDestToken();
  }, [syncDestToken, syncSrcToken]);

  useEffect(() => {
    if (srcToken?.address) {
      query.set("srcAddress", srcToken.address);
    }
    setQuery(query.toString());
  }, [srcToken]); // eslint-disable-line

  useEffect(() => {
    if (destToken?.address) {
      query.set("destAddress", destToken.address);
    }
    setQuery(query.toString());
  }, [destToken]); // eslint-disable-line
};
