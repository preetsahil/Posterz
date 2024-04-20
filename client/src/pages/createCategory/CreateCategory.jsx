import React, { useState, useEffect } from "react";
import { FaArrowLeftLong, FaLeftLong } from "react-icons/fa6";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import "./CreateCategory.scss";
import { TbGridDots } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
import { fetchCategories } from "../../redux/slices/categorySlice";

function CreateCategory() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const [key, setKey] = useState("");
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

  useEffect(() => {
    if (selectedProd.length === 0) {
      setProductsCopy([...products]);
    } else {
      const copy = products.filter(
        (product) => !selectedProd.includes(product)
      );
      setProductsCopy([...copy]);
    }
  }, [products]);

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
    if (showProd && !event.target.closest(".for-select")) {
      setShowProd(false);
      setBorder(true);
    }
  };

  const saveCategory = async () => {
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

    const titleExists = categories.some(
      (category) => category.title.toLowerCase() === title.toLowerCase()
    );
    const keyExists = categories.some(
      (category) => category.key.toLowerCase() === key.toLowerCase()
    );

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
      await axiosClient.post("/admin/category", {
        title: title.toUpperCase(),
        key: key.toLowerCase(),
        image,
        selectedProd,
      });
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Success: Category added Successfully!",
        })
      );
      setImage("");
      setTitle("");
      setKey("");
      setFileName("");
      setSelectedProd([]);
      dispatch(fetchCategories());
    } catch (error) {}
  };

  return (
    <div className="createcat">
      <div className="content" onClick={(e) => handleClickOutside(e)}>
        <div
          className="backButton"
          onClick={() => {
            if (image || title || key || selectedProd.length > 0) {
              alert(
                "Are you sure you want to leave this page? All your modifications will be lost"
              );
            }
            setImage("");
            setTitle("");
            setKey("");
            setSelectedProd([]);
            navigate("/admin/category");
          }}
        >
          <FaArrowLeftLong className="icon" />
          Back
        </div>
        <div className="banner">
          <div className="heading">
            <h1 className="title">Create an entry</h1>
            <p className="entry"> API ID: category</p>
          </div>
          <div className="ctr-btn" onClick={saveCategory}>
            <p>Save</p>
          </div>
        </div>
        <div className="input-div">
          <div className="cont1">
            <div className="col">
              <label htmlFor="title">
                title<span>*</span>
              </label>
              <input
                type="text"
                id="title"
                className={reqTitle ? "input-req" : "input-cont1"}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
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
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
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
                        key={product.id}
                        onClick={() => {
                          setBorder(!border);
                          setShowProd(!showProd);
                          setSelectedProd([...selectedProd, product]);
                          setProductsCopy(
                            productsCopy.filter((p) => p.id !== product.id)
                          );
                        }}
                        className="product-item"
                      >
                        <span>
                          <GoDotFill />
                        </span>
                        <p>{product.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedProd.length !== 0 && (
                <div className="selected-prod">
                  {selectedProd.map((product) => (
                    <div key={product.id} className="sel-prod">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginLeft: "5px",
                        }}
                      >
                        <TbGridDots className="dots" />
                        <p>{product.title}</p>
                      </div>

                      <RxCross2
                        className="cross"
                        onClick={() => {
                          setSelectedProd(
                            selectedProd.filter(
                              (prod) => prod.id !== product.id
                            )
                          );
                          setProductsCopy([...productsCopy, product]);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCategory;
