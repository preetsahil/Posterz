const router = require("express").Router();
const authController = require("../controllers/authController");
router.post("/verify", authController.verifyController);

module.exports = router;
