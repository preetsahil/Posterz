import React, { useState } from "react";
import "./AdminDashBoard.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Detail from "../../components/admindashboard/detail/Detail";

function AdminDashBoard() {
  const location = useLocation();

  return (
    <div className="AdminDashBoard">
      <Sidebar />
      {location.pathname === "/admin" ? <Detail /> : <Outlet />}
    </div>
  );
}

export default AdminDashBoard;
