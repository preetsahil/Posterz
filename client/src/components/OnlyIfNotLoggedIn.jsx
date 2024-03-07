import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getItem, KEY_ADMIN_TOKEN } from "../utils/localStorageManager";
function OnlyIfNotLoggedIn() {
  const adminUser = getItem(KEY_ADMIN_TOKEN);
  return adminUser ? <Navigate to="/admin" /> : <Outlet />;
}

export default OnlyIfNotLoggedIn;
