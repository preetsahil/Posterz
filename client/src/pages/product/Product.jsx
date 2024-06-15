import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Product.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { Outlet, useNavigate } from "react-router-dom";
import {
  deleteProduct,
  fetchProducts,
  searchProducts,
  sortOnIdDecreasing,
  sortOnIdIncreasing,
  sortOnKeyDecreasing,
  sortOnKeyIncreasing,
  sortOnPriceDecreasing,
  sortOnPriceIncreasing,
  sortOnTitleDecreasing,
  sortOnTitleIncreasing,
} from "../../redux/slices/productSlice";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BsDash } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { removeProductFromCategory } from "../../redux/slices/categorySlice";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaLessThan, FaGreaterThan } from "react-icons/fa6";
function Product() {
  const products = useSelector((state) => state.productReducer.products);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ref = useRef(null);
  const navigate = useNavigate();
  const [recordsPerPage, setRecordPerPage] = useState(10);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [nPages, setNPages] = useState("");
  const [pageNumbers, setPageNumbers] = useState([]);
  const [isSticky, setSticky] = useState(false);
  const [visId, setVisId] = useState(false);
  const [visKey, setVisKey] = useState(false);
  const [visTitle, setVisTitle] = useState(false);
  const [visPrice, setVisPrice] = useState(false);
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const [pageBorder, setPageBorder] = useState(false);
  const recordsPerPageOptions = [10, 20, 30, 40, 50];

  const calculateContentTop = () => {
    const productElement = document.getElementById("products");
    if (productElement) {
      const { top } = productElement.getBoundingClientRect();
      if (top < 10) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    }
  };

  const handleScroll = () => {
    calculateContentTop();
  };
  useEffect(() => {
    ref.current?.addEventListener("scroll", handleScroll);
    return () => {
      ref.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = () => {
    const search_params = ["key", "title", "price"];
    dispatch(searchProducts([search_params, query]));
    setCurrentPage(1);
  };

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
    const paginatedData = usePaginatedData(
      products,
      currentPage,
      recordsPerPage
    );
    setPaginatedProducts(paginatedData);
  }, [currentPage, recordsPerPage, products]);

  const handleSelectAllProducts = () => {
    if (selectedProductIds.length === paginatedProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(paginatedProducts.map((product) => product._id));
    }
  };

  const isProductSelected = (productId) => {
    return (
      selectedProductIds.includes(productId) ||
      selectedProductIds.length === paginatedProducts.length
    );
  };
  const handleProductSelect = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(
        selectedProductIds.filter((id) => id !== productId)
      );
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleItemClick = (productId, event) => {
    const deleteIcon = event.target.closest(".del");
    if (deleteIcon) {
      dispatch(deleteProduct(productId));
      const catgeory = products.find(
        (product) => product._id === productId
      ).categories;
      dispatch(removeProductFromCategory([productId, catgeory._id]));
      return;
    }

    const isClickOnCheckbox =
      event.target.closest(".closeCheck") || event.target.closest(".openCheck");
    if (!isClickOnCheckbox) {
      navigate(`/admin/product/${productId}`);
    } else {
      handleProductSelect(productId);
    }
  };

  return (
    <div
      className="prod"
      ref={ref}
      onClick={(e) => {
        const selectRecord = e.target.closest(".recordsperpage");
        if (selectRecord) {
          setPageBorder(true);
        } else {
          setPageBorder(false);
        }
      }}
    >
      {location.pathname === "/admin/product" ? (
        <div
          className="Prod"
          onClick={(e) => {
            if (!e.target.closest("#head")) {
              setVisId(false);
              setVisKey(false);
              setVisTitle(false);
              setVisPrice(false);
              setUp(false);
              setDown(false);
            }
          }}
        >
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
                  navigate("/admin/product/create");
                }}
              >
                <FaPlus className="icon" />
                <p>Create new entry</p>
              </div>
            </div>
          </div>
          <div className="searchDiv">
            <input
              type="text"
              placeholder="Search"
              className="input-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value === "") {
                  dispatch(fetchProducts());
                  setCurrentPage(1);
                }
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <FaSearch className="icon" />
            {query.length > 0 && (
              <RxCross2
                className="cross"
                onClick={() => {
                  setQuery("");
                  dispatch(fetchProducts());
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
          <div className="pop-up">
            {selectedProductIds.length === 0 && <div></div>}

            {selectedProductIds.length === 1 && (
              <p className="entry">
                {" "}
                {selectedProductIds.length} entry selected{" "}
              </p>
            )}

            {selectedProductIds.length > 1 && (
              <p className="entry">
                {" "}
                {selectedProductIds.length} entries selected{" "}
              </p>
            )}
            {selectedProductIds.length >= 1 && (
              <div
                className="delete"
                onClick={() => {
                  try {
                    console.log("sfaj");
                    selectedProductIds.forEach(async (id) => {
                      dispatch(deleteProduct(id));
                      const category = products.find(
                        (product) => product._id === id
                      ).categories;
                      if (category) {
                        dispatch(removeProductFromCategory([id, category._id]));
                      }
                    });
                    setSelectedProductIds([]);
                  } catch (error) {}
                }}
              >
                Delete
              </div>
            )}
          </div>
          <div className="products" id="products">
            <div className="head" id="head">
              {selectedProductIds.length !== paginatedProducts.length && (
                <div
                  className={
                    selectedProductIds.length !== 0 ? "closeCheck" : "openCheck"
                  }
                  onClick={handleSelectAllProducts}
                >
                  <BsDash className="dash" />
                </div>
              )}
              {selectedProductIds.length === paginatedProducts.length && (
                <div
                  className={
                    selectedProductIds.length !== 0 &&
                    selectedProductIds.length === paginatedProducts.length
                      ? "closeCheck"
                      : "openCheck"
                  }
                  onClick={handleSelectAllProducts}
                >
                  <TiTick className="tick" />
                </div>
              )}
              <div className="heading">
                <div className="id">
                  <p
                    onClick={() => {
                      if (!visId) {
                        setDown(false);
                        setVisId(true);
                        setVisTitle(false);
                        setVisKey(false);
                        setVisPrice(false);
                        setUp(true);
                        dispatch(sortOnIdIncreasing());
                        return;
                      }

                      if (up && !down) {
                        setUp(false);
                        setDown(true);
                        dispatch(sortOnIdDecreasing());
                        return;
                      }
                      if (!up && down) {
                        setUp(true);
                        setDown(false);
                        dispatch(sortOnIdIncreasing());
                        return;
                      }
                    }}
                  >
                    ID
                  </p>
                  <IoMdArrowDropup className={up & visId ? "up" : "none"} />
                  <IoMdArrowDropdown
                    className={down & visId ? "down" : "none"}
                  />
                </div>
                <div className="title">
                  <p
                    onClick={() => {
                      if (!visTitle) {
                        setDown(false);
                        setVisTitle(true);
                        setVisId(false);
                        setVisKey(false);
                        setVisPrice(false);
                        setUp(true);
                        dispatch(sortOnTitleIncreasing());
                        return;
                      }

                      if (up && !down) {
                        setUp(false);
                        setDown(true);
                        dispatch(sortOnTitleDecreasing());
                        return;
                      }
                      if (!up && down) {
                        setUp(true);
                        setDown(false);
                        dispatch(sortOnTitleIncreasing());
                        return;
                      }
                    }}
                  >
                    TITLE
                  </p>
                  <IoMdArrowDropup className={up & visTitle ? "up" : "none"} />
                  <IoMdArrowDropdown
                    className={down & visTitle ? "down" : "none"}
                  />
                </div>
                <div className="key">
                  <p
                    onClick={() => {
                      if (!visKey) {
                        setDown(false);
                        setVisKey(true);
                        setVisTitle(false);
                        setVisId(false);
                        setVisPrice(false);
                        setUp(true);
                        dispatch(sortOnKeyIncreasing());
                        return;
                      }

                      if (up && !down) {
                        setUp(false);
                        setDown(true);
                        dispatch(sortOnKeyDecreasing());
                        return;
                      }
                      if (!up && down) {
                        setUp(true);
                        setDown(false);
                        dispatch(sortOnKeyIncreasing());
                        return;
                      }
                    }}
                  >
                    KEY
                  </p>
                  <IoMdArrowDropup className={up & visKey ? "up" : "none"} />
                  <IoMdArrowDropdown
                    className={down & visKey ? "down" : "none"}
                  />
                </div>
                <div className="price">
                  <p
                    onClick={() => {
                      if (!visPrice) {
                        setDown(false);
                        setVisKey(false);
                        setVisTitle(false);
                        setVisId(false);
                        setVisPrice(true);
                        setUp(true);
                        dispatch(sortOnPriceIncreasing());
                        return;
                      }

                      if (up && !down) {
                        setUp(false);
                        setDown(true);
                        dispatch(sortOnPriceDecreasing());
                        return;
                      }
                      if (!up && down) {
                        setUp(true);
                        setDown(false);
                        dispatch(sortOnPriceIncreasing());
                        return;
                      }
                    }}
                  >
                    PRICE
                  </p>
                  <IoMdArrowDropup className={up & visPrice ? "up" : "none"} />
                  <IoMdArrowDropdown
                    className={down & visPrice ? "down" : "none"}
                  />
                </div>
                <div className="image">
                  <p>IMAGE</p>
                </div>
                <div className="istoppick">
                  <p>IsTopPick</p>
                </div>
              </div>
            </div>
            <div className="prod-list">
              {paginatedProducts?.map((product) => (
                <div
                  className="prod-item"
                  key={product._id}
                  onClick={(e) => {
                    handleItemClick(product._id, e);
                  }}
                >
                  <div
                    className={
                      isProductSelected(product._id)
                        ? "closeCheck"
                        : "openCheck"
                    }
                  >
                    <TiTick className="tick" />
                  </div>
                  <div className="info">
                    <div className="id">
                      <p>
                        {product._id.slice(
                          product._id.length - 4,
                          product._id.length
                        )}
                      </p>
                    </div>
                    <div className="title">
                      <p>{product.title}</p>
                    </div>
                    <div className="key">
                      <p>{product.key}</p>
                    </div>
                    <div className="price">
                      <p>{product.price}</p>
                    </div>
                    <div className="image">
                      <img src={product.image?.url} alt="" />
                      <p>
                        {product.image?.fileName?.slice(0, 2) +
                          product.image?.fileName?.slice(
                            product.image?.fileName?.lastIndexOf(".")
                          )}
                      </p>
                    </div>
                    <div className="istoppick">
                      <p className={product.isTopPick ? "true" : "false"}>
                        {product.isTopPick ? "True" : "False"}
                      </p>
                    </div>
                    <div className="icons">
                      <div className="edit">
                        <MdEdit className="edit-icon" />
                      </div>
                      <div className="del">
                        <MdDelete className="del-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pagination">
            <div className="select">
              {pageBorder && (
                <div className="list">
                  {recordsPerPageOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setPageBorder(false);
                        setRecordPerPage(option);
                        setCurrentPage(1);
                      }}
                    >
                      <p
                        className={option === recordsPerPage ? "blue" : "white"}
                      >
                        {option}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="records">
                <div
                  className={
                    pageBorder ? "borderrecordesperpage" : "recordsperpage"
                  }
                  onClick={() => {
                    setPageBorder(!pageBorder);
                  }}
                >
                  <p>{recordsPerPage}</p>
                  <IoMdArrowDropdown className="icon-down" />
                </div>

                <p className="text">Entries per page</p>
              </div>
            </div>

            <div className="page-number">
              <FaLessThan
                className={currentPage > 1 ? "less" : "no-lesser"}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
              />
              <div className="page">
                {pageNumbers?.map((page) => (
                  <div
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "active" : "simple"}
                  >
                    <p>{page}</p>
                  </div>
                ))}
              </div>
              <FaGreaterThan
                className={currentPage < nPages ? "greater" : "no-greater"}
                onClick={() => {
                  if (currentPage < nPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
              />
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
