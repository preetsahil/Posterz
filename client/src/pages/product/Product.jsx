import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./Product.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { Outlet, useNavigate} from "react-router-dom";
function Product() {
  const products = useSelector((state) => state.productReducer.products);
  const [currentPage, setCurrentPage] = useState(1);
  const ref=useRef(null)
  const navigate=useNavigate()
  const [recordsPerPage, setRecordPerPage] = useState(10);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [nPages, setNPages] = useState("");
  const [pageNumbers, setPageNumbers] = useState([]);
  const [isSticky, setSticky] = useState(false);



  // const calculateContentTop = () => {
  //   const categoryElement = document.getElementById("categories");
  //   if (categoryElement) {
  //     const { top } = categoryElement.getBoundingClientRect();
  //     if (top < 10) {
  //       setSticky(true);
  //     } else {
  //       setSticky(false);
  //     }
  //   }
  // };

  // const handleScroll = () => {
  //   calculateContentTop();
  // };
  // useEffect(() => {
  //   ref.current?.addEventListener("scroll", handleScroll);
  //   return () => {
  //     ref.current?.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  function usePaginatedData(products, currentPage, recordsPerPage) {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return products.slice(startIndex, endIndex);
  }
  function handlePageChange(currentPage) {
    setCurrentPage(currentPage);
  }

  useEffect(() => {
    const nPages = Math.ceil(products.length / recordsPerPage);
    setNPages(nPages);
    const pageNumbers = Array.from({ length: nPages }, (_, i) => i + 1);
    setPageNumbers(pageNumbers);
    // if (query.length > 0) {
    //   setCurrentPage(1);
    // }
    const paginatedData = usePaginatedData(
      products,
      currentPage,
      recordsPerPage
    );
    setPaginatedProducts(paginatedData);
  }, [currentPage, recordsPerPage, products]);
  return (
    <div className="prod" ref={ref}>
      {location.pathname === "/admin/product" ? (
        <div className="Prod">
          <div className={isSticky ? "sticky" : "content"}>
            <div
              className="backButton"
              onClick={() => {
                navigate("/admin/product");
              }}
            >
              <FaArrowLeftLong className="icon" />
              Back
            </div>
            <div className="banner">
              <div className="heading">
                <h1 className="title">Product</h1>
                {paginatedProducts.length === 0 && <div></div>}

                {paginatedProducts.length === 1 && (
                  <p className="entry">
                    {" "}
                    {paginatedProducts.length} entry found{" "}
                  </p>
                )}

                {paginatedProducts.length > 1 && (
                  <p className="entry">
                    {" "}
                    {paginatedProducts.length} entries found{" "}
                  </p>
                )}
              </div>
              <div
                className="ctr-btn"
                onClick={() => {
                  console.log("sf")
                  navigate("/admin/product/create");
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

export default Product;
