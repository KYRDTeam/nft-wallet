import { Image } from "@chakra-ui/image";
import WalletConnectSvg from "../../assets/images/icons/walletconnect.svg";

export default function WalletConnect(props: any) {
  return <Image src={WalletConnectSvg} w="30px" {...props}></Image>;
}
