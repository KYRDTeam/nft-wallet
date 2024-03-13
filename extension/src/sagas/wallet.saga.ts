import { globalSelector } from "src/store/global";
import {
  Token,
  QuoteList,
  ChainId,
  ChainWorthType,
} from "../config/types/index";
import { tokensSelector } from "src/store/tokens";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { setNetWorth, walletsSelector, walletsSlice } from "src/store/wallets";
import { fetchNetWorth } from "src/utils/krystalService";
import { get } from "lodash";

function* fetchNetWorthSaga(
  action: PayloadAction<{ address: string; isForceSync: boolean }>
) {
  const { address, isForceSync } = action.payload;

  if (isForceSync) {
    yield fetchForceNetWorthSaga(address);
    return;
  }

  yield fetchCacheNetWorthSaga(address);
}

function* fetchCacheNetWorthSaga(address: string) {
  yield put(walletsSlice.actions.setCacheFetchingTotalBalanceState(true));

  try {
    // @ts-ignore
    const data = yield call(fetchNetWorth, address, false);
    if (data) {
      yield put(setNetWorth(data));
    }
  } catch (e) {
    throw e;
  }

  yield put(walletsSlice.actions.setCacheFetchingTotalBalanceState(false));
}

function* fetchForceNetWorthSaga(address: string) {
  yield put(walletsSlice.actions.setForceFetchingTotalBalanceState(true));

  try {
    // @ts-ignore
    const data = yield call(fetchNetWorth, address, true);
    if (data) {
      yield put(setNetWorth(data));
    }
  } catch (e) {
    throw e;
  }

  yield put(walletsSlice.actions.setForceFetchingTotalBalanceState(false));

  yield put(walletsSlice.actions.setCacheFetchingTotalBalanceState(false));
}

function* syncWorthSaga(action: PayloadAction<{ chainId: ChainId }>) {
  const { tokens, hiddenList } = yield select(tokensSelector);
  const { chainId: globalChainId } = yield select(globalSelector);
  const { chainWorth } = yield select(walletsSelector);
  const { chainId } = action.payload;

  if (globalChainId !== chainId) return;

  const availableToken = tokens[chainId].filter(
    (token: Token) => !hiddenList.includes(token.address)
  );

  // chain value
  const currentChainWorth: ChainWorthType = chainWorth.find(
    (chainWorth: ChainWorthType) => chainWorth.chainID === globalChainId
  );

  // net value
  const quotesValue: QuoteList<number> = availableToken.reduce(
    (quote: QuoteList<number>, token: Token) => {
      quote.avax += Number(get(token, "quotes.avax.value", 0));
      quote.bnb += Number(get(token, "quotes.bnb.value", 0));
      quote.btc += Number(get(token, "quotes.btc.value", 0));
      quote.eth += Number(get(token, "quotes.eth.value", 0));
      quote.matic += Number(get(token, "quotes.matic.value", 0));
      quote.usd += Number(get(token, "quotes.usd.value", 0));

      return quote;
    },
    {
      avax: 0,
      bnb: 0,
      btc: 0,
      eth: 0,
      matic: 0,
      usd: 0,
    }
  );

  ["avax", "bnb", "btc", "eth", "matic", "usd"].forEach((quote: string) => {
    const chainWorthValue = get(currentChainWorth, `quotes.${quote}.value`, 0);
    // @ts-ignore
    if (chainWorthValue > quotesValue[quote]) {
      // @ts-ignore
      quotesValue[quote] = chainWorthValue - quotesValue[quote];
    } else {
      // @ts-ignore
      quotesValue[quote] = 0;
    }
  });

  yield put(
    walletsSlice.actions.setHiddenWorth({ chainId, quote: quotesValue })
  );
}

export function* walletSaga() {
  yield takeLatest(walletsSlice.actions.fetchNetWorth, fetchNetWorthSaga);
  yield takeLatest(walletsSlice.actions.syncHiddenWorth, syncWorthSaga);
}
