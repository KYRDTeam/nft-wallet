import { useEffect } from "react";
import { NODE } from "src/config/constants/chain";
import { EarnToken, Token } from "src/config/types";
import { useQuery } from "src/hooks/useQuery";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";
import { earnSelector } from "src/store/earn";
import { globalSelector, setChainId } from "src/store/global";

const useSetSupplyUrl = ({
  srcToken,
  setSrcToken,
  destToken,
  setDestToken,
}: {
  srcToken?: Token;
  setSrcToken?: (token?: Token) => void;
  destToken?: EarnToken;
  setDestToken?: (token?: EarnToken) => void;
}) => {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);
  const { earnList } = useAppSelector(earnSelector);
  const { tokens } = useChainTokenSelector();
  const { query, setQuery } = useQuery();

  useEffect(() => {
    const queryChainId = query.get("chainId");
    if (queryChainId) {
      dispatch(setChainId(+queryChainId));
    }
  }, [dispatch]); // eslint-disable-line

  useEffect(() => {
    if (srcToken) {
      const token = tokens.find(
        (t) => t.address.toLowerCase() === srcToken.address
      );
      setSrcToken && setSrcToken(token);
    } else {
      const defaultSrcToken = tokens.find(
        (t) => t.address.toLowerCase() === NODE[chainId].address
      );
      setSrcToken && setSrcToken(defaultSrcToken);
    }
  }, [srcToken, tokens, chainId]); // eslint-disable-line

  useEffect(() => {
    const address = query.get("address");
    if (address) {
      setDestToken &&
        setDestToken(
          earnList.find(
            (t) => t.address.toLowerCase() === address.toLowerCase()
          )
        );
    } else {
      setDestToken && setDestToken();
    }
  }, [earnList]); // eslint-disable-line

  useEffect(() => {
    if (destToken?.address) {
      query.set("address", destToken.address);
    }
    setQuery(query.toString());
  }, [destToken]); // eslint-disable-line
};

export default useSetSupplyUrl;
