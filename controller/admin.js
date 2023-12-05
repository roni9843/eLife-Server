const mongoose = require("mongoose");
const BatchDetail = require("../models/BatchDetail");
const FeeHistory = require("../models/FeeHistory");
const TuitionBatch = require("../models/TuitionBatch");
const User = require("../models/User");

const fetch = require("node-fetch");
const PostReaction = require("../models/PostReaction");
const Post = require("../models/Post");

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

const createUserVerifyAdminController = async (req, res, next) => {
  try {
    const recipientNumber = "880" + parseInt(req.body.recipient);
    const senderId = "8809617611301";
    const bearerToken = "261|HIyhkh5cOvNbB2Rg16g0deJ47KpQGl3hx8P1w14m";

    // Find the user by phone number and update the 'verified' field to true
    const user = await User.findOneAndUpdate(
      { phone: "0" + parseInt(req.body.recipient) },
      { $set: { verified: req.body.verify } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.body.verify === false) {
      return res
        .status(200)
        .json({ message: "Successfully remove verify", user });
    }

    const apiUrl = `https://app.smsnoc.com/api/v3/sms/send?recipient=${recipientNumber}&sender_id=${senderId}`;

    const messageBody = {
      message: req.body.message,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(messageBody),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("SMS sent successfully:", responseData);
      res.status(200).json({ message: "SMS sent successfully", user });
    } else {
      const errorData = await response.json();
      console.error("Failed to send SMS:", errorData);
      res.status(response.status).json({ error: "Failed to send SMS" });
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTheUserAdminController = async (req, res, next) => {
  const userId = req.body.id;

  console.log(userId);

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not found, return an error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      // Remove user-related documents
      const batchDetailDeleteResult = await BatchDetail.deleteMany({
        studentId: userId,
      });
      const feeHistoryDeleteResult = await FeeHistory.deleteMany({
        studentId: userId,
      });
      const postReactionDeleteResult = await PostReaction.deleteMany({
        reactId: userId,
      });
      const tuitionBatchDeleteResult = await TuitionBatch.deleteMany({
        teacherId: userId,
      });

      // Delete posts associated with the user
      const postDeleteResult = await Post.deleteMany({
        postBy: userId,
      });

      console.log("BatchDetail Delete Result:", batchDetailDeleteResult);
      console.log("FeeHistory Delete Result:", feeHistoryDeleteResult);
      console.log("PostReaction Delete Result:", postReactionDeleteResult);
      console.log("TuitionBatch Delete Result:", tuitionBatchDeleteResult);
      console.log("Post Delete Result:", postDeleteResult);

      // Remove the user
      await user.deleteOne(); // Use deleteOne or deleteMany as needed

      // Return success response
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      // Log the error for debugging
      console.error("Error in deleteTheUserAdminController:", error);

      // Return error response
      return res.status(500).json({ message: "Internal server error 1" });
    }
  } catch (error) {
    // Log the error for debugging
    console.error("Error finding user:", error);

    // If an error occurs, return an error response
    return res.status(500).json({ message: "Internal server error 2" });
  }
};

module.exports = {
  createUserVerifyAdminController,
  getAllUserAdminController,
  deleteTheUserAdminController,
};
