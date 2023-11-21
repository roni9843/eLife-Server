const mongoose = require("mongoose");
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
    ]);

    // tuitionBatches will contain an array of documents with teacher information included
    console.log(tuitionBatches);

    return res.status(201).json({
      state: "successful 22",
      tuitionBatches,
    });
  } catch (error) {
    console.error(error);
  }
};

// For create a batch
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
    village,
    union,
    thana,
    district,
    customDetailsAddress,
    category,
    batchClass,
    subject,
  } = req.body;

  if (!teacherId || !batchTitle || !feeType) {
    return res.status(400).json({
      message: "Invalid data",
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
      village,
      union,
      thana,
      district,
      customDetailsAddress,
      category,
      batchClass,
      subject,
    });

    const saveBatch = await batch.save();

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

// For update a batch
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
    village,
    union,
    thana,
    district,
    customDetailsAddress,
    category,
    batchClass,
    subject,
    batchTitle,
  } = req.body;

  try {
    const saveBatch = await TuitionBatch.findByIdAndUpdate(batchId, {
      teacherId,
      bio,
      batchTime,
      totalSet,
      bookedSet,
      courseFee,
      feeType,
      village,
      union,
      thana,
      district,
      customDetailsAddress,
      category,
      batchClass,
      subject,
      batchTitle,
    });

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

const searchBatchController = (req, res, next) => {
  const { teacherId, address, batchClass, category, subject } = req.body;

  let query = {};

  if (teacherId) {
    query.teacherId = teacherId;
  }

  if (address) {
    query.$or = [
      { village: new RegExp(address, "i") },
      { union: new RegExp(address, "i") },
      { thana: new RegExp(address, "i") },
      { district: new RegExp(address, "i") },
      { customDetailsAddress: new RegExp(address, "i") },
    ];
  }

  if (batchClass && batchClass !== "All") {
    query.batchClass = batchClass;
  }

  if (category && category !== "All") {
    query.category = category;
  }

  if (subject && subject !== "All") {
    query.subject = subject;
  }

  TuitionBatch.find(query)
    .populate("teacherId")
    .then((result) => {
      // Fisher-Yates (Knuth) shuffle algorithm
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      // Shuffle the result array
      const shuffledResult = shuffleArray(result);

      res.send({
        message: "success 233",
        result: shuffledResult,
      });
    })
    .catch((error) => {
      console.error("Error searching tuition batches:", error);
      throw error;
    });
};

// ? for create  fee a batch
const createFeeController = async (req, res, next) => {
  try {
    const { batchId, studentId, paidAmount, amount } = req.body;

    console.log(batchId, studentId, paidAmount, amount);

    // Update paidAmount in batchDetailSchema
    const batchDetail = await BatchDetail.findOneAndUpdate(
      { batchId },
      { $inc: { paidAmount: paidAmount } }, // Increment paidAmount by the provided value
      { new: true } // Return the modified document
    );

    // Add a new entry in feeHistorySchema
    const feeHistoryEntry = new FeeHistory({
      batchId,
      studentId,
      amount,
    });

    await feeHistoryEntry.save();

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      updatedBatchDetail: batchDetail,
      newFeeHistoryEntry: feeHistoryEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
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

    startDate: req.body.startDate,
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
    const batchDetails = await BatchDetail.find({
      batchId: req.body.batchId,
    }).populate("batchId");

    return res.status(201).json({
      state: "successful",
      batchDetails,
    });
  } catch (error) {
    console.error("Error finding batch details:", error);
    throw error;
  }
};

const getOneTeacherAllBatchController = async (req, res, next) => {
  try {
    const result = await TuitionBatch.aggregate([
      {
        $match: {
          teacherId: new mongoose.Types.ObjectId(req.body.teacherId),
        },
      },
      {
        $lookup: {
          from: "batchdetails", // Collection name for BatchDetail model
          localField: "_id", // Field in TuitionBatch
          foreignField: "batchId", // Field in BatchDetail
          as: "batchdetails",
        },
      },
    ]);

    //  return result;

    return res.status(201).json({
      state: "successful",
      result,
    });
  } catch (error) {
    console.error("Error finding TuitionBatch with details:", error);
    throw error;
  }

  try {
    const batchDetails = await TuitionBatch.find({
      teacherId: req.body.teacherId,
    });

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
  getOneTeacherAllBatchController,
  searchBatchController,
};
