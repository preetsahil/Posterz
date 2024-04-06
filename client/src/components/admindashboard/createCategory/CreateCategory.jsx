import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import "./CreateCategory.scss";
import { useNavigate } from "react-router-dom";
function CreateCategory() {
  const navigate = useNavigate();
  return (
    <div className="createcat">
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
          </div>
          <div className="ctr-btn">
            <p>Save</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCategory;
