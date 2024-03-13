import { Image } from "@chakra-ui/image";
import TrezorSVG from "../../assets/images/icons/trezor.svg";

export default function Trezor(props: any) {
  return <Image src={TrezorSVG} w="30px" {...props}></Image>;
}
