import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { showToast } from "./appConfigSlice";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";

export const fetchProducts = createAsyncThunk("/products", async () => {
  try {
    const response = await axiosClient.get("/api/products");
    return response.data.products;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const deleteProduct = createAsyncThunk(
  "/deleteProduct",
  async (id, { dispatch }) => {
    try {
      const response = await axiosClient.delete(`/admin/product/${id}`);
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Success: Product deleted successfully",
        })
      );
      return response.data.id;
    } catch (error) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: `Failure: ${error.message}!`,
        })
      );
      return Promise.reject(error);
    }
  }
);

const productSlice = createSlice({
  name: "productSlice",
  initialState: {
    products: [],
    productsWithZeroCategory: [],
    originalProducts: [],
  },
  reducers: {
    updateProductsWithCategoryZero: (state, action) => {
      const product = action.payload;
      //push this inside state.productsWithZeroCategory
      state.productsWithZeroCategory.push(product);
    },
    sortOnTitleIncreasing: (state) => {
      state.products = state.products.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    },
    sortOnTitleDecreasing: (state) => {
      state.products = state.products.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    },
    sortOnKeyDecreasing: (state) => {
      state.products = state.products.sort((a, b) =>
        b.key.localeCompare(a.key)
      );
    },
    sortOnKeyIncreasing: (state) => {
      state.products = state.products.sort((a, b) =>
        a.key.localeCompare(b.key)
      );
    },
    sortOnIdIncreasing: (state) => {
      state.products = state.products.sort((a, b) =>
        a._id.localeCompare(b._id)
      );
    },
    sortOnIdDecreasing: (state) => {
      state.products = state.products.sort((a, b) =>
        b._id.localeCompare(a._id)
      );
    },
    sortOnPriceIncreasing: (state) => {
      state.products = state.products.sort((a, b) => a.price - b.price);
    },
    sortOnPriceDecreasing: (state) => {
      state.products = state.products.sort((a, b) => b.price - a.price);
    },

    searchProducts: (state, action) => {
      const search_params = action.payload[0];
      const searchQuery = action.payload[1].toLowerCase();
      state.products = state.originalProducts.filter((data) =>
        search_params.some((param) =>
          data[param].toString().toLowerCase().includes(searchQuery)
        )
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      state.originalProducts = action.payload;
      state.productsWithZeroCategory = action.payload.filter(
        (product) => !product.categories
      );
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
      state.originalProducts = state.originalProducts.filter(
        (product) => product._id !== action.payload
      );
      state.productsWithZeroCategory = state.productsWithZeroCategory.filter(
        (product) => product._id !== action.payload
      );
    });
  },
});

export default productSlice.reducer;
export const {
  updateProductsWithCategoryZero,
  searchProducts,
  sortOnIdDecreasing,
  sortOnIdIncreasing,
  sortOnKeyDecreasing,
  sortOnKeyIncreasing,
  sortOnPriceDecreasing,
  sortOnPriceIncreasing,
  sortOnTitleDecreasing,
  sortOnTitleIncreasing,
} = productSlice.actions;
