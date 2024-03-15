import { ChainId } from "src/config/types";
import { getWeb3 } from "./web3";

export const createTBA = async (chainId: ChainId) => {
  const web3 = getWeb3(chainId);
  return "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
};

export const modifyDataForTBA = (
  data: string | undefined,
  tba: string | undefined
) => {
  return data;
};
