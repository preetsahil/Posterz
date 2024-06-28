import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.svg";
import "./Sidebar.scss";
import { useLocation, useNavigate } from "react-router-dom";
function Sidebar({ onSidebarClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(null);
  let collection = [
    {
      key: "category",
      name: "Category",
      paths: [
        "/admin/category",
        "/admin/category/create",
        "/admin/category/:id",
      ],
    },
    {
      key: "product",
      name: "Product",
      paths: ["/admin/product", "/admin/product/create", "/admin/product/:id"],
    },
    { key: "order", name: "Order", path: "/admin/order" },
    { key: "statistics", name: "Statistics", path: "/admin/statistics" },

  ];

  const isPathActive = (paths) => {
    return paths.some((path) => {
      const regexPath = path.replace(/:id/, "[^/]+");
      const regex = new RegExp(`^${regexPath}$`);
      return regex.test(location.pathname);
    });
  };

  useEffect(() => {
    collection.forEach((item) => {
      if (item.paths) {
        if (isPathActive(item.paths)) {
          setActiveKey(item.key);
        }
      } else if (location.pathname === item.path) {
        setActiveKey(item.key);
      }
    });
  }, [location.pathname]);

  return (
    <div className="Sidebar">
      <div className="sidebar-content">
        <div
          className="title"
          onClick={() => {
            setActiveKey(null);
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
              className={
                (list.paths
                  ? isPathActive(list.paths)
                  : location.pathname === list.path) || list.key === activeKey
                  ? "active"
                  : "list"
              }
              key={list.key}
              onClick={() => {
                navigate(list.paths ? list.paths[0] : list.path);
                setActiveKey(list.key);
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
