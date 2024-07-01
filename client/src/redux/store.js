import { configureStore, combineReducers } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import appConfigReducer from "./slices/appConfigSlice";
import cartReducer from "./slices/cartSlice";
import storage from "redux-persist/lib/storage";
import profileReducer from "./slices/profileSlice";
import orderReducer from "./slices/orderSlice"
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

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "productReducer",
    "categoryReducer",
    "appConfigReducer",
    "orderReducer",
  ],
};

const rootReducer = combineReducers({
  categoryReducer,
  productReducer,
  appConfigReducer,
  cartReducer,
  profileReducer,
  orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
