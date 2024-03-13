import { useEffect } from "react";
import { NODE } from "src/config/constants/chain";
import { Token } from "src/config/types";
import useActiveTokens from "src/hooks/useActiveTokens";
import { useQuery } from "src/hooks/useQuery";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { globalSelector, setChainId } from "src/store/global";

const useSetTransferUrl = ({ token, setToken }: { token?: Token; setToken: (token?: Token) => void }) => {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);
  const { query, setQuery } = useQuery();

  const { activeTokens: allTokenSupported } = useActiveTokens({});

  useEffect(() => {
    const queryChainId = query.get("chainId");
    if (queryChainId) {
      dispatch(setChainId(+queryChainId));
    }
  }, [dispatch]); // eslint-disable-line

  useEffect(() => {
    if (token) {
      const tok = allTokenSupported.find((t) => t.address.toLowerCase() === token.address.toLowerCase());
      setToken && setToken(tok);
    } else {
      const defaulttoken = allTokenSupported.find((t) => t.address.toLowerCase() === NODE[chainId].address);
      setToken && setToken(defaulttoken);
    }
  }, [allTokenSupported]); // eslint-disable-line

  useEffect(() => {
    const tokenAddress = query.get("tokenAddress");
    if (tokenAddress) {
      setToken(allTokenSupported.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase()));
    }
  }, [allTokenSupported]); // eslint-disable-line

  useEffect(() => {
    if (token?.address) {
      query.set("tokenAddress", token.address);
    }
    setQuery(query.toString());
  }, [token]); // eslint-disable-line
};

export default useSetTransferUrl;
