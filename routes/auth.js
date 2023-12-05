const {
  registerController,
  loginController,
  otpController,
} = require("../controller/auth");

const router = require("express").Router();

// * register route
router.post("/register", registerController);

//* login route
router.post("/login", loginController);

//* login route
router.post("/otp", otpController);

module.exports = router;
