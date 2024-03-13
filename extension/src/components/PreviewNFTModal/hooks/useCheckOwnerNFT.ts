import { useCallback, useEffect, useState } from "react";
import { NFT_TYPE } from "src/config/constants/constants";
import { useAppSelector } from "src/hooks/useStore";
import { useWallet } from "src/hooks/useWallet";
import { globalSelector } from "src/store/global";
import { checkNFTOwner } from "src/utils/web3";

export default function useCheckOwnerNFT({
  collectibleAddress,
  tokenID,
}: {
  collectibleAddress: string;
  tokenID: string;
}) {
  const [isOwner, setIsOwner] = useState(false);
  const [type, setType] = useState(NFT_TYPE.UNKNOWN);
  const [loading, setLoading] = useState(false);

  const { account: connectedWallet } = useWallet();

  const { chainId: localChainId } = useAppSelector(globalSelector);
  const { ethereum } = useWallet();

  const checkOwner = useCallback(async () => {
    setLoading(true);
    if (!connectedWallet || !ethereum || !localChainId) {
      setLoading(false);
      return;
    }

    const { type, isOwner } = await checkNFTOwner(
      ethereum,
      localChainId,
      connectedWallet || "",
      collectibleAddress,
      tokenID
    );

    setLoading(false);
    setIsOwner(isOwner);
    setType(type);
  }, [collectibleAddress, connectedWallet, tokenID, ethereum, localChainId]);

  useEffect(() => {
    if (!collectibleAddress || !tokenID) return;
    checkOwner();
  }, [checkOwner, collectibleAddress, tokenID]);

  return { loading, isOwner, type };
}
