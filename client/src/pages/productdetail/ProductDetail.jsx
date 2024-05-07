import React, { useEffect, useState } from "react";
import "./ProductDetail.scss";
import { useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { axiosClient } from "../../utils/axiosClient";
import { addToCart, removeFromCart } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
function ProductDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const cart = useSelector((state) => state.cartReducer.cart);
  const quantity =
    cart.find((item) => item.key === params.productId)?.quantity || 0;

  const fetchData = async () => {
    const productResponse = await axiosClient.get(
      `/api/products/?id=${params.productId}`
    );
    setProduct(productResponse.data.product[0]);
  };

  useEffect(() => {
    setProduct(null);
    fetchData();
  }, [params.productId]);

  if (!product) {
    return <Loader />;
  }

  return (
    <div className="ProductDetail">
      <div className="container">
        <div className="product-layout">
          <div className="product-img">
            <img src={product?.image?.url} alt={product?.title} />
          </div>
          <div className="product-info">
            <h1 className="heading">{product?.title}</h1>
            <h3 className="price">₹ {product?.price}</h3>
            <p className="description">{product?.desc}</p>
            <div className="cart-options">
              <div className="quantity-selector">
                <span
                  className="btn decrement"
                  onClick={() => dispatch(removeFromCart(product))}
                >
                  -
                </span>
                <span className="quantity">{quantity}</span>
                <span
                  className="btn increment"
                  onClick={() => dispatch(addToCart(product))}
                >
                  +
                </span>
              </div>
              <button
                className="btn-primary add-to-cart"
                onClick={() => {
                  dispatch(addToCart(product));
                }}
              >
                Add to Cart
              </button>
              <div className="category">
                <p>Category : {product?.categories?.title.toLowerCase()} </p>
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
