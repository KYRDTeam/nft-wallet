import { ChainId } from "src/config/types";
import { getWeb3, formatTxParams } from "./web3";
import TBAHelperABI from "src/config/abi/TBAHelper.json";
import { AbiItem } from "web3-utils";

export const createTBA = async (chainId: ChainId, EOAWallet: any) => {
  try {
    const web3 = getWeb3(chainId);
    const tbaHelperContract = new web3.eth.Contract(
      TBAHelperABI as unknown as AbiItem,
      process.env.TBA_HELPER_ADDRESS,
    );
    const txData = await tbaHelperContract.methods.createAccount().encodeABI();
    const txParam = formatTxParams(chainId, {
      data: txData,
      from: EOAWallet,
    });
    return txParam
  } catch (error) {
    return Promise.reject(error);
  }
};

export const modifyDataForTBA = (
  data: string | undefined,
  tba: string | undefined
) => {
  return data;
};
