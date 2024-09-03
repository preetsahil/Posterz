import { createSlice } from "@reduxjs/toolkit";

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState: {
    toastData: {},
  },
  reducers: {
    showToast: (state, action) => {
      state.toastData = action.payload;
    },
  },
});

export default appConfigSlice.reducer;
export const { showToast } = appConfigSlice.actions;