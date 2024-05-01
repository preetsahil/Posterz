import React, { useEffect, useRef, useState } from "react";
import "./Category.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TiTick } from "react-icons/ti";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaLessThan, FaGreaterThan } from "react-icons/fa6";

import {
  deleteCategory,
  fetchCategories,
  search,
  sortOnIdDecreasing,
  sortOnIdIncreasing,
  sortOnKeyDecreasing,
  sortOnKeyIncreasing,
  sortOnTitleDecreasing,
  sortOnTitleIncreasing,
} from "../../redux/slices/categorySlice";
import { BsDash } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { updateProductsWithCategoryZero } from "../../redux/slices/productSlice";

function Category() {
  const navigate = useNavigate();
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);
  const dispatch = useDispatch();
  const [visId, setVisId] = useState(false);
  const [visTitle, setVisTitle] = useState(false);
  const [visKey, setVisKey] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const categories = useSelector((state) => state.categoryReducer.categories);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageBorder, setPageBorder] = useState(false);
  const [recordsPerPage, setRecordPerPage] = useState(10);
  const [paginatedCategories, setPaginatedCategories] = useState([]);
  const [nPages, setNPages] = useState("");
  const [pageNumbers, setPageNumbers] = useState([]);

  const recordsPerPageOptions = [10, 20, 30, 40, 50];

  const isCategorySelected = (categoryId) =>
    selectedCategoryIds.includes(categoryId) ||
    selectedCategoryIds.length === paginatedCategories.length;

  const handleCategorySelect = (categoryId) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(
        selectedCategoryIds.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  };

  const handleSelectAllCategories = () => {
    if (selectedCategoryIds.length === paginatedCategories.length) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(
        paginatedCategories.map((category) => category._id)
      );
    }
  };

  const calculateContentTop = () => {
    const categoryElement = document.getElementById("categories");
    if (categoryElement) {
      const { top } = categoryElement.getBoundingClientRect();
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

  const handleItemClick = (categoryId, event) => {
    const deleteIcon = event.target.closest(".del");
    if (deleteIcon) {
      dispatch(deleteCategory(categoryId));
      const category = categories.find(
        (category) => category._id === categoryId
      );
      //add the products in category to updateProductsWithCategoryZero
      category.products.map((product) => {
        return dispatch(updateProductsWithCategoryZero(product));
      });
      return;
    }

    const isClickOnCheckbox =
      event.target.closest(".closeCheck") || event.target.closest(".openCheck");

    if (!isClickOnCheckbox) {
      navigate(`/admin/category/${categoryId}`);
    } else {
      handleCategorySelect(categoryId);
    }
  };

  //onEnter
  const handleSearch = () => {
    const search_params = ["title", "key"];
    dispatch(search([search_params, query]));
  };

  function usePaginatedData(categories, currentPage, recordsPerPage) {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return categories.slice(startIndex, endIndex);
  }
  function handlePageChange(currentPage) {
    setCurrentPage(currentPage);
  }
  useEffect(() => {
    const nPages = Math.ceil(categories.length / recordsPerPage);
    setNPages(nPages);
    const pageNumbers = Array.from({ length: nPages }, (_, i) => i + 1);
    setPageNumbers(pageNumbers);
    if (query.length > 0) {
      setCurrentPage(1);
    }
    const paginatedData = usePaginatedData(
      categories,
      currentPage,
      recordsPerPage
    );
    setPaginatedCategories(paginatedData);
  }, [currentPage, recordsPerPage, categories]);

  return (
    <div
      className="cat"
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
      {location.pathname === "/admin/category" ? (
        <div
          className="Cat"
          onClick={(e) => {
            if (!e.target.closest("#head")) {
              setVisId(false);
              setVisKey(false);
              setVisTitle(false);
              setUp(false);
              setDown(false);
            }
          }}
        >
          <div className={isSticky ? "sticky" : "content"}>
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
                {paginatedCategories.length === 0 && <div></div>}

                {paginatedCategories.length === 1 && (
                  <p className="entry">
                    {" "}
                    {paginatedCategories.length} entry found{" "}
                  </p>
                )}

                {paginatedCategories.length > 1 && (
                  <p className="entry">
                    {" "}
                    {paginatedCategories.length} entries found{" "}
                  </p>
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
          <div className="searchDiv">
            <input
              type="text"
              id="search"
              className="input-search"
              placeholder="Search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value === "") {
                  dispatch(fetchCategories());
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
                  dispatch(fetchCategories());
                }}
              />
            )}
          </div>
          <div className="pop-up">
            {selectedCategoryIds.length === 0 && <div></div>}

            {selectedCategoryIds.length === 1 && (
              <p className="entry">
                {" "}
                {selectedCategoryIds.length} entry selected{" "}
              </p>
            )}

            {selectedCategoryIds.length > 1 && (
              <p className="entry">
                {" "}
                {selectedCategoryIds.length} entries selected{" "}
              </p>
            )}
            {selectedCategoryIds.length >= 1 && (
              <div
                className="delete"
                onClick={async () => {
                  try {
                    if (selectedCategoryIds.length === 1) {
                      const id = selectedCategoryIds[0];
                      dispatch(deleteCategory(id));
                      const category = categories.find(
                        (category) => category._id === id
                      );
                      //add the products in category to updateProductsWithCategoryZero
                      category.products.map((product) => {
                        return dispatch(
                          updateProductsWithCategoryZero(product)
                        );
                      });
                    } else {
                      selectedCategoryIds.map((categoryId) => {
                        dispatch(deleteCategory(categoryId));
                        const category = categories.find(
                          (category) => category._id === categoryId
                        );
                        category.products.map((product) => {
                          return dispatch(
                            updateProductsWithCategoryZero(product)
                          );
                        });
                      });
                    }
                    setSelectedCategoryIds([]);
                  } catch (error) {}
                }}
              >
                Delete
              </div>
            )}
          </div>
          <div className="catgories" id="categories">
            <div className="head" id="head">
              {selectedCategoryIds.length !== paginatedCategories.length && (
                <div
                  className={
                    selectedCategoryIds.length !== 0
                      ? "closeCheck"
                      : "openCheck"
                  }
                  onClick={handleSelectAllCategories}
                >
                  <BsDash className="dash" />
                </div>
              )}
              {selectedCategoryIds.length === paginatedCategories.length && (
                <div
                  className={
                    selectedCategoryIds.length === paginatedCategories.length &&
                    selectedCategoryIds.length !== 0
                      ? "closeCheck"
                      : "openCheck"
                  }
                  onClick={handleSelectAllCategories}
                >
                  <TiTick className="tick" />
                </div>
              )}

              <div className="heading" id="heading">
                <div className="id">
                  <p
                    onClick={() => {
                      if (!visId) {
                        setDown(false);
                        setVisId(true);
                        setVisTitle(false);
                        setVisKey(false);
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
                <div className="image">
                  <p>IMAGE</p>
                </div>
                <div className="products">
                  <p>N-Products </p>
                </div>
              </div>
            </div>
            <div className="cat-list">
              {paginatedCategories?.map((category) => (
                <div
                  className="cat-item"
                  key={category._id}
                  onClick={(e) => {
                    handleItemClick(category._id, e);
                  }}
                >
                  <div
                    className={
                      isCategorySelected(category._id)
                        ? "closeCheck"
                        : "openCheck"
                    }
                  >
                    <TiTick className="tick" />
                  </div>
                  <div className="desc">
                    <div className="id">
                      <p>
                        {category._id.slice(
                          category._id.length - 4,
                          category._id.length
                        )}
                      </p>
                    </div>
                    <div className="title">
                      <p>{category.title}</p>
                    </div>
                    <div className="key">
                      <p>{category.key}</p>
                    </div>
                    <div className="image">
                      <img src={category.image?.url} alt="" />
                      <p>
                        {category.image?.fileName?.slice(0, 2) +
                          category.image?.fileName?.slice(
                            category.image?.fileName?.lastIndexOf(".")
                          )}
                      </p>
                    </div>
                    <div className="products">
                      <p>{category.products?.length}</p>
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

export default Category;
