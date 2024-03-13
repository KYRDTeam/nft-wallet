import { useInterval } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBaseCurrencyRate } from "src/store/global";
import { fetchRateForBaseCurrency } from "src/utils/coingeckoService";

export default function useFetchCurrencyRate() {
  const dispatch = useDispatch();

  const fetch = useCallback(async () => {
    const rate = await fetchRateForBaseCurrency();

    if (rate) {
      dispatch(
        setBaseCurrencyRate({
          usd: 1,
          eth: +rate.ethereum.usd,
          btc: +rate.bitcoin.usd,
          bnb: +rate.binancecoin.usd,
          matic: +rate["matic-network"].usd,
          avax: +rate["avalanche-2"].usd,
          cro: +rate["crypto-com-chain"].usd,
          ftm: +rate.fantom.usd,
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useInterval(fetch, 20000);
}
