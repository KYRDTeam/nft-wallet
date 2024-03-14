import { useWallet } from "./useWallet";
import { getNftBalance } from 'src/utils/web3';
import { useEffect, useState } from "react";
import { ChainId } from "src/config/types";


export const useFetchTBANFT = ({ address, chainId }: { address: string, chainId: ChainId }) => {
    const [data, setData] = useState({})
    const [loading, setIsLoading] = useState(false);

    const collectionAddress = "0xca6eacF9912571EEdaE32A4C4740208aa499197f"
    const collectionName = "TBA"

    const fetchData = async () => {
        setIsLoading(true)

        let balance = await getNftBalance(chainId, address, collectionAddress)
        if (!balance) {
            setData({})
            
        } else {
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
