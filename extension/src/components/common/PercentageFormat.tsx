import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/react";
import { isNaN, isNumber } from "lodash";
import { formatCurrency } from "src/utils/formatBalance";
import { priceColor } from "src/utils/helper";

export const PercentageFormat = ({
  percentage,
  ...props
}: {
  percentage: number;
  [restProp: string]: any;
}) => {
  if (!isNumber(percentage) || isNaN(percentage)) return null;
  return (
    <Text color={priceColor(percentage)} {...props}>
      {percentage < 0 && (
        <TriangleDownIcon
          boxSize="3"
          mt="-2px"
          color={priceColor(percentage)}
        />
      )}
      {percentage > 0 && (
        <TriangleUpIcon boxSize="3" mt="-2px" color={priceColor(percentage)} />
      )}
      {formatCurrency(Math.abs(percentage), 2)}%
    </Text>
  );
};
