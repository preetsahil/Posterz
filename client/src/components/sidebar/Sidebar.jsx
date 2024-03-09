import React, { useState } from "react";
import Logo from "../../assets/logo.svg";
import "./Sidebar.scss";
function Sidebar({ onSidebarClick }) {
  const [activeKey, setActiveKey] = useState(null);
  let collection = [
    { key: "category", name: "Category" },
    {
      key: "product",
      name: "Product",
    },
    { key: "order", name: "Order" },
  ];
  return (
    <div className="Sidebar">
      <div className="sidebar-content">
        <div className="title">
          <img className="icon" src={Logo} alt="" />
          <p className="heading"> Posterz Dashboard</p>
        </div>

        <div className="content">
          <div>
            <h3 className="heading">Content</h3>
          </div>
          {collection.map((list) => (
            <li
              className={list.key === activeKey ? "active" : "list"}
              key={list.key}
              onClick={() => {
                setActiveKey(list.key);
                onSidebarClick(list.name);
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
