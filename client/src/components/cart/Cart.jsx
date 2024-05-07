import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import CartItem from "../cartitem/CartItem";
import { BsCartX } from "react-icons/bs";
import "./Cart.scss";

function Cart({ onClose }) {
  const cart = useSelector((state) => state.cartReducer.cart);
  let totalAmount = 0;
  cart.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });
  const isCartEmpty = cart.length === 0;

  async function handleCheckout() {
    // try {
    //   const response = await axiosClient.post("/orders", {
    //     products: cart,
    //   });

    //   const stripe = await loadStripe(
    //     `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
    //   );
    //   await stripe.redirectToCheckout({
    //     sessionId: response.data.stripeId,
    //   });

    // } catch (error) {
    //   console.log(error);
    // }
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
