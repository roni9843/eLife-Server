const mongoose = require("mongoose");

const tuitionBatchSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming teacherId is a reference to another model
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
  },
  {
    timestamps: true, // Enable timestamps
  }
);

const TuitionBatch = mongoose.model("TuitionBatch", tuitionBatchSchema);

module.exports = TuitionBatch;
