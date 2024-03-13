import { useEffect } from "react";
import { useChainTokenSelector } from "src/hooks/useTokenSelector";
import { Token } from "../../config/types";
import { useQuery } from "../../hooks/useQuery";
import { useAppDispatch } from "../../hooks/useStore";
import { setChainId } from "../../store/global";

export const useSetTokenUrl = ({
  setToken,
}: {
  setToken: (token?: Token) => void;
}) => {
  const dispatch = useAppDispatch();
  const { tokens } = useChainTokenSelector();
  const { query } = useQuery();

  useEffect(() => {
    const queryChainId = query.get("chainId");
    if (queryChainId) {
      dispatch(setChainId(+queryChainId));
    }
  }, [dispatch]); // eslint-disable-line

  useEffect(() => {
    const address = query.get("address");
    if (address) {
      setToken(
        tokens.find((t) => t.address.toLowerCase() === address.toLowerCase())
      );
    }
  }, [tokens]); // eslint-disable-line
};
