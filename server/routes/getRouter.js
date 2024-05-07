const router = require("express").Router();
const getController = require("../controllers/getController");
const Order = require("../models/Order");
router.get("/products", getController.productController);
router.get("/categories", getController.categoryController);
router.post("/order", getController.orderController);
router.post("/payment", getController.paymentController);
router.get("/getKey", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});
router.get("/getOrders", async (req, res) => {
  const order = await Order.find({});
  res.json({ order });
});

module.exports = router;
