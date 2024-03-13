import BigNumber from "bignumber.js";

export const getBalanceNumber = (
  balance: BigNumber | string | number,
  decimals = 18
) => {
  const displayBalance = new BigNumber(balance).dividedBy(
    new BigNumber(10).pow(decimals)
  );
  return displayBalance.toNumber();
};

export const getFullDisplayBalance = (
  balance: BigNumber | string | number,
  decimals = 18
) => {
  return new BigNumber(balance)
    .dividedBy(new BigNumber(10).pow(decimals))
    .toFixed();
};

export const ellipsis = (string: string, start = 6, end = 4) => {
  return `${string.substring(0, start)}...${string.substring(
    string.length - end
  )}`;
};

export const formatCurrency = (
  balance: number | string,
  maxDecimals: number = 4
) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: maxDecimals,
  }).format(+balance);
};

export const getBalanceDecimal = (
  balance: BigNumber | string | number,
  decimals = 0
) => {
  const displayBalance = new BigNumber(balance).multipliedBy(
    new BigNumber(10).pow(decimals)
  );
  return displayBalance.toString();
};
