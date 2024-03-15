import { getNftBalance } from "src/utils/web3";
import { useEffect, useState, useCallback } from "react";
import { ChainId } from "src/config/types";
import { TBA_NFT } from "src/config/constants/contracts";

export const useFetchTBANFT = ({
  address,
  chainId,
}: {
  address: string;
  chainId: ChainId;
}) => {
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    async (chainId: ChainId) => {
      const collectionAddress = TBA_NFT[chainId];
      const collectionName = "Smart Accounts";
      setIsLoading(true);

      let balance = await getNftBalance(chainId, address, collectionAddress);
      if (balance) {
        let data = {
          balances: [
            {
              collectibleAddress: collectionAddress,
              collectibleName: collectionName,
              items: balance,
            },
          ],
        };
        setData(data);
      }
      setIsLoading(false);
    },
    [address]
  );

  useEffect(() => {
    fetchData(chainId);
  }, [address, chainId, fetchData]);

  return { data, loading };
};
