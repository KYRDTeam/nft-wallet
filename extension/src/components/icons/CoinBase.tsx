import { Image } from "@chakra-ui/image";
import CoinbaseLogo from "../../assets/images/icons/coinbase.svg";

export default function Coinbase(props: any) {
  return <Image src={CoinbaseLogo} w="30px" {...props}></Image>;
}
