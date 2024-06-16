const router = require("express").Router();
const authController = require("../controllers/authController");
const isUser = require("../middlewares/isUser");
router.post("/verify", authController.verifyController);
router.post("/sendOtp", isUser, authController.sendOtpController);
router.post("/verifyOtp", isUser, authController.verifyOtpController);

module.exports = router;
