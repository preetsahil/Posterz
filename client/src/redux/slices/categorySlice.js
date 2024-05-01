import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
import { showToast } from "./appConfigSlice";

export const fetchCategories = createAsyncThunk("/categories", async () => {
  try {
    const response = await axiosClient.get("/api/categories");
    return response.data.categories;
  } catch (error) {
    return Promise.reject(error);
  }
});
export const deleteCategory = createAsyncThunk(
  "/deleteCategory",
  async (id, { dispatch }) => {
    try {
      const response = await axiosClient.delete(`/admin/category/${id}`);
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Success: Category deleted successfully",
        })
      );
      return response.data.id;
    } catch (error) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: `Failure: ${e.message}!`,
        })
      );
      return Promise.reject(error);
    }
  }
);

const categorySlice = createSlice({
  name: "categorySlice",
  initialState: {
    categories: [],
    originalCategories: [],
  },
  reducers: {
    sortOnTitleIncreasing: (state) => {
      state.categories = state.categories.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    },
    sortOnTitleDecreasing: (state) => {
      state.categories = state.categories.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    },
    sortOnKeyDecreasing: (state) => {
      state.categories = state.categories.sort((a, b) =>
        b.key.localeCompare(a.key)
      );
    },
    sortOnKeyIncreasing: (state) => {
      state.categories = state.categories.sort((a, b) =>
        a.key.localeCompare(b.key)
      );
    },
    sortOnIdIncreasing: (state) => {
      state.categories = state.categories.sort((a, b) =>
        a._id.localeCompare(b._id)
      );
    },
    sortOnIdDecreasing: (state) => {
      state.categories = state.categories.sort((a, b) =>
        b._id.localeCompare(a._id)
      );
    },
    search: (state, action) => {
      const search_params = action.payload[0];
      const searchQuery = action.payload[1].toLowerCase();

      state.categories = state.originalCategories.filter((data) =>
        search_params.some((param) =>
          data[param].toString().toLowerCase().includes(searchQuery)
        )
      );
    },
    removeProductFromCategory: (state, action) => {
      const [productId, categoryId] = action.payload;
      console.log(productId, categoryId);
      state.categories = state.categories.map((category) => {
        if (category._id === categoryId) {
          category.products = category.products.filter(
            (product) => product._id !== productId
          );
        }
        return category;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.originalCategories = action.payload;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(
        (category) => category._id !== action.payload
      );
    });
  },
});

export default categorySlice.reducer;
export const {
  sortOnTitleIncreasing,
  sortOnTitleDecreasing,
  sortOnKeyDecreasing,
  sortOnKeyIncreasing,
  sortOnIdDecreasing,
  sortOnIdIncreasing,
  search,
  removeProductFromCategory,
} = categorySlice.actions;
