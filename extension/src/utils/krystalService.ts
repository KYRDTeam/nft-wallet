import { get, pick } from "lodash";
import { krystalApiEndPoint, KRYSTAL_API } from "../config/constants/constants";
import {
  ChainId,
  GasPrices,
  RateType,
  SwapParams,
  Token,
  Balance,
  SwapAndDepositParams,
  ExploreData,
  WithdrawParams,
  ClaimParams,
  TokenDetail,
  SupportedCurrencyType,
  QuoteList,
  Quote,
} from "../config/types";
import { getBalanceNumber } from "./formatBalance";
import { toBigAmount } from "./helper";
import { subDays } from "date-fns";
import { PLATFORM_WALLET } from "src/config/constants/contracts";

export async function fetchRates(
  chainId: ChainId,
  src?: Token,
  srcAmount?: string,
  dest?: Token,
  userAddress?: string
) {
  try {
    if (src && srcAmount && dest) {
      const params: any = {
        src: src.address,
        srcAmount: toBigAmount(srcAmount, src.decimals),
        dest: dest.address,
        platformWallet: PLATFORM_WALLET[chainId],
      };
      if (userAddress) {
        params.userAddress = userAddress;
      }
      const response = await fetch(
        `${KRYSTAL_API[chainId]}/v2/swap/allRates?${new URLSearchParams(
          params
        ).toString()}`
      );
      const data = await response.json();
      if (data && data.rates) {
        const mapData: RateType[] = data.rates.map((r: RateType) => ({
          ...r,
          humanizeRate: getBalanceNumber(r.rate),
          estimatedGas: `${r.estimatedGas}`,
        }));
        return mapData;
      } else {
        throw new Error(data.error);
      }
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function fetchRefPrice(
  chainId: ChainId,
  srcTokenAddr?: string,
  destTokenAddr?: string
): Promise<{ refPrice: string; sources: string[] } | undefined> {
  try {
    if (srcTokenAddr && destTokenAddr) {
      const response = await fetch(
        `${KRYSTAL_API[chainId]}/v1/market/refPrice?src=${srcTokenAddr}&dest=${destTokenAddr}`
      );
      const result = await response.json();
      if (result.refPrice) {
        return result;
      } else {
        throw new Error(result.error);
      }
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function fetchTokenList(
  chainId: ChainId
): Promise<Token[] | undefined> {
  try {
    const response = await fetch(`${KRYSTAL_API[chainId]}/v1/token/tokenList`);
    const result = await response.json();
    if (result.tokens) {
      return result.tokens;
    } else {
      return Promise.reject(result.error);
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function fetchTokenBalances(
  chainId: ChainId,
  address?: string
): Promise<Balance[] | undefined> {
  try {
    if (address) {
      const response = await fetch(
        `${krystalApiEndPoint}/all/v1/balance/token?addresses=ethereum:${address}&quoteSymbols=usd,btc&sparkline=true&chainIds=${chainId}`
      );
      const result = await response.json();
      if (result?.data?.[0]?.balances) {
        return result.data[0].balances;
      } else {
        return Promise.reject(result.error);
      }
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function fetchTokenOverview(
  chainId: ChainId,
  tokenAddresses?: string[]
): Promise<Token[] | undefined> {
  try {
    let targetUrl = `${KRYSTAL_API[chainId]}/v1/market/overview?quoteCurrencies=btc,usd,matic,bnb,eth,cro,ftm,avax`;
    if (tokenAddresses && tokenAddresses.length) {
      targetUrl = `${
        KRYSTAL_API[chainId]
      }/v1/market/overview?quoteCurrencies=btc,usd,matic,bnb,eth,cro,ftm,avax&tokenAddresses=${tokenAddresses.join(
        ","
      )}`;
    }

    const response = await fetch(targetUrl);
    const result = await response.json();
    if (result.data && result.data.length >= 0) {
      return result.data;
    } else {
      return Promise.reject(result.error);
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function fetchGasPrices(
  chainId: ChainId
): Promise<GasPrices | undefined> {
  try {
    const response = await fetch(`${KRYSTAL_API[chainId]}/v2/gasPrice`);
    const result = await response.json();
    const gasPrices = result.gasPrice;
    const priorityFees = result.priorityFee;
    if (gasPrices) {
      const filterGasPrices = pick(gasPrices, ["standard", "low", "fast"]);
      const filterPriorityFees = pick(priorityFees, [
        "standard",
        "low",
        "fast",
      ]);

      return {
        ...result,
        gasPrice: { ...filterGasPrices, superFast: gasPrices.fast * 2 },
        priorityFee: priorityFees
          ? {
              ...filterPriorityFees,
              superFast: priorityFees.fast * 2,
            }
          : undefined,
      };
    } else {
      return Promise.reject(result.error);
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function fetchTokenDetail(
  chainId: ChainId,
  address?: string
): Promise<TokenDetail | undefined> {
  try {
    if (address) {
      const response = await fetch(
        `${KRYSTAL_API[chainId]}/v1/token/tokenDetails?address=${address}`
      );
      const result = await response.json();
      if (result.result) {
        return result.result;
      } else {
        throw new Error(result.error);
      }
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function fetchTokenPriceSeries(
  chainId: ChainId,
  address: string,
  chartDays: number,
  currency: SupportedCurrencyType
) {
  try {
    const from = Math.round(subDays(new Date(), chartDays).getTime() / 1000);

    const response = await fetch(
      `${KRYSTAL_API[chainId]}/v1/market/priceSeries?token=${address}&from=${from}&quoteCurrency=${currency}`
    );

    const result = await response.json();
    return result.prices.map((priceItem: any) => ({
      date: priceItem[0],
      price: priceItem[1],
    }));
  } catch (e) {
    throw e;
  }
}

export async function buildSwapTx(
  chainId: ChainId,
  params: SwapParams
): Promise<any> {
  const { userAddress, dest, src, srcAmount, minDestAmount } = params;
  const hint = params.hint ? params.hint : "0x";
  try {
    if (userAddress && dest && src && srcAmount && minDestAmount) {
      const endpoint = `${KRYSTAL_API[chainId]}/v2/swap/buildTx?userAddress=${params.userAddress}&dest=${params.dest}&src=${params.src}&platformWallet=${PLATFORM_WALLET[chainId]}&srcAmount=${params.srcAmount}&minDestAmount=${params.minDestAmount}&gasPrice=0&hint=${hint}&nonce=1`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result && result.txObject) {
        return result.txObject.data;
      } else {
        throw new Error(result.error);
      }
    }
    throw new Error("Missing parameters.");
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function buildSwapAndDepositTx(
  chainId: ChainId,
  params: SwapAndDepositParams
): Promise<{ data: string; gasLimit: string }> {
  const { userAddress, dest, src, srcAmount, minDestAmount, lendingPlatform } =
    params;
  const hint = params.hint ? params.hint : "";
  try {
    if (
      userAddress &&
      dest &&
      src &&
      srcAmount &&
      minDestAmount &&
      lendingPlatform
    ) {
      const endpoint = `${KRYSTAL_API[chainId]}/v2/swap/buildSwapAndDepositTx?lendingPlatform=${lendingPlatform}&userAddress=${params.userAddress}&dest=${params.dest}&src=${params.src}&platformWallet=${PLATFORM_WALLET[chainId]}&srcAmount=${params.srcAmount}&minDestAmount=${params.minDestAmount}&gasPrice=0&hint=${hint}&nonce=1`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result && result.txObject) {
        return {
          data: result.txObject.data,
          gasLimit: `${+result.txObject.gasLimit}`,
        };
      } else {
        throw new Error(result.error);
      }
    }
    throw new Error("Missing parameters.");
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function buildWithdrawTx(
  chainId: ChainId,
  params: WithdrawParams
): Promise<{ data: string; gasLimit: string; to: string }> {
  const { userAddress, amount, lendingPlatform, token } = params;
  try {
    if (userAddress && amount && lendingPlatform) {
      const endpoint = `${KRYSTAL_API[chainId]}/v1/lending/buildWithdrawTx?lendingPlatform=${lendingPlatform}&userAddress=${userAddress}&amount=${amount}&token=${token}&nonce=1&gasPrice=106000000000`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result && result.txObject) {
        return {
          data: result.txObject.data,
          gasLimit: `${+result.txObject.gasLimit}`,
          to: result.txObject.to,
        };
      } else {
        throw new Error(result.error);
      }
    }
    throw new Error("Missing parameters.");
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function buildClaimTx(
  chainId: ChainId,
  params: ClaimParams
): Promise<{ data: string; gasLimit: string; to: string }> {
  const { userAddress, lendingPlatform } = params;
  try {
    if (userAddress && lendingPlatform) {
      const endpoint = `${KRYSTAL_API[chainId]}/v1/lending/buildClaimTx?lendingPlatform=${lendingPlatform}&address=${userAddress}&nonce=1&gasPrice=5000000000`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result && result.txObject) {
        return {
          data: result.txObject.data,
          gasLimit: `${+result.txObject.gasLimit}`,
          to: result.txObject.to,
        };
      } else {
        throw new Error(result.error);
      }
    }
    throw new Error("Missing parameters.");
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function login(
  url: string,
  address: string,
  timestamp: number,
  signature: string
): Promise<string> {
  try {
    const response = await fetch(`${url}/v1/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, timestamp, signature }),
    });
    const data = await response.json();

    return data.token;
  } catch (e) {
    return "";
  }
}

export async function fetchExploreData(url: string): Promise<ExploreData[]> {
  try {
    const response = await fetch(`${url}/v1/mkt/assets`);
    const data = await response.json();

    return data.assets.map((item: any) => {
      return {
        id: item.id,
        url: item.url,
        imageUrl: item.imageUrl,
        type: item.type,
      };
    });
  } catch (e) {
    return [];
  }
}

export async function rate(
  txHash: string,
  star: number,
  category: string,
  detail: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${krystalApiEndPoint}/all/v1/tracking/ratings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          star: star,
          detail: detail,
          txHash: txHash,
        }),
      }
    );
    if (response.ok) return true;
    return false;
  } catch (error) {
    return false;
  }
}

export async function fetchNetWorth(
  wallet: string,
  isForceSync: boolean
): Promise<
  | {
      totalNetWorth: QuoteList<Quote>;
      chainWorth: {
        [chainId in ChainId]: QuoteList<Quote>;
      };
    }
  | undefined
> {
  try {
    const response = await fetch(
      `${krystalApiEndPoint}/all/v1/balance/totalBalances?address=${wallet}&forceSync=${isForceSync}`
    );

    const data = await response.json();
    if (data.data)
      return {
        totalNetWorth: get(data, "data.summary"),
        chainWorth: get(data, "data.balances"),
      };
    return undefined;
  } catch (e) {
    return undefined;
  }
}
