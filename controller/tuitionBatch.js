const BatchDetail = require("../models/BatchDetail");
const FeeHistory = require("../models/FeeHistory");
const TuitionBatch = require("../models/TuitionBatch");

// ? for new create a batch
const getAllBatchController = async (req, res, next) => {
  try {
    const tuitionBatches = await TuitionBatch.aggregate([
      {
        $lookup: {
          from: "users", // The name of the "user" collection
          localField: "teacherId",
          foreignField: "_id",
          as: "teacherInfo",
        },
      },
      {
        $unwind: "$teacherInfo", // If there's always a single teacher per batch
      },
    ]).exec();

    // tuitionBatches will contain an array of documents with teacher information included
    console.log(tuitionBatches);

    return res.status(201).json({
      state: "successful",
      tuitionBatches,
    });
  } catch (error) {
    console.error(error);
  }
};

// ? for new create a batch
const createBatchController = async (req, res, next) => {
  let {
    teacherId,
    batchTitle,
    bio,
    batchTime,
    totalSet,
    bookedSet,
    courseFee,
    feeType,
  } = req.body;

  if (!teacherId || !batchTitle || !feeType) {
    return res.status(400).json({
      message: "invalid data",
    });
  }

  try {
    const batch = await TuitionBatch({
      teacherId,
      batchTitle,
      bio,
      batchTime,
      totalSet,
      bookedSet,
      courseFee,
      feeType,
    });

    const saveBatch = await batch.save();

    return res.status(201).json({
      state: "successful",
      saveBatch,
    });
  } catch (e) {
    return res.status(500).json({
      state: "Please insert unique batchTitle",
    });
  }
};
// ? for update create a batch
const updateBatchController = async (req, res, next) => {
  let {
    batchId,
    teacherId,
    bio,
    batchTime,
    totalSet,
    bookedSet,
    courseFee,
    feeType,
  } = req.body;

  try {
    const saveBatch = await TuitionBatch.findByIdAndUpdate(
      batchId,
      { teacherId, bio, batchTime, totalSet, bookedSet, courseFee, feeType },
      { new: true }
    );

    return res.status(201).json({
      state: "successful",
      saveBatch,
    });
  } catch (e) {
    return res.status(500).json({
      state: "Please insert unique batchTitle",
      e,
    });
  }
};

// ? for create  fee a batch
const createFeeController = async (req, res, next) => {
  try {
    // Define the data for the new fee history document
    const newFeeHistoryData = {
      batchId: req.body.batchId, // Replace with the actual batch ID
      studentId: req.body.userId, // Replace with the actual student ID
      amount: req.body.amount, // Set the fee amount
      // You can set other fields as needed
    };

    // Create a new instance of the FeeHistory model with the data
    const newFeeHistory = new FeeHistory(newFeeHistoryData);

    // Save the new document to the database
    const savedFeeHistory = await newFeeHistory.save();

    return res.status(201).json({
      state: "successful",
      savedFeeHistory,
    });
  } catch (err) {
    console.error("Error creating fee history:", err);
    return res.status(500).json({
      state: "Please insert unique batchTitle",
      err,
    });
  }
};

// ? for create  fee a batch
const getFeeController = async (req, res, next) => {
  try {
    const batchId = req.query.batchId;

    // Use the `find` method to query fee history records with the specified batchId
    const feeHistoryRecords = await FeeHistory.find({
      batchId: batchId,
    }).exec();

    return res.status(201).json({
      state: "successful",
      feeHistoryRecords,
    });
  } catch (err) {
    console.error("Error retrieving fee history records:", err);
  }
};

// ? create batch details
const createBatchDetailsController = async (req, res, next) => {
  // Define the data for the new batch detail document
  const newBatchDetailData = {
    batchId: req.body.batchId, // Replace with the actual batch ID
    paidAmount: req.body.dueFee, // Set the due fee amount
    phone: req.body.phone,
    gender: req.body.gender,
    name: req.body.name,
  };

  // Create a new instance of the BatchDetail model with the data
  const newBatchDetail = new BatchDetail(newBatchDetailData);

  // Save the new document to the database
  try {
    const savedBatchDetail = await newBatchDetail.save();

    return res.status(201).json({
      state: "successful",
      savedBatchDetail,
    });
  } catch (err) {
    console.error("Error creating batch detail:", err);
  }
};

const getBatchDetailsController = async (req, res, next) => {
  try {
    const batchDetails = await BatchDetail.find({ batchId: req.body.batchId });

    return res.status(201).json({
      state: "successful",
      batchDetails,
    });
  } catch (error) {
    console.error("Error finding batch details:", error);
    throw error;
  }
};

// ? delete delete Fee Controller

const deleteFeeController = (req, res, next) => {};

module.exports = {
  createBatchController,
  updateBatchController,
  createFeeController,
  getFeeController,
  createBatchDetailsController,
  deleteFeeController,
  getAllBatchController,
  getBatchDetailsController,
};
