const {
  findAllUserController,
  findOneUserController,
  updateOneUserController,
  findOneTheTeacherInfoController,
  findAllTeacherWithUserController,
  ChangePassController,
  GetAllBloodController,
  searchByBloodController,
} = require("../controller/user");
const auth = require("../middleware/auth");

const router = require("express").Router();

// * find all user route
router.get("/findAlUser", findAllUserController);

// * find one user route
router.post("/findTheUser", findOneUserController);

// * find one user route
router.get("/findAllTeacherWithUser", findAllTeacherWithUserController);

// * find one user route
router.get("/findOneTheTeacherInfo", findOneTheTeacherInfoController);

// * update user route
router.post("/updateTheUser", updateOneUserController);

// * change password
router.post("/ChangePass", ChangePassController);

// * get blood
router.get("/GetAllBlood", GetAllBloodController);

// * get blood
router.post("/searchByBlood", searchByBloodController);

module.exports = router;
