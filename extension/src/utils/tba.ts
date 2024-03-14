import { ChainId } from "src/config/types";
import { getWeb3 } from "./web3";

export const createTBA = async (chainId: ChainId) => {
  const web3 = getWeb3(chainId);
  return "";
};
