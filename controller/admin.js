const mongoose = require("mongoose");
const BatchDetail = require("../models/BatchDetail");
const FeeHistory = require("../models/FeeHistory");
const TuitionBatch = require("../models/TuitionBatch");
const User = require("../models/User");

const fetch = require("node-fetch");

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

module.exports = {
  createUserVerifyAdminController,
  getAllUserAdminController,
};
