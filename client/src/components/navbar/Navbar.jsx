import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCart2 } from "react-icons/bs";
import "./Navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import Cart from "../cart/Cart";
import { IoPersonOutline } from "react-icons/io5";
import {
  OAUTH_ACCESS_TOKEN,
  OAUTH_ADMIN_TOKEN,
  removeItem,
} from "../../utils/localStorageManager";
import {
  deleteAdminProfile,
  deleteProfile,
} from "../../redux/slices/profileSlice";
import useClickOutside from "../useClickOutside";
import { axiosClient } from "../../utils/axiosClient";

function Navbar() {
  const [openCart, setOpenCart] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profileReducer.profile);
  const originalCategories = useSelector(
    (state) => state.categoryReducer.originalCategories
  );
  const cat = originalCategories.slice(0, 3);
  const cart = useSelector((state) => state.cartReducer.cart);
  let totalItems = 0;
  cart.forEach((item) => {
    totalItems += item.quantity;
  });
  const logOut = async () => {
    await axiosClient.post("/auth/logout", { profile });
    removeItem(OAUTH_ACCESS_TOKEN);
    if (profile.isAdmin) {
      dispatch(deleteAdminProfile());
      removeItem(OAUTH_ADMIN_TOKEN);
    }
    dispatch(deleteProfile());
    setIsClicked(false);
    navigate("/");
  };
  useClickOutside(ref, () => {
    setIsClicked(false);
  });

  return (
    <div ref={ref} className="Navbar">
      <div className="nav-container container">
        <div className="nav-left">
          {originalCategories?.length !== 0 && (
            <ul className="link-group">
              {cat?.map((category) => (
                <li className="hover-link" key={category._id}>
                  <Link className="link" to={`/category/${category._id}`}>
                    {category.title}
                  </Link>
                </li>
              ))}
              {originalCategories?.length >= 4 && (
                <li className="hover-link">
                  <Link className="link" to={`/category`}>
                    Other Categories
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="nav-center">
          <Link to="/">
            <h1 className="banner">Posterz.</h1>
          </Link>
        </div>
        <div className="nav-right">
          <div className="nav-cart" onClick={() => setOpenCart(!openCart)}>
            <BsCart2 className="icon" />
            {totalItems > 0 && (
              <span className="cart-count center">{totalItems}</span>
            )}
          </div>
          {Object.keys(profile)?.length > 0 ? (
            <div className="ava-log">
              <div
                className="avatar"
                onClick={() => setIsClicked(!isClicked)}
                data-email={profile.email}
              >
                <div className="avatar-cont">
                  <img
                    src={profile?.avatar?.url}
                    alt="avatar"
                    className="avatar-img"
                  />
                </div>
              </div>
              <div className="logOutContainer" onClick={logOut}>
                {isClicked && (
                  <div className="logOut">
                    <p>log Out</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="signin"
              onClick={() => {
                setIsClicked(false);
                navigate("/login");
              }}
            >
              <IoPersonOutline className="icon1" />
            </div>
          )}
        </div>
      </div>
      {openCart && <Cart onClose={() => setOpenCart(false)} />}
    </div>
  );
}

export default Navbar;
