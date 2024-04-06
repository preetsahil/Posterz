import React from "react";
import "./Category.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Category() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div>
      {location.pathname === "/admin/category" ? (
        <div className="Cat">
          <div className="content">
            <div
              className="backButton"
              onClick={() => {
                navigate("/admin/category");
              }}
            >
              <FaArrowLeftLong className="icon" />
              Back
            </div>
            <div className="banner">
              <div className="heading">
                <h1 className="title">Category</h1>
                <p className="entry"> 2 enteries found</p>
              </div>
              <div
                className="ctr-btn"
                onClick={() => {
                  navigate("/admin/category/create");
                }}
              >
                <FaPlus className="icon" />
                <p>Create new entry</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default Category;
