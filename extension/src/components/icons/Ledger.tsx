import { Image } from "@chakra-ui/image";
import LedgerSVG from "../../assets/images/icons/ledger.svg";

export default function Ledger(props: any) {
  return <Image src={LedgerSVG} w="30px" {...props}></Image>;
}
