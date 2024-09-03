import { Navigate, Outlet } from "react-router-dom";
import {
  getItem,
  OAUTH_ADMIN_TOKEN,
  KEY_ADMIN_TOKEN,
} from "../utils/localStorageManager";
import React from "react";

function RequireAdmin() {
  const adminOAuthToken = getItem(OAUTH_ADMIN_TOKEN);
  const adminToken = getItem(KEY_ADMIN_TOKEN);

  if (adminOAuthToken || adminToken) {
    return <Outlet />;
  } else {
    return <Navigate to="/adminlogin" />;
  }
}

export default RequireAdmin;
