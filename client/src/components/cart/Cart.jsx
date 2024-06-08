import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import CartItem from "../cartitem/CartItem";
import { BsCartX } from "react-icons/bs";
import "./Cart.scss";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, getItem } from "../../utils/localStorageManager";
import { useNavigate } from "react-router-dom";

function Cart({ onClose }) {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cartReducer.cart);
  let totalAmount = 0;
  cart.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });
  const isCartEmpty = cart.length === 0;

  async function handleCheckout() {
    try {
      const token = getItem(KEY_ACCESS_TOKEN);
      if (!token) {
        navigate("/login");
        onClose();
        return;
      }

      const {
        data: { key },
      } = await axiosClient.get("/api/getKey");

      const {
        data: { order },
      } = await axiosClient.post("/api/order", {
        amount: totalAmount,
        products: cart,
      });
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Posterz",
        description: "Test Transaction",
        image:
          "https://assets.super.so/e7c0f16c-8bd3-4c76-8075-4c86f986e1b2/uploads/favicon/9c68ae10-0a8a-4e3f-9084-3625b19df9cb.png",
        order_id: order.id,
        callback_url: "http://localhost:4000/api/payment",
        //logged in user
        prefill: {
          name: "test",
          email: "test@example.com",
          contact: "9000090000",
        },
        notes: {
          //you can put the address of the person give option to add new address,
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#0c2855",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Cart">
      <div className="overlay" onClick={onClose}></div>
      <div className="cart-content">
        <div className="header">
          <h3>Shopping Cart</h3>
          <div className="close-btn" onClick={onClose}>
            <AiOutlineClose /> Close
          </div>
        </div>
        <div className="cart-items">
          {cart.map((cart) => (
            <CartItem key={cart.key} cart={cart} />
          ))}
        </div>
        {isCartEmpty && (
          <div className="empty-cart-info">
            <div className="icon">
              <BsCartX />
            </div>
            <h4>Cart is Empty</h4>
          </div>
        )}
        {!isCartEmpty && (
          <div className="checkout-info">
            <div className="total-amount">
              <h3 className="total-message">Total:</h3>
              <h3 className="total-value">₹ {totalAmount}</h3>
            </div>
            <div className="checkout btn-primary" onClick={handleCheckout}>
              Checkout now
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
