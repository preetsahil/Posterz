import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CreateProduct.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { TbGridDots } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
import { fetchProducts } from "../../redux/slices/productSlice";
import { axiosClient } from "../../utils/axiosClient";
import { fetchCategories } from "../../redux/slices/categorySlice";
function CreateProduct() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [isSticky, setSticky] = useState(false);
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (Object.keys(selectedCat).length === 0) {
      setcatCopy([...categories]);
    } else {
      const copy = categories.filter(
        (category) => selectedCat._id !== category._id
      );
      setcatCopy([...copy]);
    }
  }, [selectedCat, categories]);

  const saveProduct = async () => {
    if (title === "" && key === "" && image === "" && price === 0) {
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
    if (title === "" && key === "" && image === "") {
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
    if (title === "" && key === "" && price === 0) {
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
    if (key === "" && image === "" && price === 0) {
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
    if (title === "" && image === "" && price === 0) {
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
    if (title === "" && key === "") {
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
    if (title === "" && image === "") {
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
    if (title === "" && price === 0) {
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
    if (key === "" && image === "") {
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
    if (key === "" && price === 0) {
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
    if (title === "") {
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: This attribute is required!",
        })
      );
      setTitleReq(true);
      return;
    }
    if (key === "") {
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

    const titleExists = products.some((product) => product.title === title);
    const keyExists = products.some((product) => product.key === key);

    if (titleExists && keyExists) {
      // Both title and key already exist
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: Title and Key already exists!",
        })
      );
      setDupTitle(true);
      setDupKey(true);
      return;
    } else if (titleExists) {
      // Title already exists
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: Title already exists!",
        })
      );
      setDupTitle(true);
      return;
    } else if (keyExists) {
      // Key already exists
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: Key already exists!",
        })
      );
      setDupKey(true);
      return;
    }

    try {
      await axiosClient.post("/admin/product", {
        title,
        key,
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
          message: "Success: Product added Successfully!",
        })
      );
      setImage("");
      setTitle("");
      setKey("");
      setDesc("");
      setPrice("");
      setFileName("");
      setSelectedCat({});
      setcatCopy([...categories]);
      setIsTopPick(false);
      dispatch(fetchCategories());
      dispatch(fetchProducts());
    } catch (error) {}
  };

  return (
    <div
      className="createprod"
      onClick={(e) => handleClickOutside(e)}
      ref={ref}
    >
      <div className={isSticky ? "sti" : "con"}>
        <div
          className="backButton"
          onClick={() => {
            if (
              image ||
              title ||
              key ||
              Object.keys(selectedCat).length > 0 ||
              desc ||
              price ||
              isTopPick
            ) {
              if (
                confirm(
                  "Are you sure you want to leave this page? All your modifications will be lost"
                )
              ) {
                setImage("");
                setTitle("");
                setKey("");
                setSelectedCat({});
                setDesc("");
                setPrice("");
                setIsTopPick(false);
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
            <h1 className="title">Create an entry</h1>
            <p className="entry"> API ID: product</p>
          </div>
          <div className="ctr-btn" onClick={saveProduct}>
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
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value.toUpperCase());
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
                value={key}
                onChange={(e) => {
                  setKey(e.target.value.toLowerCase());
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
                {Object.keys(selectedCat).length === 0
                  ? "category"
                  : "category (1)"}
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

              {Object.keys(selectedCat).length !== 0 && (
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
                    setBorderTopPick(true);
                  }}
                >
                  <p>FALSE</p>
                </div>
                <div
                  className={isTopPick ? "true" : "not-true"}
                  onClick={() => {
                    setIsTopPick(true);
                    setBorderTopPick(true);
                  }}
                >
                  <p>TRUE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <p className="grey">now</p>
            </div>
            <div className="by">
              <p className="white">By</p>
              <p className="grey">-</p>
            </div>
            <div className="updatedAt">
              <p className="white">Last update</p>
              <p className="grey">now</p>
            </div>
            <div className="by">
              <p className="white">By</p>
              <p className="grey">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
