import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsCart2 } from "react-icons/bs";
import "./Navbar.scss";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
function Navbar() {
  const [openCart, setOpenCart] = useState(false);
  const originalCategories = useSelector(
    (state) => state.categoryReducer.originalCategories
  );
  const cart = useSelector((state) => state.cartReducer.cart);
  let totalItems = 0;
  cart.forEach((item) => {
    totalItems += item.quantity;
  });
  return (
    <div>
      <div className="Navbar">
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
          </div>
        </div>
      </div>
      {openCart && <Cart onClose={() => setOpenCart(false)} />}
    </div>
  );
}

export default Navbar;
