import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Interface } from "@ethersproject/abi";
import multiCallAbi from "../config/abi/multicall.json";
import { provider as ProviderType } from "web3-core";
import { ChainId } from "../config/types";
import { multiCall } from "../config/constants/contracts";
import { NODE } from "../config/constants/chain";

export const getContract = (chainId: ChainId, provider?: ProviderType) => {
  const address = multiCall[chainId];
  const defaultProvider = new Web3.providers.HttpProvider(
    NODE[chainId].rpcUrls
  );
  provider = provider ? provider : defaultProvider;
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(
    multiCallAbi as unknown as AbiItem,
    address
  );
  return contract;
};

interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

const multicall = async (chainId: ChainId, abi: any[], calls: Call[]) => {
  const itf = new Interface(abi);

  const calldata = calls.map((call) => [
    call.address.toLowerCase(),
    itf.encodeFunctionData(call.name, call.params),
  ]);
  try {
    const { returnData } = await getContract(chainId)
      .methods.aggregate(calldata)
      .call();
    const res = returnData.map((call: any, i: number) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );

    return res;
  } catch (error) {
    const nullData = calls.map(() => null);
    console.log(calls, error);
    return nullData;
  }
};

export default multicall;
