import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsCart2 } from "react-icons/bs";
import "./Navbar.scss";
import { useSelector } from "react-redux";
function Navbar() {
  const [openCart, setOpenCart] = useState(false);
  const categories = useSelector((state) => state.categoryReducer.categories);
  return (
    <div className="Navbar">
      <div className="container nav-container">
        <div className="nav-left">
          <ul className="link-group">
            {categories?.map((category) => (
              <li className="hover-link" key={category.id}>
                {category.title}
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
            {/* {totalItems>0 &&  <span className="cart-count center">{totalItems}</span>} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
