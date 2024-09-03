const router = require("express").Router();
const getController = require("../controllers/getController");
const isUser = require("../middlewares/isUser");
router.get("/products", getController.productController);
router.get("/categories", getController.categoryController);
router.post("/order", isUser, getController.orderController);
router.post("/payment", getController.paymentController);
router.get("/getKey", isUser, (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});
router.post("/search", getController.searchController);

module.exports = router;
