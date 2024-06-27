const router = require("express").Router();
const authController = require("../controllers/authController");
const isUser = require("../middlewares/isUser");
router.post("/revoke", (req, res) => {
  res.clearCookie("jwt_refresh_token", {
    httpOnly: true,
    secure: true,
  });
  res.json({});
});
router.post("/oauth2callback", authController.OAuthController);
router.post("/sendOtp", isUser, authController.sendOtpController);
router.post("/verifyOtp", isUser, authController.verifyOtpController);
router.post("/logout", authController.logoutController);
router.get("/refreshoauth", authController.refreshOAuthController);
router.get("/refreshjwt", authController.refreshJWTController);

module.exports = router;
