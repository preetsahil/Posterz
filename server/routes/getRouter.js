const router = require("express").Router();
const getController = require("../controllers/getController");
const isUser = require("../middlewares/isUser");
const Order = require("../models/Order");
router.get("/products", getController.productController);
router.get("/categories", getController.categoryController);
router.post("/order", isUser, getController.orderController);
router.post("/payment", getController.paymentController);
router.get("/getKey", isUser, (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});
router.get("/getOrders", async (req, res) => {
  const order = await Order.find({});
  res.json({ order });
});

module.exports = router;
