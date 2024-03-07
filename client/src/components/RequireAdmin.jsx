import { Navigate, Outlet } from "react-router-dom";
import { getItem, KEY_ADMIN_TOKEN } from "../utils/localStorageManager";
import React from 'react'

function RequireAdmin() {
  const adminUser = getItem(KEY_ADMIN_TOKEN);
  return adminUser? <Outlet /> : <Navigate to="/adminlogin" />;
}

export default RequireAdmin;
