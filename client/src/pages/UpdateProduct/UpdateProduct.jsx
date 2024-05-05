import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
import {
  fetchCategories,
  removeProductFromCategory,
} from "../../redux/slices/categorySlice";
import { deleteProduct, fetchProducts } from "../../redux/slices/productSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { TbGridDots } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import "./UpdateProduct.scss";
import { axiosClient } from "../../utils/axiosClient";
function UpdateProduct() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [isSticky, setSticky] = useState(false);
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const params = useParams();
  const [price, setPrice] = useState(0);
  const [reqPrice, setReqPrice] = useState(false);
  const ref = useRef(null);
  const [desc, setDesc] = useState("");
  const [key, setKey] = useState("");
  const [reqTitle, setTitleReq] = useState(false);
  const [reqKey, setKeyReq] = useState(false);
  const [reqImage, setImageReq] = useState(false);
  const [dupKey, setDupKey] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showCat, setShowCat] = useState("");
  const products = useSelector((state) => state.productReducer.products);
  const [selectedCat, setSelectedCat] = useState({});
  const [border, setBorder] = useState(true);
  const [catCopy, setcatCopy] = useState([]);
  const categories = useSelector((state) => state.categoryReducer.categories);
  const [dupTitle, setDupTitle] = useState(false);
  const [borderTopPick, setBorderTopPick] = useState(false);
  const [isTopPick, setIsTopPick] = useState(false);
  const [orginalIsTopPick, setOrginalIsTopPick] = useState(false);
  const [name, setName] = useState("");
  const [modifyName, setModifyName] = useState("");
  const [orginalSelectedCat, setOrginalSelectedCat] = useState({});
  const [createdTime, setCreatedTime] = useState("");
  const [updatedTime, setUpdatedTime] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedKey, setUpdatedKey] = useState("");
  const [change, setChange] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [originalDesc, setOriginalDesc] = useState("");
  const [reqTitleLen, setReqTitleLen] = useState(false);
  const [reqKeyLen, setReqKeyLen] = useState(false);

  const calculateContentTop = () => {
    const inputDiv = document.getElementById("input-div");
    if (inputDiv) {
      const { top } = inputDiv.getBoundingClientRect();
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

  const handleDelete = () => {
    dispatch(deleteProduct(params.productId));
    const catgeory = products.find(
      (product) => product._id === params.productId
    ).categories;
    dispatch(removeProductFromCategory([params.productId, catgeory._id]));
    navigate("/admin/product");
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

  const handleClickOutside = (event) => {
    if (showCat && !event.target.closest(".for-select")) {
      setShowCat(false);
      setBorder(true);
    }
    if (borderTopPick && !event.target.closest(".top-pick")) {
      setBorderTopPick(false);
    }
  };
  const compareTwoArray = (orginalSelectedCat, selectedCat) => {
    return orginalSelectedCat._id === selectedCat._id;
  };

  useEffect(() => {
    const copy = categories.filter(
      (category) => selectedCat._id !== category._id
    );
    setcatCopy([...copy]);
    if (compareTwoArray(orginalSelectedCat, selectedCat)) {
      setChange(false);
    } else {
      setChange(true);
    }
  }, [selectedCat, categories]);

  const saveProduct = async () => {
    if (
      updatedTitle === "" &&
      updatedKey === "" &&
      image === "" &&
      price === 0
    ) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setTitleReq(true);
      setKeyReq(true);
      setImageReq(true);
      setReqPrice(true);
      return;
    }
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
    if (updatedTitle === "" && updatedKey === "" && price === 0) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setTitleReq(true);
      setKeyReq(true);
      setReqPrice(true);
      return;
    }
    if (updatedKey === "" && image === "" && price === 0) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setKeyReq(true);
      setImageReq(true);
      setReqPrice(true);
      return;
    }
    if (updatedTitle === "" && image === "" && price === 0) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setTitleReq(true);
      setImageReq(true);
      setReqPrice(true);
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
    if (updatedTitle === "" && price === 0) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setTitleReq(true);
      setReqPrice(true);
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
    if (updatedKey === "" && price === 0) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setKeyReq(true);
      setReqPrice(true);
      return;
    }
    if (image === "" && price === 0) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: These attributes is required!",
        })
      );
      setImageReq(true);
      setReqPrice(true);
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
    if (price === 0) {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: This attribute is required!",
        })
      );
      setReqPrice(true);
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
      await axiosClient.put("/admin/product", {
        id: params.productId,
        title: updatedTitle,
        key: updatedKey,
        desc,
        price,
        image,
        selectedCat,
        isTopPick,
        fileName,
      });
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Success: Product Updated Successfully!",
        })
      );
      setChange(false);
      dispatch(fetchCategories());
      dispatch(fetchProducts());
    } catch (error) {}
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
    if (params.productId) {
      const product = products.find(
        (product) => product._id === params.productId
      );
      if (product) {
        setTitle(product.title);
        setUpdatedTitle(product.title);
        setKey(product.key);
        setUpdatedKey(product.key);
        setDesc(product.desc);
        setOriginalDesc(product.desc);
        setPrice(product.price);
        setOriginalPrice(product.price);
        setFileName(product.image.fileName);
        setImage(product.image.url);
        if (product.categories && Object.keys(product.categories).length > 0) {
          setSelectedCat(product.categories);
          setOrginalSelectedCat(product.categories);
        }
        setIsTopPick(product.isTopPick);
        setOrginalIsTopPick(product.isTopPick);
        setName(product.createdBy?.name || "-");
        setModifyName(product.lastModifyBy?.name || "-");
        setCreatedTime(timeAgo(new Date(product.createdAt)));
        setUpdatedTime(timeAgo(new Date(product.updatedAt)));
      }
    }
  }, [params.productId, products]);

  return (
    <div
      className="Updateprod"
      onClick={(e) => handleClickOutside(e)}
      ref={ref}
    >
      <div className={isSticky ? "st" : "co"}>
        <div
          className="backButton"
          onClick={() => {
            if (change) {
              if (
                confirm(
                  "Are you sure you want to leave this page? All your modifications will be lost"
                )
              ) {
                navigate("/admin/product");
              }
            } else {
              navigate("/admin/product");
            }
          }}
        >
          <FaArrowLeftLong className="icon" />
          Back
        </div>
        <div className="banner">
          <div className="heading">
            <h1 className="title">{title}</h1>
            <p className="entry"> API ID: product</p>
          </div>
          <div
            className={change ? "ctr-btn" : "no-ctr-btn"}
            onClick={() => {
              if (change) {
                saveProduct();
              }
            }}
          >
            <p>Save</p>
          </div>
        </div>
      </div>
      <div className="create-div">
        <div className="input-div" id="input-div">
          <div className="cont1">
            <div className="input-title">
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
                  setReqTitleLen(false);
                }}
              />
              {reqTitle && (
                <div className="error">This attribute is required!</div>
              )}
              {dupTitle && <div className="error">Title already exist</div>}
              {reqTitleLen && (
                <div className="error">
                  Title should have length less than 20
                </div>
              )}
            </div>
            <div className="input-desc">
              <label htmlFor="desc">desc</label>
              <textarea
                rows="5"
                type="text"
                id="desc"
                className="input-cont1"
                value={desc}
                onChange={(e) => {
                  setDesc(e.target.value);
                  if (e.target.value !== originalDesc) {
                    setChange(true);
                  } else {
                    setChange(false);
                  }
                }}
              />
            </div>
          </div>
          <div className="cont2">
            <div className="input-price">
              <label htmlFor="price">
                price<span>*</span>
              </label>
              <input
                type="number"
                id="price"
                className={reqPrice ? "input-req" : "input-cont1"}
                value={price === 0 ? "" : price}
                onChange={(e) => {
                  console.log(e.target.value);
                  if (Number(e.target.value) !== originalPrice) {
                    setChange(true);
                  } else {
                    setChange(false);
                  }
                  setPrice(Number(e.target.value));
                }}
                onClick={() => {
                  setReqPrice(false);
                }}
              />
              {reqPrice && (
                <div className="error">This attribute is required!</div>
              )}
            </div>
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
                      setImage("");
                      setFileName("");
                      setChange(true);
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
          </div>
          <div className="cont3">
            <div className="input-key">
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
                  setReqKeyLen(false);
                }}
              />
              {reqKey && (
                <div className="error">This attribute is required!</div>
              )}
              {dupKey && <div className="error">Key already exist</div>}
              {reqKeyLen && (
                <div className="error">Key should have length less than 20</div>
              )}
            </div>
            <div className="for-select">
              <p className="text">
                {selectedCat && Object.keys(selectedCat).length !== 0
                  ? "category (1)"
                  : "category"}
              </p>
              <div
                className={border ? "dropdown" : "dropdown-border"}
                onClick={(e) => {
                  setShowCat(!showCat);
                  setBorder(!border);
                }}
              >
                <p className="text-1">Add relation</p>
                <IoMdArrowDropdown className="icon-1" />
              </div>
              {showCat && (
                <div className="dropdown-content">
                  <div className="category">
                    {catCopy?.map((category) => (
                      <div
                        key={category._id}
                        onClick={() => {
                          setBorder(!border);
                          setShowCat(!showCat);
                          setSelectedCat(category);
                        }}
                        className="category-item"
                      >
                        <span>
                          <GoDotFill />
                        </span>
                        <p>{category.title.toLowerCase()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCat && Object.keys(selectedCat).length !== 0 && (
                <div className="selected-cat">
                  <div key={selectedCat._id} className="sel-cat">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginLeft: "5px",
                      }}
                    >
                      <TbGridDots className="dots" />
                      <p>{selectedCat.title.toLowerCase()}</p>
                    </div>

                    <RxCross2
                      className="cross"
                      onClick={() => {
                        setSelectedCat({});
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="cont4">
            <div className="top-pick">
              <p>IsTopPick</p>
              <div className={borderTopPick ? "border-select" : "select"}>
                <div
                  className={isTopPick ? "not-false" : "false"}
                  onClick={() => {
                    setIsTopPick(false);
                    if (false !== orginalIsTopPick) {
                      setChange(true);
                    } else {
                      setChange(false);
                    }
                    setBorderTopPick(true);
                  }}
                >
                  <p>FALSE</p>
                </div>
                <div
                  className={isTopPick ? "true" : "not-true"}
                  onClick={() => {
                    setIsTopPick(true);
                    if (true !== orginalIsTopPick) {
                      setChange(true);
                    } else {
                      setChange(false);
                    }
                    setBorderTopPick(true);
                  }}
                >
                  <p>TRUE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="right">
            <div className="info">
              <p
                style={{
                  textAlign: "center",
                  borderBottom: "0.01em solid #474f7a",
                  paddingBottom: "8px",
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
          <div className="button" onClick={handleDelete}>
            <MdDelete />
            <p className="text">Delete this entry</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
