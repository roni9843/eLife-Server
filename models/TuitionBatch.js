const mongoose = require("mongoose");

const tuitionBatchSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    batchTitle: {
      type: String,
      unique: true,
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
