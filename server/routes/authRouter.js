const router=require("express").Router();
const authController=require("../controllers/authController")
router.post("/signup",authController.signUpController);
router.post("/login",authController.loginController)
router.post("/logout",authController.logoutController)




module.exports=router