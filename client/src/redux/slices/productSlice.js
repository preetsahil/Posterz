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
    productsWithZeroCategory: [],
  },
  reducers: {
    updateProductsWithCategoryZero: (state,action) => {
      const product=action.payload;
      //push this inside state.productsWithZeroCategory
      state.productsWithZeroCategory.push(product);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      state.productsWithZeroCategory = action.payload.filter(
        (product) => product.categories === null
      );
    });
  },
});

export default productSlice.reducer;
export const { updateProductsWithCategoryZero } = productSlice.actions;
