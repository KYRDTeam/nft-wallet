import { Tooltip } from "@chakra-ui/react";

export const TooltipCommon = ({
  children,
  ...props
}: {
  children: React.ReactElement;
  [restProp: string]: any;
}) => {
  return (
    <Tooltip
      label="Receive Token"
      hasArrow
      bg="gray.600"
      color="whiteAlpha.700"
      {...props}
    >
      {children}
    </Tooltip>
  );
};
