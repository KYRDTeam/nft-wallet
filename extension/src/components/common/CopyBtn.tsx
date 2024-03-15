import { Image, useClipboard } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import Copy from "src/assets/images/icons/copy.svg";

export default function CopyBtn({
  data,
  ...props
}: {
  data: string;
  [key: string]: any;
}) {
  const { hasCopied, onCopy } = useClipboard(data || "");

  return (
    <Tooltip
      label={hasCopied ? "Copied!" : "Copy"}
      placement="bottom"
      bg="gray.500"
      color="whiteAlpha.700"
      hasArrow
      mt={2}
      closeDelay={500}
      _hover={{
        opacity: 0.7,
      }}
    >
      <Image
        src={Copy}
        alt="copy icon"
        cursor="pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onCopy();
        }}
        w={3}
        h={3}
        {...props}
      />
    </Tooltip>
  );
}
