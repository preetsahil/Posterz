import React from "react";
import "./Collection.scss";
import Product from "../../components/product/Product";
import Naruto from "../../assets/naruto.jpeg";
function Collection() {
  const sortOptions = [
    {
      value: "Price - Low To High",
      sort: "price",
    },
    {
      value: "Newest First",
      sort: "createdAt",
    },
  ];

  return (
    <div className="Collection">
      <div className="container">
        <div className="header">
          <div className="info">
            <h2>Explore All Print and Artwork</h2>
            <p>
              India's largest collection of wall posters for your bedroom,
              living room, kids room, kitchen and posters & art prints at
              highest quality lowest price guaranteed.
            </p>
          </div>
          <div className="sort-by">
            <div className="sort-by-container">
              <h3 className="sort-by-text">Sort By</h3>
              <select className="select-sort-by" name="sort-by" id="sort-by">
                {sortOptions.map((item) => {
                  <option key={item.sort} value={item.sort}>
                    {item.value}
                  </option>;
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="filter-box">
            <div className="category-filter">
              <h3>Category</h3>
              <div className="filter-radio">
                <label>
                  <input
                    type="radio"
                    id="anime"
                    name="category"
                    value="anime"
                  />
                  Anime
                </label>
                <label>
                  <input
                    type="radio"
                    id="sports"
                    name="category"
                    value="sports"
                  />
                  Sports
                </label>
                <label>
                  <input
                    type="radio"
                    id="tv shows"
                    name="category"
                    value="tv shows"
                  />
                  TV Shows
                </label>
              </div>
            </div>
          </div>
          <div className="products-box">
            <Product image={Naruto} />
            <Product image={Naruto} />
            <Product image={Naruto} />
            <Product image={Naruto} />
            <Product image={Naruto} />
            <Product image={Naruto} />
            <Product image={Naruto} />
            <Product image={Naruto} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;
