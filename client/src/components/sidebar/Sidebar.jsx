import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.svg";
import "./Sidebar.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import {
  KEY_ADMIN_TOKEN,
  OAUTH_ACCESS_TOKEN,
  OAUTH_ADMIN_TOKEN,
  getItem,
  removeItem,
} from "../../utils/localStorageManager";
import { axiosClient } from "../../utils/axiosClient";
import {
  deleteAdminProfile,
  deleteProfile,
} from "../../redux/slices/profileSlice";
import axios from "axios";

let baseURL = "http://localhost:4000";
if (import.meta.env.PROD) {
  baseURL = import.meta.env.VITE_REACT_APP_SERVER_BASE_URL;
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [toaster, setToaster] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const adminProfile = useSelector(
    (state) => state.profileReducer.adminProfile
  );
  const profile = useSelector((state) => state.profileReducer.profile);

  const name = adminProfile?.name
    ? adminProfile.name.split(" ").reduce((res, word) => (res += word[0]), "")
    : "";

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

  const logoutHandler = async () => {
    if (getItem(OAUTH_ADMIN_TOKEN)) {
      removeItem(OAUTH_ADMIN_TOKEN);
      removeItem(OAUTH_ACCESS_TOKEN);
      await axiosClient.post("/auth/logout", { profile });
      dispatch(deleteAdminProfile());
      dispatch(deleteProfile());
      setToaster(false);
    } else if (getItem(KEY_ADMIN_TOKEN)) {
      removeItem(KEY_ADMIN_TOKEN);
      dispatch(deleteAdminProfile());
      await axios
        .create({
          baseURL,
          withCredentials: true,
        })
        .post("/auth/revoke");
    }

    navigate("/adminlogin");
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
    <div
      className="Sidebar"
      onClick={(e) => {
        const closeTOUserCont = e.target.closest(".usercontainer");
        if (!closeTOUserCont) {
          setToaster(false);
        }
      }}
    >
      <div className="separator">
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
        <div className="bottombox">
          {toaster && (
            <div className="profileContainer">
              <div
                className="profile"
                onClick={() => navigate("/admin/profile")}
              >
                Profile
              </div>
              <div className="logout" onClick={logoutHandler}>
                <p className="heading">Logout</p>
                <IoLogOutOutline className="logouticon" />
              </div>
            </div>
          )}
          <div
            className="usercontainer"
            onClick={() => {
              setToaster(!toaster);
            }}
          >
            <div className="namecontainer">
              <p className="heading">{name}</p>
            </div>
            <p className="name">{adminProfile?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
