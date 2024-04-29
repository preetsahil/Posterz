import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./CreateProduct.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
function CreateProduct() {
  const categories = useSelector(
    (state) => state.categoryReducer.originalCategories
  );
  const ref = useRef(null);
  const navigate = useNavigate();
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

  return (
    <div className="createcat" ref={ref}>
      <div className={isSticky ? "sticky" : "content"}>
        <div
          className="backButton"
          onClick={() => {
            if (image || title || key || selectedProd.length > 0) {
              if (
                confirm(
                  "Are you sure you want to leave this page? All your modifications will be lost"
                )
              ) {
                setImage("");
                setTitle("");
                setKey("");
                setSelectedProd([]);
                navigate("/admin/category");
              }
            } else {
              navigate("/admin/category");
            }
          }}
        >
          <FaArrowLeftLong className="icon" />
          Back
        </div>
        <div className="banner">
          <div className="heading">
            <h1 className="title">Create an entry</h1>
            <p className="entry"> API ID: product</p>
          </div>
          <div className="ctr-btn">
            <p>Save</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
