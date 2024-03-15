import { getNftBalance, getTBAs } from 'src/utils/web3';
import { useEffect, useState } from "react";
import { ChainId } from "src/config/types";
import { TBA_NFT } from "src/config/constants/contracts";

export const useFetchTBANFT = ({ address, chainId }: { address: string, chainId: ChainId }) => {
    const [data, setData] = useState({})
    const [loading, setIsLoading] = useState(false);

    const collectionAddress = TBA_NFT[chainId]
    const collectionName = "TBA"

    const fetchData = async () => {
        setIsLoading(true)

        let balance = await getNftBalance(chainId, address, collectionAddress)
        if (balance) {
            let data = {
                balances: [{
                    collectibleAddress: collectionAddress,
                    collectibleName: collectionName,
                    items: balance
                }]
            }
            setData(data)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [address])

    return { data, loading };
};
