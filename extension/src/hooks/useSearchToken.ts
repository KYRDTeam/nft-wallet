import { useCallback, useState } from "react";
import { Token } from "src/config/types";
import { globalSelector } from "src/store/global";
import { fetchTokenOverview } from "src/utils/krystalService";
import { fetchTokenSymbolAndDecimal } from "src/utils/web3";
import { useAppSelector } from "./useStore";

export default function useSearchToken() {
  const [token, setToken] = useState<Token>();
  const [loading, setLoading] = useState(false);
  const { chainId } = useAppSelector(globalSelector);

  const clear = useCallback(() => {
    setToken(undefined);
  }, []);

  const searchToken = useCallback(
    async (address: string) => {
      setLoading(true);
      setToken(undefined);
      try {
        const response = await fetchTokenOverview(chainId, [address]);

        if (response && response.length) {
          setToken(response[0]);
          setLoading(false);
          return;
        }

        // get data from node.
        const token: Token | null = await fetchTokenSymbolAndDecimal(
          address,
          chainId
        );

        if (token) {
          setToken(token);
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (e) {
        setLoading(false);
        throw e;
      }
    },
    [chainId]
  );

  return { token, loading, searchToken, clear };
}
