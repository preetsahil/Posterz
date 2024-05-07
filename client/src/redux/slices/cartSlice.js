import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const curItem = {
        title: product.title,
        key: product.key,
        price: product.price,
        image: product.image.url,
        category: product.categories.key,
      };
      const index = state.cart.findIndex((item) => item.key === curItem.key);
      if (index === -1) {
        state.cart.push({ ...curItem, quantity: 1 });
      } else {
        state.cart[index].quantity += 1;
      }
    },
    removeFromCart: (state, action) => {
      const key = action.payload.key;
      const index = state.cart.findIndex((item) => item.key === key);
      if (index === -1) return;
      if (state.cart[index].quantity === 1) {
        state.cart = state.cart.filter((item) => item.key !== key);
      } else {
        state.cart[index].quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    resetCartItem: (state, action) => {
      const key = action.payload.key;
      state.cart = state.cart.filter((item) => item.key !== key);
    },
  },
});

export default cartSlice.reducer;
export const { addToCart, removeFromCart, clearCart, resetCartItem } =
  cartSlice.actions;
