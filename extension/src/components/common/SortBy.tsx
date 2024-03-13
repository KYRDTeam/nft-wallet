import { Flex, Text } from "@chakra-ui/react";
import { SortIcon } from "./icons";

export const SortBy = ({
  label,
  sortType,
  ...props
}: {
  label: string;
  sortType: "asc" | "desc" | null;
  [restProp: string]: any;
}) => {
  return (
    <Flex cursor="pointer" {...props}>
      <Text color="whiteAlpha.600" fontSize="md">
        {label}
      </Text>
      <SortIcon boxSize="6" sort={sortType || "default"} />
    </Flex>
  );
};
