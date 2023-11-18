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
    },
    name: {
      type: String,
    },
    startDate: {
      type: String,
    },
    gender: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
    },
    paidAmount: {
      type: Number,
      default: 0, // Set the default value to 0
    },
    // You can add more fields as needed for your batch detail entries
  },
  {
    timestamps: true, // Enable timestamps
  }
);

const BatchDetail = mongoose.model("BatchDetail", batchDetailSchema);

module.exports = BatchDetail;
