import { Image, ImageProps } from "@chakra-ui/image";
import defaultTokenIcon from "../../assets/images/tokens/none.png";

export default function TokenLogo(props: ImageProps) {
  return (
    <Image
      src={props.src}
      fallbackSrc={defaultTokenIcon}
      alt="Token-icon"
      borderRadius="50%"
      boxSize="7"
      {...props}
    />
  );
}
