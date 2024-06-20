import React from "react";
import { GOOGLE_ACCESS_TOKEN, getItem } from "../utils/localStorageManager";
import { Navigate, Outlet } from "react-router-dom";

function RequireAcess() {
  const token = getItem(GOOGLE_ACCESS_TOKEN);
  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default RequireAcess;
