import React, { useState } from "react";
import "./Category.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TiTick } from "react-icons/ti";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";

function Category() {
  const navigate = useNavigate();

  const location = useLocation();
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);
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

  return (
    <div className="cat">
      {location.pathname === "/admin/category" ? (
        <div className="Cat">
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
                {categories.length === 1 ? (
                  <p className="entry"> {categories.length} entry found </p>
                ) : (
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
          <div className="catgories">
            <div className="head">
              <div
                className={
                  selectedCategoryIds.length === categories.length
                    ? "closeCheck"
                    : "openCheck"
                }
                onClick={handleSelectAllCategories}
              >
                <TiTick className="tick" />
              </div>
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
                  <p>N-Products</p>
                </div>
              </div>
            </div>
            <div className="cat-list">
              {categories.map((category) => (
                <div className="cat-item" key={category._id}>
                  <div
                    className={
                      isCategorySelected(category._id)
                        ? "closeCheck"
                        : "openCheck"
                    }
                    onClick={() => handleCategorySelect(category._id)}
                  >
                    <TiTick className="tick" />
                  </div>
                  <div
                    className="desc"
                    onClick={() => {
                      console.log(category._id);
                      //   navigate(`/admin/category/${category._id}`);
                    }}
                  >
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
                      <img src={category.image.url} alt="" />
                      <p>{category.image.fileName?.slice(0, 2)}</p>
                    </div>
                    <div className="products">
                      <p>{category.products.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cat-list">
              {categories.map((category) => (
                <div className="cat-item" key={category._id}>
                  <div
                    className={
                      isCategorySelected(category._id)
                        ? "closeCheck"
                        : "openCheck"
                    }
                    onClick={() => handleCategorySelect(category._id)}
                  >
                    <TiTick className="tick" />
                  </div>
                  <div
                    className="desc"
                    onClick={() => {
                      console.log(category._id);
                      //   navigate(`/admin/category/${category._id}`);
                    }}
                  >
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
                      <img src={category.image.url} alt="" />
                      <p>{category.image.fileName?.slice(0, 2)}</p>
                    </div>
                    <div className="products">
                      <p>{category.products.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cat-list">
              {categories.map((category) => (
                <div className="cat-item" key={category._id}>
                  <div
                    className={
                      isCategorySelected(category._id)
                        ? "closeCheck"
                        : "openCheck"
                    }
                    onClick={() => handleCategorySelect(category._id)}
                  >
                    <TiTick className="tick" />
                  </div>
                  <div
                    className="desc"
                    onClick={() => {
                      console.log(category._id);
                      //   navigate(`/admin/category/${category._id}`);
                    }}
                  >
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
                      <img src={category.image.url} alt="" />
                      <p>{category.image.fileName?.slice(0, 2)}</p>
                    </div>
                    <div className="products">
                      <p>{category.products.length}</p>
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
