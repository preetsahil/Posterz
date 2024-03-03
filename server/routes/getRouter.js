const router=require("express").Router();
const getController=require("../controllers/getController")
router.get("/products",getController.productController)
router.get("/categories",getController.categoryController)


module.exports=router