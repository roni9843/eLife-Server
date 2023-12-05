const {
  getAllUserAdminController,
  createUserVerifyAdminController,
  deleteTheUserAdminController,
} = require("../controller/admin");

const router = require("express").Router();

// * create a post
router.post("/getAllUser", getAllUserAdminController);

// * create a post
router.post("/deleteTheUser", deleteTheUserAdminController);

// * create a post
router.post("/createVerify", createUserVerifyAdminController);

module.exports = router;
