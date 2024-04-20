import { configureStore, combineReducers } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import appConfigReducer from "./slices/appConfigSlice";

export default configureStore({
  reducer: {
    categoryReducer,
    productReducer,
    appConfigReducer,
  },
});

