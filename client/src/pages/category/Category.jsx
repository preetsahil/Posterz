import React from "react";
import "./Category.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Category() {
  const navigate = useNavigate();
  const location = useLocation();
  const categories = useSelector((state) => state.categoryReducer.categories);

  return (
    <div className="cat">
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
                {categories.length === 1 ? (
                  <p className="entry"> {categories.length} entry found </p>
                ) : (
                  <p className="entry"> {categories.length} entries found </p>
                )}
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
