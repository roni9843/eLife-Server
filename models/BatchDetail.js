const mongoose = require("mongoose");

const batchDetailSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TuitionBatch", // Reference the TuitionBatch model
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    dueFee: {
      type: Number,
      required: true,
    },
    enrollDate: {
      type: String,
      required: true,
    },
    // You can add more fields as needed for your batch detail entries
  },
  {
    timestamps: true, // Enable timestamps
  }
);

const BatchDetail = mongoose.model("BatchDetail", batchDetailSchema);

module.exports = BatchDetail;
