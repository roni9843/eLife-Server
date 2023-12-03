const { getAllUserAdminController } = require("../controller/admin");

const router = require("express").Router();

// * create a post
router.post("/getAllUser", getAllUserAdminController);

module.exports = router;
