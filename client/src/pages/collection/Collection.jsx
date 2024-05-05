import React, { useEffect, useState } from "react";
import "./Collection.scss";
import Product from "../../components/product/Product";
import Naruto from "../../assets/naruto.jpeg";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
function Collection() {
  const params = useParams();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState([]);
  const originalCategories = useSelector(
    (state) => state.categoryReducer.originalCategories
  );
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

  const [sortBy, setSortBy] = useState(sortOptions[0].sort);

  async function fetchProducts() {
    try {
      const url = params.categoryId
        ? `/api/products/?category=${params.categoryId}&sort=${sortBy}`
        : `/api/products/?sort=${sortBy}`;
      const response = await axiosClient.get(url);
      setProducts(response.data.products);
    } catch (error) {}
  }

  useEffect(() => {
    setCategoryId(params.categoryId);
    fetchProducts();
  }, [params.categoryId,sortBy]);

  function updateCategory(e) {
    navigate(`/category/${e.target.value}`);
  }

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
              <select
                className="select-sort-by"
                name="sort-by"
                id="sort-by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((item) => (
                  <option key={item.sort} value={item.sort}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="filter-box">
            <div className="category-filter">
              <h3>Category</h3>
              {originalCategories?.map((category) => (
                <div key={category._id} className="filter-radio">
                  <input
                    name="category"
                    type="radio"
                    id={category._id}
                    value={category._id}
                    onChange={updateCategory}
                    checked={category._id === categoryId}
                  />
                  <label htmlFor={category._id}>
                    {category.title.toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="products-box">
            {products.map((product) => {
              return <Product key={product._id} product={product} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;
