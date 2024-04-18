import React from "react";
import "./Category.scss";
function Category({ category }) {
  return (
    <div
      className="Category"
      style={{
        backgroundImage: `url(${category.image.url})`,
      }}
    >
      <div className="category-content center">
        <h3 className="heading">{category.title}</h3>
      </div>
    </div>
  );
}

export default Category;
