import React from "react";
import "./Category.scss";
import { useNavigate } from "react-router-dom";
function Category({ category }) {
  const navigate = useNavigate();
  return (
    <div
      className="Category"
      style={{
        backgroundImage: `url(${category.image.url})`,
      }}
      onClick={() => {
        navigate(`/category/${category._id}`)
      }}
    >
      <div className="category-content center">
        <h3 className="heading">{category.title}</h3>
      </div>
    </div>
  );
}

export default Category;
