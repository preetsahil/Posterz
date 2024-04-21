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
  const [fill, setFill] = useState(false);
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);
  const [visId, setVisId] = useState(false);
  const [visTitle, setVisTitle] = useState(false);
  const [visKey, setVisKey] = useState(false);
  const categories = useSelector((state) => state.categoryReducer.categories);

  const fillAllCheck = () => {
    setFill(!fill);
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
          <div className="cat-list">
        <div className="head">
          <div
            className={fill ? "closeCheck" : "openCheck"}
            onClick={fillAllCheck}
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
              <IoMdArrowDropup className={up & visId ? "up" : "none"} />
              <IoMdArrowDropdown className={down & visId ? "down" : "none"} />
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
              <IoMdArrowDropup className={up & visTitle ? "up" : "none"} />
              <IoMdArrowDropdown
                className={down & visTitle ? "down" : "none"}
              />
            </div>
            <div
              className="key"
             
            >
              <p  onClick={() => {
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
              }}>KEY</p>
              <IoMdArrowDropup className={up & visKey ? "up" : "none"} />
              <IoMdArrowDropdown className={down & visKey ? "down" : "none"} />
            </div>
            <div className="image">
              <p>IMAGE</p>
            </div>
            <div className="products">
              <p>N-Products</p>
            </div>
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

export default Category;
