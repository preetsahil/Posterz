import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import "./UpdateCategory.scss";
import { TbGridDots } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
import { MdDelete } from "react-icons/md";
import { showToast } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import {
  deleteCategory,
  fetchCategories,
} from "../../redux/slices/categorySlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProducts,
  updateProductsWithCategoryZero,
} from "../../redux/slices/productSlice";

let category;
function UpdateCategory() {
  const [image, setImage] = useState("");
  const ref = useRef(null);
  const params = useParams();
  const [isSticky, setSticky] = useState(false);
  const [title, setTitle] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [change, setChange] = useState(false);
  const dispatch = useDispatch();
  const [key, setKey] = useState("");
  const [updatedKey, setUpdatedKey] = useState("");
  const [reqTitle, setTitleReq] = useState(false);
  const [reqKey, setKeyReq] = useState(false);
  const [reqImage, setImageReq] = useState(false);
  const [dupKey, setDupKey] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showProd, setShowProd] = useState("");
  const products = useSelector((state) => state.productReducer.products);
  const [selectedProd, setSelectedProd] = useState([]);
  const [border, setBorder] = useState(true);
  const [productsCopy, setProductsCopy] = useState([]);
  const categories = useSelector((state) => state.categoryReducer.categories);
  const [dupTitle, setDupTitle] = useState(false);
  const [originalSelectedProd, setOriginalSelectedProd] = useState([]);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [createdTime, setCreatedTime] = useState("");
  const [updatedTime, setUpdatedTime] = useState("");
  const [modifyName, setModifyName] = useState("");


  const handleDrop = (e) => {
    let dt = e.dataTransfer;
    let file = dt.files[0];
    const fileReader = new FileReader();
    setFileName(file.name);
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setImage(fileReader.result);
      }
    };
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const fileReader = new FileReader();
    setFileName(file.name);
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setImage(fileReader.result);
      }
    };
  };
  const saveCategory = async () => {
    if (updatedTitle === "" && updatedKey === "" && image === "") {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setTitleReq(true);
      setKeyReq(true);
      setImageReq(true);
      return;
    }
    if (updatedTitle === "" && image === "") {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setTitleReq(true);
      setImageReq(true);
      return;
    }
    if (updatedTitle === "" && updatedKey === "") {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setTitleReq(true);
      setKeyReq(true);
      return;
    }
    if (updatedKey === "" && image === "") {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setKeyReq(true);
      setImageReq(true);
      return;
    }

    if (updatedTitle === "") {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: This attribute is required!",
        })
      );
      setTitleReq(true);
      return;
    }
    if (image === "") {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: This attribute is required!",
        })
      );
      setImageReq(true);
      return;
    }

    if (updatedKey === "") {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: This attribute is required!",
        })
      );
      setKeyReq(true);
      return;
    }

    if (updatedKey !== key && updatedTitle !== title) {
      const keyExists = categories.some(
        (category) => category.key === updatedKey
      );
      const titleExists = categories.some(
        (category) => category.title === updatedTitle
      );
      if (titleExists && keyExists) {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: "Warning: Title and Key already exists!",
          })
        );
        setDupTitle(true);
        setDupKey(true);
        return;
      }
    }
    if (updatedTitle !== title) {
      const titleExists = categories.some(
        (category) => category.title === updatedTitle
      );
      if (titleExists) {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: "Warning: Title already exists!",
          })
        );
        setDupTitle(true);
        return;
      }
    }
    if (updatedKey !== key) {
      const keyExists = categories.some(
        (category) => category.key === updatedKey
      );
      if (keyExists) {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: "Warning: Key already exists!",
          })
        );
        setDupKey(true);
        return;
      }
    }

    try {
      await axiosClient.put("/admin/category", {
        id: params.categoryId,
        title: updatedTitle,
        key: updatedKey,
        fileName,
        image,
        selectedProd,
      });
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Success: Category Updated Successfully!",
        })
      );
      setChange(false);
      dispatch(fetchCategories());
      dispatch(fetchProducts());
    } catch (error) {}
  };
  const handleClickOutside = (event) => {
    if (showProd && !event.target.closest(".for-select")) {
      setShowProd(false);
      setBorder(true);
    }
  };

  function timeAgo(date) {
    const now = new Date();
    const secondsAgo = Math.round((now - date) / 1000);
    const minutesAgo = Math.round(secondsAgo / 60);
    const hoursAgo = Math.round(minutesAgo / 60);
    const daysAgo = Math.round(hoursAgo / 24);

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    } else if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} hours ago`;
    } else {
      return `${daysAgo} days ago`;
    }
  }

  useEffect(() => {
    if (params.categoryId) {
      category = categories.find(
        (category) => category._id === params.categoryId
      );
      if (category) {
        setTitle(category.title);
        setKey(category.key);
        setImage(category.image.url);
        setSelectedProd(category.products);
        setOriginalSelectedProd(category.products);
        setFileName(category.image.fileName);
        setUpdatedKey(category.key);
        setUpdatedTitle(category.title);
        setModifyName(category.lastModifyBy?.name || "-");
        setName(category.createdBy?.name || "-");
        setCreatedTime(timeAgo(new Date(category.createdAt)));
        setUpdatedTime(timeAgo(new Date(category.updatedAt)));
      }
    }
  }, [params.categoryId, categories]);
  const compareTwoArray = (originalSelectedProd, selectedProd) => {
    return (
      originalSelectedProd.length === selectedProd.length &&
      originalSelectedProd.every((orgProd) =>
        selectedProd.find((selProd) => selProd._id === orgProd._id)
      )
    );
  };
  useEffect(() => {
    const copy = products.filter(
      (product) => !selectedProd.some((prod) => prod._id === product._id)
    );

    //check if the products that are in selected is same as the products that was in the original selected
    //match their id
    //if they are not the same, set change to true
    if (compareTwoArray(originalSelectedProd, selectedProd)) {
      setChange(false);
    } else {
      setChange(true);
    }

    setProductsCopy([...copy]);
  }, [selectedProd, products]);
  const calculateContentTop = () => {
    const inputDiv = document.getElementById("input-div");

    if (inputDiv) {
      const { top } = inputDiv.getBoundingClientRect();
      if (top < 80) {
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

  const handleDelete = () => {
    try {
      dispatch(deleteCategory(params.categoryId));
      const category = categories.find(
        (category) => category._id === params.categoryId
      );
      //add the products in category to updateProductsWithCategoryZero
      category.products.map((product) => {
        return dispatch(updateProductsWithCategoryZero(product));
      });
      navigate("/admin/category");
    } catch (error) {}
  };
  return (
    <div className="updatecat" onClick={(e) => handleClickOutside(e)} ref={ref}>
      <div className={isSticky ? "sticky" : "content"}>
        <div
          className="backButton"
          onClick={() => {
            if (change) {
              if (
                confirm(
                  "Are you sure you want to leave this page? All your modifications will be lost"
                )
              ) {
                navigate(-1);
              }
            } else {
              navigate(-1);
            }
          }}
        >
          <FaArrowLeftLong className="icon" />
          Back
        </div>
        <div className="banner">
          <div className="heading">
            <h1 className="title">{title}</h1>
            <p className="entry"> API ID: category</p>
          </div>
          <div
            className={change ? "ctr-btn" : "no-ctr-btn"}
            onClick={() => {
              if (change) {
                saveCategory();
              }
            }}
          >
            <p>Save</p>
          </div>
        </div>
      </div>
      <div className="update-div">
        <div className="input-div" id="input-div">
          <div className="cont1">
            <div className="col">
              <label htmlFor="title">
                title<span>*</span>
              </label>
              <input
                type="text"
                id="title"
                className={reqTitle ? "input-req" : "input-cont1"}
                value={updatedTitle}
                onChange={(e) => {
                  setUpdatedTitle(e.target.value.toUpperCase());
                  if (e.target.value.toUpperCase() !== title) {
                    setChange(true);
                  } else {
                    setChange(false);
                  }
                }}
                onClick={() => {
                  setTitleReq(false);
                  setDupTitle(false);
                }}
              />
              {reqTitle && (
                <div className="error">This attribute is required!</div>
              )}
              {dupTitle && <div className="error">Title already exist</div>}
            </div>
            <div className="col">
              <label htmlFor="key">
                key<span>*</span>
              </label>
              <input
                type="text"
                id="key"
                className={reqKey ? "input-req" : "input-cont1"}
                value={updatedKey}
                onChange={(e) => {
                  setUpdatedKey(e.target.value.toLowerCase());
                  if (e.target.value.toLowerCase() !== key) {
                    setChange(true);
                  } else {
                    setChange(false);
                  }
                }}
                onClick={() => {
                  setKeyReq(false);
                  setDupKey(false);
                }}
              />
              {reqKey && (
                <div className="error">This attribute is required!</div>
              )}
              {dupKey && <div className="error">Key already exist</div>}
            </div>
          </div>
          <div className="cont2">
            <div className="for-image">
              <p className="text">
                image<span>*</span>
              </p>
              {image ? (
                <div className="del">
                  <img src="" alt={fileName} />
                  <div
                    className="del-icon"
                    onClick={() => {
                      setChange(true);
                      setImage("");
                      setFileName("");
                    }}
                  >
                    <MdDelete />
                  </div>
                  <p>{fileName}</p>
                </div>
              ) : (
                <div
                  className={reqImage ? "req-image" : "input-ct-img"}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDrop(e);
                  }}
                  onClick={() => {
                    setImageReq(false);
                  }}
                >
                  <label htmlFor="inputImg" className="labelImg">
                    <RiImageAddFill className="icon" />
                    <p>
                      Click to add an asset or drag and drop one in this area
                    </p>
                  </label>
                  <input
                    type="file"
                    className="inputImg"
                    id="inputImg"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              )}
              {reqImage && (
                <div className="error">This attribute is required!</div>
              )}
            </div>
            <div className="for-select">
              <p className="text">
                {selectedProd.length === 0
                  ? "products"
                  : `products (${selectedProd.length})`}
              </p>

              <div
                className={border ? "dropdown" : "dropdown-border"}
                onClick={(e) => {
                  setShowProd(!showProd);
                  setBorder(!border);
                }}
              >
                <p className="text-1">Add relation</p>
                <IoMdArrowDropdown className="icon-1" />
              </div>
              {showProd && (
                <div className="dropdown-content">
                  <div className="product">
                    {productsCopy?.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          setBorder(!border);
                          setShowProd(!showProd);
                          setSelectedProd([...selectedProd, product]);
                        }}
                        className="product-item"
                      >
                        <span>
                          <GoDotFill />
                        </span>
                        {product.title.length >= 25 && (
                          <p>{product.title.toLowerCase().slice(0, 20)}...</p>
                        )}
                        {product.title.length < 25 && (
                          <p>{product.title.toLowerCase()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedProd.length !== 0 && (
                <div className="selected-prod">
                  {selectedProd.map((product) => (
                    <div key={product._id} className="sel-prod">
                      <div className="contentbox">
                        <TbGridDots className="dots" />
                        {product.title.length >= 25 && (
                          <p
                            onClick={() =>
                              navigate(`/admin/product/${product._id}`)
                            }
                          >
                            {product.title.toLowerCase().slice(0, 20)}...
                          </p>
                        )}
                        {product.title.length < 25 && (
                          <p
                            onClick={() =>
                              navigate(`/admin/product/${product._id}`)
                            }
                          >
                            {product.title.toLowerCase()}
                          </p>
                        )}
                      </div>

                      <RxCross2
                        className="cross"
                        onClick={() => {
                          setSelectedProd(
                            selectedProd.filter(
                              (prod) => prod._id !== product._id
                            )
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="right-box">
          <div className="right">
            <div className="info">
              <p
                style={{
                  textAlign: "center",
                  borderBottom: "0.01em solid #474f7a",
                  paddingBottom: "8px",
                  fontSize: "1.2rem",
                }}
              >
                INFORMATION
              </p>
              <div className="createdAt">
                <p className="white">Created </p>
                <p className="grey">{createdTime}</p>
              </div>
              <div className="by">
                <p className="white">By</p>
                <p className="grey">{name}</p>
              </div>
              <div className="updatedAt">
                <p className="white">Last update</p>
                <p className="grey">{updatedTime}</p>
              </div>
              <div className="by">
                <p className="white">By</p>
                <p className="grey">{modifyName}</p>
              </div>
            </div>
          </div>
          <div className="button-button" onClick={handleDelete}>
            <MdDelete />
            <p className="text">Delete this entry</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateCategory;
