import React, { useEffect, useRef, useState } from "react";
import "./Category.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TiTick } from "react-icons/ti";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { deleteCategory } from "../../redux/slices/categorySlice";
import { BsDash } from "react-icons/bs";

function Category() {
  const navigate = useNavigate();
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);
  const dispatch = useDispatch();

  const [visId, setVisId] = useState(false);
  const [visTitle, setVisTitle] = useState(false);
  const [visKey, setVisKey] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const categories = useSelector((state) => state.categoryReducer.categories);

  const isCategorySelected = (categoryId) =>
    selectedCategoryIds.includes(categoryId) ||
    selectedCategoryIds.length === categories.length;

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
    if (selectedCategoryIds.length === categories.length) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(categories.map((category) => category._id));
    }
  };

  const calculateContentTop = () => {
    const categoryElement = document.getElementById("categories");
    if (categoryElement) {
      const { top } = categoryElement.getBoundingClientRect();
      if (top < 51) {
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
    const isClickOnCheckbox =
      event.target.closest(".closeCheck") || event.target.closest(".openCheck");

    if (!isClickOnCheckbox) {
      navigate(`/admin/category/${categoryId}`);
    } else {
      handleCategorySelect(categoryId);
    }
  };

  return (
    <div className="cat" ref={ref}>
      {location.pathname === "/admin/category" ? (
        <div className="Cat">
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
                <h1 className="title">Category </h1>
                {categories.length === 0 && <div></div>}

                {categories.length === 1 && (
                  <p className="entry"> {categories.length} entry found </p>
                )}

                {categories.length > 1 && (
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
                {selectedCategoryIds.length} entries found{" "}
              </p>
            )}
            {selectedCategoryIds.length >= 1 && (
              <div
                className="delete"
                onClick={async () => {
                  try {
                    if (selectedCategoryIds.length === 1) {
                      dispatch(deleteCategory(selectedCategoryIds[0]));
                    } else {
                      selectedCategoryIds.map((categoryId) => {
                        dispatch(deleteCategory(categoryId));
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
            <div className="head">
              {selectedCategoryIds.length !== categories.length && (
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
              {selectedCategoryIds.length === categories.length && (
                <div
                  className={
                    selectedCategoryIds.length === categories.length &&
                    selectedCategoryIds.length !== 0
                      ? "closeCheck"
                      : "openCheck"
                  }
                  onClick={handleSelectAllCategories}
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
                        setUp(false);
                        setVisId(true);
                        setVisTitle(false);
                        setVisKey(false);
                      }

                      if (!up && !down) {
                        setUp(true);
                      }
                      if (up && !down) {
                        setUp(false);
                        setDown(true);
                      }
                      if (!up && down) {
                        setUp(true);
                        setDown(false);
                      }
                    }}
                  >
                    ID
                  </p>
                  <span></span>
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
                        setUp(false);
                        setVisTitle(true);
                        setVisId(false);
                        setVisKey(false);
                      }

                      if (!up && !down) {
                        setUp(true);
                      }
                      if (up && !down) {
                        setUp(false);
                        setDown(true);
                      }
                      if (!up && down) {
                        setUp(true);
                        setDown(false);
                      }
                    }}
                  >
                    TITLE
                  </p>
                  <span></span>

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
                        setUp(false);
                        setVisKey(true);
                        setVisTitle(false);
                        setVisId(false);
                      }

                      if (!up && !down) {
                        setUp(true);
                      }
                      if (up && !down) {
                        setUp(false);
                        setDown(true);
                      }
                      if (!up && down) {
                        setUp(true);
                        setDown(false);
                      }
                    }}
                  >
                    KEY
                  </p>
                  <span></span>
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
              {categories?.map((category) => (
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
                          category._id.length - 2,
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
                        {category.image.fileName?.slice(0, 2) +
                          category.image.fileName?.slice(
                            category.image.fileName.lastIndexOf(".")
                          )}
                      </p>
                    </div>
                    <div className="products">
                      <p>{category.products?.length}</p>
                    </div>
                  </div>
                </div>
              ))}
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
