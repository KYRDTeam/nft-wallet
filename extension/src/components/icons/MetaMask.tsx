import { Image } from "@chakra-ui/image";
import MetaMaskLogo from "../../assets/images/icons/metamask.png";

export default function MetaMask(props: any) {
  return <Image src={MetaMaskLogo} w="30px" {...props}></Image>;
}
