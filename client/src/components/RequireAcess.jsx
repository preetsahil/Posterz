import React from "react";
import { KEY_ACCESS_TOKEN, getItem } from "../utils/localStorageManager";
import { Navigate, Outlet } from "react-router-dom";

function RequireAcess() {
  const token = getItem(KEY_ACCESS_TOKEN);
  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default RequireAcess;
