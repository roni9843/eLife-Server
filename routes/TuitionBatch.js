const {
  createBatchController,
  updateBatchController,
  createFeeController,
  getFeeController,
  createBatchDetailsController,
  deleteFeeController,
  getAllBatchController,
  getBatchDetailsController,
  getOneTeacherAllBatchController,
  searchBatchController,
  deleteBatchController,
  deleteBatchDetailController,
} = require("../controller/tuitionBatch");

const router = require("express").Router();

// * create a post
router.post("/getAllBatch", getAllBatchController);

// * create a post
router.post("/getOneTeacherAllBatch", getOneTeacherAllBatchController);

// * create a post
router.post("/createBatch", createBatchController);

// * update a post
router.post("/updateBatch", updateBatchController);

// * search
router.post("/searchBatch", searchBatchController);

// * create a post
router.post("/createBatchDetails", createBatchDetailsController);

// * create a post
router.post("/deleteBatch", deleteBatchController);

// * create a post
router.post("/deleteBatchDetails", deleteBatchDetailController);

// * create a post
router.post("/getBatchDetails", getBatchDetailsController);

// * get a post
router.get("/getFee", getFeeController);

// * update a post
router.post("/createFee", createFeeController);

// * update a post
router.post("/deleteFee", deleteFeeController);

module.exports = router;
