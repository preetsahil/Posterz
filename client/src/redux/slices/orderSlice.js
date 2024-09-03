import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orderSlice",
  initialState: {
    orders: [],
    originalOrdersDetail: [],
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.originalOrdersDetail = action.payload;
    },
    searchOrder: (state, action) => {
      const searchQuery = action.payload;
      state.orders = state.orders.filter(
        (data) => data.orderId === searchQuery
      );
    },
    originalOrders: (state, action) => {
      state.orders = state.originalOrdersDetail;
    },
    
  },
});

export default orderSlice.reducer;
export const { setOrders, searchOrder, originalOrders } = orderSlice.actions;
