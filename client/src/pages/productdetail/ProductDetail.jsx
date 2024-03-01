import React from "react";
import "./ProductDetail.scss"
import Naruto from "../../assets/naruto.jpeg";
function ProductDetail() {
  return (
    <div className="ProductDetail">
      <div className="container">
        <div className="product-layout">
          <div className="product-img">
            <img src={Naruto} alt="ProductDetail" />
          </div>
          <div className="product-info">
            <h1 className="heading">Naruto Slayer</h1>
            <h3 className="price">₹ 34</h3>
            <p className="description">this is my first product to sell</p>
            <div className="cart-options">
              <div className="quantity-selector">
                <span className="btn decrement">-</span>
                <span className="quantity">5</span>
                <span className="btn increment">+</span>
              </div>
              <button className="btn-primary add-to-cart">Add To Cart</button>
              <div className="category">
                <p> Category: Anime</p>
              </div>
            </div>
            <div className="return-policy">
              <ul className="data">
                <li>
                  This product is made to order and is typically printed in 3-6
                  working days. Your entire order will ship out together.
                </li>
                <li>
                  Since this product is printed on demand especially for you, it
                  is not eligible for cancellations and returns. Read our Return
                  Policy.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
