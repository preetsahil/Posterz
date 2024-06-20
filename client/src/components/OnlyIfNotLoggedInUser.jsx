import React from "react";
import { GOOGLE_ACCESS_TOKEN, getItem } from "../utils/localStorageManager";
import { Navigate, Outlet } from "react-router-dom";
function OnlyIfNotLoggedInUser() {
  const user = getItem(GOOGLE_ACCESS_TOKEN);
  return user ? <Navigate to="/" /> : <Outlet />;
}

export default OnlyIfNotLoggedInUser;
