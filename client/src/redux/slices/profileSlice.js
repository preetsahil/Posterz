import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profileSlice",
  initialState: {
    profile: {},
    adminProfile: {},
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    deleteProfile: (state) => {
      state.profile = {};
    },
    setAdminProfile: (state, action) => {
      state.adminProfile = action.payload;
    },
    deleteAdminProfile: (state) => {
      state.adminProfile = {};
    },
  },
});

export default profileSlice.reducer;
export const {
  setProfile,
  deleteProfile,
  deleteAdminProfile,
  setAdminProfile,
} = profileSlice.actions;
