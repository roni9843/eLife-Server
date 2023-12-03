const mongoose = require("mongoose");
const BatchDetail = require("../models/BatchDetail");
const FeeHistory = require("../models/FeeHistory");
const TuitionBatch = require("../models/TuitionBatch");
const User = require("../models/User");

const getAllUserAdminController = async (req, res, next) => {
  try {
    const { query } = req.body; // Assuming you are passing the query parameter in the URL

    // You can adjust the query condition based on your needs
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive name search
        { phone: { $regex: query, $options: "i" } }, // Case-insensitive phone number search
      ],
    });

    return res.status(200).json({
      state: "successful",
      users: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      state: "error",
      message: "Internal Server Error",
    });
  }
};

const deleteFeeController = (req, res, next) => {};

module.exports = {
  deleteFeeController,
  getAllUserAdminController,
};
