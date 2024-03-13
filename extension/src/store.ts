import { combineReducers, configureStore } from "@reduxjs/toolkit";
import globalReducer from "./store/global";
import walletsReducer from "./store/wallets";
import earnReducer from "./store/earn";
import tokensReducer from "./store/tokens";
import keysReducer from "./store/keys";
import hashReducer from "./store/hash";
import trustedAppsReducer from "./store/trustedApps";
import contactReducer from "./store/contact";
import { persistReducer, createMigrate } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas";

import {
  migrations,
  CURRENT_REDUX_PERSIST_VERSION,
} from "./store/_ migrations";

let sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  version: CURRENT_REDUX_PERSIST_VERSION,
  storage,
  blacklist: ["keys"],
  migrate: createMigrate(migrations, { debug: true }),
};

const keysPersistConfig = {
  key: "keys",
  version: CURRENT_REDUX_PERSIST_VERSION,
  storage,
  blacklist: ["password", "vault", "keyringController", "accounts"],
  migrate: createMigrate(migrations, { debug: true }),
};

const reducers = combineReducers({
  global: globalReducer,
  wallets: walletsReducer,
  keys: persistReducer(keysPersistConfig, keysReducer),
  tokens: tokensReducer,
  earn: earnReducer,
  hash: hashReducer,
  trustedApps: trustedAppsReducer,
  contacts: contactReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [sagaMiddleware],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

sagaMiddleware.run(rootSaga);

export default store;
