import { ChainId, TxParams } from "src/config/types";
import { getWeb3, formatTxParams } from "./web3";
import TBAHelperABI from "src/config/abi/helpertba.json";
import { AbiItem } from "web3-utils";
import { TBA_HELPER_CONTRACT } from "src/config/constants/contracts";
import TBAV3ABI from "src/config/abi/tbav3impl.json";

export const createTBA = (chainId: ChainId, EOAWallet: any) => {
  try {
    const web3 = getWeb3(chainId);
    const tbaHelperContract = new web3.eth.Contract(
      TBAHelperABI as unknown as AbiItem,
      TBA_HELPER_CONTRACT
    );
    const txData = tbaHelperContract.methods.createAccount().encodeABI();

    return txData;
  } catch (error) {
    throw error;
  }
};

export const modifyDataForTBA = async (
  chainId: ChainId,
  params: TxParams,
  tba: string | undefined
) => {
  try {
    const web3 = getWeb3(chainId);
    const { to, value, data } = params;
    // CALL_OPERATIONS = {
    //   CALL: 0,
    //   DELEGATECALL: 1,
    //   CREATE: 2,
    //   CREATE2: 3,
    // }
    const operation = 0;

    const tbaContract = new web3.eth.Contract(
      TBAV3ABI as unknown as AbiItem,
      tba
    );

    const txData = tbaContract.methods
      .execute(to, value, data, operation)
      .encodeABI();

    let result: TxParams = {
      chainId: params.chainId,
      data: txData,
      from: params.from,
      to: tba,
      value: params.value,
      type: params.type,
    };
    return await formatTxParams(chainId, result);
  } catch (error) {
    console.log(error);
  }
};
