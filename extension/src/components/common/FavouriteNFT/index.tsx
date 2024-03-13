import { Button } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import useCustomToast from "src/hooks/useCustomToast";
import { useSign } from "src/hooks/useSign";
import { useWallet } from "src/hooks/useWallet";
import useFetch from "use-http";
import { FavouriteIcon } from "../icons";

export const FavouriteNFT = ({
  favourite,
  tokenID,
  collectibleAddress,
}: {
  favourite: boolean;
  tokenID: string;
  collectibleAddress: string;
}) => {
  const [isFavourite, setFavourite] = useState(favourite);
  const { post, loading } = useFetch("/v1/account/registerFavoriteNft");
  const { sign } = useSign();
  const { account } = useWallet();
  const toast = useCustomToast();

  const handleFavourite = useCallback(async () => {
    if (!account) return;

    const signature = await sign(tokenID, account, "");
    if (!signature) {
      toast({ status: "error", title: "Attempt to sign message failed" });
      return;
    }

    const nextFavouriteStatus = !isFavourite;
    setFavourite(nextFavouriteStatus);

    await post({
      address: account,
      collectibleAddress,
      tokenID,
      signature,
      favorite: nextFavouriteStatus ? "1" : "0",
    });
  }, [account, collectibleAddress, isFavourite, post, sign, toast, tokenID]);

  return (
    <Button
      w="10"
      h="10"
      p="0"
      bg="transparent"
      _hover={{ bg: "transparent" }}
      justifyContent="center"
      alignItems="center"
      isDisabled={!account || loading}
      onClick={handleFavourite}
    >
      <FavouriteIcon
        stroke={isFavourite ? "primary.300" : "whiteAlpha.900"}
        fill={isFavourite ? "primary.300" : "none"}
      />
    </Button>
  );
};
