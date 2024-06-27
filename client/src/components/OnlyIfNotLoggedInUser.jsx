import React from "react";
import { OAUTH_ACCESS_TOKEN, getItem } from "../utils/localStorageManager";
import { Navigate, Outlet } from "react-router-dom";
function OnlyIfNotLoggedInUser() {
  const user = getItem(OAUTH_ACCESS_TOKEN);
  return user ? <Navigate to="/" /> : <Outlet />;
}

export default OnlyIfNotLoggedInUser;
