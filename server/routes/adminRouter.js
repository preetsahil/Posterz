const router = require("express").Router();
const isAdmin = require("../middlewares/isAdmin");
const adminController = require("../controllers/adminController");
const Order = require("../models/Order");
router.post("/", adminController.loginController);
router.post("/category", isAdmin, adminController.addCategoryController);
router.post("/product", isAdmin, adminController.addProductController);
router.delete(
  "/category/:id",
  isAdmin,
  adminController.deleteCategoryController
);
router.delete("/product/:id", isAdmin, adminController.deleteProductController);
router.put("/category", isAdmin, adminController.updateCategoryController);
router.put("/product", isAdmin, adminController.updateProductController);
router.get("/statistics", isAdmin, adminController.statsController);
router.put("/profile", isAdmin, adminController.userController);
router.get("/getOrders", isAdmin, async (req, res) => {
  const orders = await Order.find({});
  res.json({ orders });
});

module.exports = router;
