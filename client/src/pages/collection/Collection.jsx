import React, { useEffect, useState } from "react";
import "./Collection.scss";
import Product from "../../components/product/Product";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaLessThan, FaGreaterThan } from "react-icons/fa6";
import { axiosClient } from "../../utils/axiosClient";
import Loader from "../../components/loader/Loader";
function Collection() {
  const params = useParams();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const recordsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
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
  }, [params.categoryId, sortBy]);

  function updateCategory(e) {
    setCurrentPage(1);
    navigate(`/category/${e.target.value}`);
  }

  function usePaginatedData(products, currentPage) {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return products.slice(startIndex, endIndex);
  }
  function handlePageChange(currentPage) {
    setCurrentPage(currentPage);
  }

  useEffect(() => {
    const nPages = Math.ceil(products.length / recordsPerPage);
    const pageNumbers = Array.from({ length: nPages }, (_, i) => i + 1);
    setPageNumbers(pageNumbers);
    // if (query.length > 0) {
    //   setCurrentPage(1);
    // }

    const paginatedData = usePaginatedData(products, currentPage);
    setPaginatedProducts(paginatedData);
  }, [currentPage, products]);

  if (!products || !paginatedProducts) {
    return <Loader />;
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
            <div className="product">
              {paginatedProducts.map((product) => {
                return <Product key={product._id} product={product} />;
              })}
            </div>
            <div className="page-number">
              <table>
                <tbody>
                  <tr className="page">
                    {pageNumbers?.map((page) => (
                      <td
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "active" : "simple"}
                      >
                        <p>{page}</p>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;
