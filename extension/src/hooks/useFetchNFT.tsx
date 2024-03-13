import { globalSelector } from "src/store/global";
import useFetch from "use-http";
import { useAppSelector } from "./useStore";

export const useFetchNFT = ({ address }: { address: string }) => {
  const { chainId } = useAppSelector(globalSelector);

  const { data, loading } = useFetch(
    `/v1/account/nftBalances?address=${address}`,
    {},
    [address, chainId]
  );

  return { data, loading };
};
