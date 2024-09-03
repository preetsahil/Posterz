import React, { useEffect } from "react";
import "./AdminDashBoard.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Detail from "../../components/admindashboard/detail/Detail";
import { axiosClient } from "../../utils/axiosClient";
import { setOrders } from "../../redux/slices/orderSlice";
import { useDispatch } from "react-redux";

function AdminDashBoard() {
  const location = useLocation();
  const dispatch=useDispatch()
  useEffect(() => {
    const fetchorders = async () => {
      const res = await axiosClient.get("/admin/getOrders");
      dispatch(setOrders(res.data.orders));
    };
    fetchorders();
  }, []);

  return (
    <div className="AdminDashBoard">
      <Sidebar />
      {location.pathname === "/admin" ? <Detail /> : <Outlet />}
    </div>
  );
}

export default AdminDashBoard;
