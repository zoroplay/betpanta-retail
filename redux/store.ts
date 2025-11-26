import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import compressTransform from "redux-persist-transform-compress";

import {
  notification,
  user,
  modal,
  betting,
  bottomSheet,
  fixtures,
  live_games,
  cashdesk,
  withdrawal,
  app,
} from "./features/slice";
import { apiSlice } from "./services/constants/api.service";

const persistConfig = {
  key: "sbanp-root:v1:9.2",
  storage,
  transforms: [
    compressTransform(),
    // encryptTransform({
    //   secretKey: "SecreteKey",
    //   onError: (error: any) => {
    //     console.error("Encryption error:", error);
    //   },
    // }),
  ],
  stateReconciler: hardSet,
  whitelist: [
    "app",
    "user",
    "modal",
    "notification",
    "betting",
    "bottomSheet",
    "fixtures",
    "live_games",
    "cashdesk",
    "withdrawal",
  ],
  blacklist: ["app.tournament_details"],
};

const rootReducer = combineReducers({
  app,
  user,
  modal,
  notification,
  betting,
  bottomSheet,
  fixtures,
  live_games,
  cashdesk,
  withdrawal,
  [apiSlice.reducerPath]: apiSlice.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
