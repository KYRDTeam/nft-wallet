import { COINGECKO_API } from "src/config/constants/constants";

export async function fetchRateForBaseCurrency() {
  try {
    const endpoint = `${COINGECKO_API}/simple/price?ids=ethereum,bitcoin,matic-network,binancecoin,fantom,crypto-com-chain,avalanche-2&vs_currencies=eth,btc,usd,bnb`;
    const response = await fetch(endpoint);
    const resultCoinGecko = await response.json();
    return resultCoinGecko;
  } catch (e) {
    throw e;
  }
}
