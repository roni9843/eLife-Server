const mongoose = require("mongoose");

const feeHistorySchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TuitionBatch", // Reference the TuitionBatch model
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model (assuming you have a User model)
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // You can add more fields as needed for your fee history entries
    // For example, you might want to add a "paymentDate" field or other relevant information.
  },
  {
    timestamps: true, // Enable timestamps
  }
);

const FeeHistory = mongoose.model("FeeHistory", feeHistorySchema);

module.exports = FeeHistory;
