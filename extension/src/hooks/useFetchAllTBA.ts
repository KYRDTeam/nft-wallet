import { getTBAs } from 'src/utils/web3';
import { useEffect, useState } from "react";
import { ChainId } from "src/config/types";
import { useAppDispatch } from "./useStore";
import { setAllAccountTBAs } from "src/store/keys";
import { TBA_HELPER_CONTRACT } from "src/config/constants/contracts";

export const useFetchAllTBA = ({ addresses, chainId }: { addresses: string[], chainId: ChainId }) => {
    const [loading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch()
 
    const fetchData = async () => {
        setIsLoading(true)
        await Promise.all(addresses.map(async (address) => {
            let tbaAddresses = await getTBAs(chainId, address, TBA_HELPER_CONTRACT)
            if (tbaAddresses) {
                dispatch(
                    setAllAccountTBAs({
                        account: address || "",
                        addresses: tbaAddresses,
                        tba: false,
                        chainId: chainId
                    })
                );
            }
        }))

        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [addresses, chainId])

    return { loading };
};
