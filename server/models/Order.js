const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    order_status: String,
    item: [
      {
        title: String,
        price: Number,
        quantity: Number,
        key: String,
        category: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
