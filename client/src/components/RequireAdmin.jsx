import { Navigate, Outlet } from "react-router-dom";
import {
  getItem,
  GOOGLE_ACCESS_TOKEN,
  KEY_ACCESS_TOKEN,
} from "../utils/localStorageManager";
import React from "react";
import { useSelector } from "react-redux";

function RequireAdmin() {
  const adminOAuthToken = getItem(GOOGLE_ACCESS_TOKEN);
  const adminToken = getItem(KEY_ACCESS_TOKEN);
  const profile = useSelector((state) => state.profileReducer.profile);
  const adminprofile = useSelector(
    (state) => state.profileReducer.adminProfile
  );

  const isAdmin = profile.isAdmin || adminprofile.isAdmin;

  if ((adminOAuthToken || adminToken) && isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to="/adminlogin" />;
  }
}

export default RequireAdmin;
