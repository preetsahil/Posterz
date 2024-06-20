const router = require("express").Router();
const isAdmin = require("../middlewares/isAdmin");
const adminController = require("../controllers/adminController");
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

module.exports = router;
