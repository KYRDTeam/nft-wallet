import { Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { SupportedCurrencyType } from "src/config/types";
import { globalSelector } from "src/store/global";
import { valueWithCurrency } from "src/utils/helper";

export const PrivatePrice = ({
  value,
  currency,
  ...props
}: {
  value: string | number;
  currency?: SupportedCurrencyType;
  [restProp: string]: any;
}) => {
  const { isPrivateMode } = useSelector(globalSelector);
  if (isPrivateMode) {
    return (
      <Text letterSpacing={1.5} {...props}>
        •••••••••
      </Text>
    );
  }
  return <Text {...props}>{valueWithCurrency(value, currency)}</Text>;
};
