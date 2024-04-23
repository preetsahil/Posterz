import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
import { showToast } from "./appConfigSlice";
import store from "../store";

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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(
        (category) => category._id !== action.payload
      );
    });
  },
});

export default categorySlice.reducer;
