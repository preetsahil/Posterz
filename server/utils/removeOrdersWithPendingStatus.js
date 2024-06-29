const Order = require("../models/Order");

const removeOrdersWithPendingStatus = async () => {
  await Order.deleteMany({ order_status: "pending" });
};
module.exports = removeOrdersWithPendingStatus;
