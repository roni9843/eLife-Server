const { registerController, loginController } = require("../controller/auth");

const router = require("express").Router();

// * register route
router.post("/register", registerController);

//* login route
router.post("/login", loginController);

module.exports = router;
