import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const fetchCategories = createAsyncThunk("/categories", async () => {
  try {
    const response = await axiosClient.get("/api/categories");
    console.log("ljhvg")
    return response.data.categories;
  } catch (error) {
    return Promise.reject(error);
  }
});

const categorySlice = createSlice({
  name: "categorySlice",
  initialState: {
    categories: [],
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
  },
});

export default categorySlice.reducer;
