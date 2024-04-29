import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const fetchProducts = createAsyncThunk("/products", async () => {
  try {
    const response = await axiosClient.get("/api/products");
    return response.data.products;
  } catch (error) {
    return Promise.reject(error);
  }
});

const productSlice = createSlice({
  name: "productSlice",
  initialState: {
    products: [],
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
  },
});

export default productSlice.reducer;
