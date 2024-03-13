import { globalSelector } from "src/store/global";
import { tokensSelector } from "src/store/tokens";
import { useAppSelector } from "./useStore";

export const useChainTokenSelector = () => {
  const { tokens, customTokens, ...restReducer } =
    useAppSelector(tokensSelector);
  const { chainId } = useAppSelector(globalSelector);

  return {
    tokens: tokens[chainId],
    customTokens: customTokens[chainId],
    ...restReducer,
  };
};
