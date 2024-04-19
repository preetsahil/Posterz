import { configureStore, combineReducers } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import appConfigReducer from "./slices/appConfigSlice";
// import cartReducer from "./cartSlice";
// import storage from "redux-persist/lib/storage";
// import { persistReducer, persistStore } from "redux-persist";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const rootReducer = combineReducers({
//   categoryReducer,
//   cartReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   devTools: process.env.NODE_ENV !== "production",
// });
export default configureStore({
  reducer: {
    categoryReducer,
    productReducer,
    appConfigReducer,
  },
});

// export const persistor = persistStore(store);
