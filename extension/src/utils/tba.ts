import { ChainId, TxParams } from "src/config/types";
import { formatTxParams, getWeb3 } from "./web3";
import TBAV3ABI from "src/config/abi/TBAV3Implementation.json";
import { AbiItem } from "web3-utils";


export const createTBA = async (chainId: ChainId) => {
  const web3 = getWeb3(chainId);
  return "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
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
      tba,
    );

    const txData = tbaContract.methods.execute(to, value, data, operation).encodeABI();
    
    let result: TxParams = {
      chainId: params.chainId,
      data: txData,
      from: params.from,
      to: tba,
      value: params.value,
      type: params.type,
    }
    return await formatTxParams(chainId, result);
  } catch (error) {
    console.log(error);
  }
};
