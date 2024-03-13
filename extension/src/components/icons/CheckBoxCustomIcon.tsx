import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";

const CheckBoxCustomIcon = ({
  isActive = true,
  color,
  ...props
}: {
  color?: string;
  isActive?: boolean;
}) => (
  <Flex
    borderRadius="full"
    width="5"
    height="5"
    borderWidth="thin"
    borderColor={isActive ? (color ? color : "primary.200") : "whiteAlpha.400"}
    justifyContent="center"
    alignItems="center"
    {...props}
  >
    <CheckIcon
      boxSize="2.5"
      color={isActive ? (color ? color : "primary.200") : "whiteAlpha.400"}
    />
  </Flex>
);

export const CloseCustomIcon = ({
  isActive = true,
  color,
  ...props
}: {
  color?: string;
  isActive?: boolean;
}) => (
  <Flex
    borderRadius="full"
    width="5"
    height="5"
    borderWidth="thin"
    borderColor={isActive ? (color ? color : "red.400") : "whiteAlpha.400"}
    justifyContent="center"
    alignItems="center"
    {...props}
  >
    <CloseIcon
      boxSize="2.5"
      color={isActive ? (color ? color : "red.400") : "whiteAlpha.400"}
    />
  </Flex>
);

export default CheckBoxCustomIcon;
