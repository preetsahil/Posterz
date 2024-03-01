import React from "react";
import "./Product.scss"
function Product({ image }) {
  return (
    <div className="Product">
      <div className="product-container">
        <div className="product-img">
          <div className="img-container">
            <img src={image} alt="product" id="img" />
          </div>
        </div>
        <div className="product-info">
          <p className="title">Naruto Slayer</p>
          <p className="price">₹ 50 </p>
        </div>
      </div>
    </div>
  );
}

export default Product;
