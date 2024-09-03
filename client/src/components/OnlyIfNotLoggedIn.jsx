import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  getItem,
  OAUTH_ADMIN_TOKEN,
  KEY_ADMIN_TOKEN,
} from "../utils/localStorageManager";
function OnlyIfNotLoggedIn() {
  const adminOAuthToken = getItem(OAUTH_ADMIN_TOKEN);
  const adminToken = getItem(KEY_ADMIN_TOKEN);

  if (adminOAuthToken || adminToken) {
    return <Navigate to="/admin" />;
  } else {
    return <Outlet />;
  }
}

export default OnlyIfNotLoggedIn;
