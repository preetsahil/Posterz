const router = require("express").Router();
const authController = require("../controllers/authController");
const isUser = require("../middlewares/isUser");
const reset = require("../middlewares/reset");
router.post("/revoke", (req, res) => {
  res.clearCookie("jwt_refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({});
});
router.post("/oauth2callback", authController.OAuthController);
router.post("/sendOtp", isUser, authController.sendOtpController);
router.post("/verifyOtp", isUser, authController.verifyOtpController);
router.post("/logout", authController.logoutController);
router.get("/refreshoauth", authController.refreshOAuthController);
router.get("/refreshjwt", authController.refreshJWTController);
router.post("/forget", authController.forgetPasswordController);
router.post("/reset", reset, authController.resetController);

module.exports = router;
