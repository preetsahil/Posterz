import React, { useState } from "react";
import Logo from "../../assets/logo.svg";
import "./Sidebar.scss";
import { useLocation, useNavigate } from "react-router-dom";
function Sidebar({ onSidebarClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey,setActiveKey]=useState(null);
  let collection = [
    { key: "category", name: "Category", path: "/admin/category" },
    {
      key: "product",
      name: "Product",
      path: "/admin/product",
    },
    { key: "order", name: "Order", path: "/admin/order" },
  ];
  return (
    <div className="Sidebar">
      <div className="sidebar-content">
        <div
          className="title"
          onClick={() => {
            navigate("/admin");
          }}
        >
          <img className="icon" src={Logo} alt="" />
          <p className="heading"> Posterz Dashboard</p>
        </div>

        <div className="content">
          <div>
            <h3 className="heading">Content</h3>
          </div>
          {collection.map((list) => (
            <li
              className={location.pathname === list.path || list.key===activeKey ? "active" : "list"}
              key={list.key}
              onClick={() => {
                navigate(list.path)
                setActiveKey(list.key)
              }}
            >
              {list.name}
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
