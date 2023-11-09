const {
  createBatchController,
  updateBatchController,
  createFeeController,
  getFeeController,
  createBatchDetailsController,
  deleteFeeController,
  getAllBatchController,
} = require("../controller/tuitionBatch");

const router = require("express").Router();

// * create a post
router.get("/getAllBatch", getAllBatchController);

// * create a post
router.post("/createBatch", createBatchController);

// * update a post
router.post("/updateBatch", updateBatchController);

// * create a post
router.post("/createBatchDetails", createBatchDetailsController);

// * get a post
router.get("/getFee", getFeeController);

// * update a post
router.post("/createFee", createFeeController);

// * update a post
router.post("/deleteFee", deleteFeeController);

module.exports = router;
