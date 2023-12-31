const mongoose = require("mongoose");

const tuitionBatchSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    batchTitle: {
      type: String,

      required: true,
    },
    bio: String,
    batchTime: String,
    totalSet: {
      type: Number,
    },
    bookedSet: {
      type: Number,
    },
    courseFee: {
      type: Number,
    },
    category: String,
    batchClass: String,
    subject: String,
    feeType: {
      type: String,
      enum: ["monthly", "onetime"],
      required: true,
    },
    village: String, // Add village field
    union: String, // Add union field
    thana: String, // Add thana field
    district: String, // Add district field
    customDetailsAddress: String, // Add customDetailsAddress field
  },
  {
    timestamps: true,
  }
);

const TuitionBatch = mongoose.model("TuitionBatch", tuitionBatchSchema);

module.exports = TuitionBatch;
