const {
  getAllUserAdminController,
  createUserVerifyAdminController,
} = require("../controller/admin");

const router = require("express").Router();

// * create a post
router.post("/getAllUser", getAllUserAdminController);

// * create a post
router.post("/createVerify", createUserVerifyAdminController);

module.exports = router;
