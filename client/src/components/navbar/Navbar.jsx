import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCart2 } from "react-icons/bs";
import "./Navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import Cart from "../cart/Cart";
import { IoPersonOutline } from "react-icons/io5";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { deleteProfile } from "../../redux/slices/cartSlice";
import useClickOutside from "../useClickOutside";

function Navbar() {
  const [openCart, setOpenCart] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.cartReducer.profile);
  const originalCategories = useSelector(
    (state) => state.categoryReducer.originalCategories
  );
  const cart = useSelector((state) => state.cartReducer.cart);
  let totalItems = 0;
  cart.forEach((item) => {
    totalItems += item.quantity;
  });
  const logOut = () => {
    removeItem(KEY_ACCESS_TOKEN);
    dispatch(deleteProfile());
    setIsClicked(false);
    navigate("/");
  };
  useClickOutside(ref, () => {
    setIsClicked(false);
  });
  return (
    <div>
      <div className="Navbar" ref={ref}>
        <div className="container nav-container">
          <div className="nav-left">
            <ul className="link-group">
              {originalCategories?.map((category) => (
                <li className="hover-link" key={category._id}>
                  <Link className="link" to={`/category/${category._id}`}>
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
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
      </div>
      {openCart && <Cart onClose={() => setOpenCart(false)} />}
    </div>
  );
}

export default Navbar;
