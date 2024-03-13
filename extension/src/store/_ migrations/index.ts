import { ChainId } from "src/config/types";
import { RootState } from "src/store";

export const migrations: any = {
  7: (state: RootState) => {
    return {
      ...state,
      wallets: {
        ...state.wallets,
        totalNetWorth: undefined,
        chainWorth: [],
        hiddenWorth: {
          [ChainId.ARBITRUM]: {},
          [ChainId.BSC]: {},
          [ChainId.AVALANCHE]: {},
          [ChainId.BSC_TESTNET]: {},
          [ChainId.MAINNET]: {},
          [ChainId.POLYGON]: {},
          [ChainId.CRONOS]: {},
          [ChainId.FANTOM]: {},
          [ChainId.ROPSTEN]: {},
        },
        isForceFetchingTotalBalance: false,
        isCacheFetchingTotalBalance: false,
      },
      tokens: {
        ...state.tokens,
        tokens: {
          [ChainId.ARBITRUM]: [],
          [ChainId.BSC]: [],
          [ChainId.AVALANCHE]: [],
          [ChainId.BSC_TESTNET]: [],
          [ChainId.MAINNET]: [],
          [ChainId.POLYGON]: [],
          [ChainId.CRONOS]: [],
          [ChainId.FANTOM]: [],
          [ChainId.ROPSTEN]: [],
        },
      },
    };
  },
};

export const CURRENT_REDUX_PERSIST_VERSION = 7;
