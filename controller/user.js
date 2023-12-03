const User = require("../models/User");
const {
  findUsers,
  findUserByProperty,
  makePost,
  updateUser,
  findTeacherByProperty,
  findAllTeacherWithUser,
  changePass,
} = require("../service/users");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const error = require("../utils/error");

// ? for find all user
const findAllUserController = async (req, res, next) => {
  console.log("this is ");

  const users = await findUsers();

  return res.status(200).json({
    message: "successful",
    user: users,
  });
};

// ? for find only the one user
const findOneUserController = async (req, res, next) => {
  const user = await findUserByProperty("_id", req.body.id);

  console.log("this is one user ");

  if (!user) {
    return res.status(404).json({
      message: "not found",
    });
  }

  const payload = {
    _id: user._id,
    phone: user.phone,
  };

  // jwt token
  const token = jwt.sign(payload, "secret-key");

  return res.status(200).json({
    message: "successful",
    token,
    user,
  });
};

const findAllTeacherWithUserController = async (req, res, next) => {
  const users = await findAllTeacherWithUser();

  return res.status(200).json({
    message: "successful",
    user: users,
  });
};
const findOneTheTeacherInfoController = async (req, res, next) => {
  const teacherInfo = await findTeacherByProperty("user", req.query.id);

  if (!teacherInfo) {
    return res.status(404).json({
      message: "not found",
    });
  }

  return res.status(200).json({
    message: "successful",
    teacherInfo: teacherInfo,
  });
};

// ? for update only the one user
const updateOneUserController = async (req, res, next) => {
  const user = await updateUser(req.body.id, req.body);

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, "secret-key");

  return res.status(200).json({
    message: "successful",
    token: token,
    user: user,
  });
};

// ? for update only the one user
const ChangePassController = async (req, res, next) => {
  const { phone, oldPassword, newPassword } = req.body;

  try {
    // Find the user by phone number
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches the one in the database

    // ^ convert hash
    const isValidPass = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPass) {
      throw error("Please input valid password", 400);
    }

    // ^ convert user pass hash
    const BCNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the new password
    user.password = BCNewPassword;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ? for update only the one user
const GetAllBloodController = async (req, res, next) => {
  try {
    // Calculate the date 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const users = await User.find({
      wantToDonate: true,
      bloodGroup: { $ne: null },
      $or: [
        { lastDonateDate: { $lt: threeMonthsAgo.toISOString() } }, // Users who last donated more than 3 months ago
        { lastDonateDate: null }, // Users with lastDonateDate as null
      ],
    }).exec();

    console.log(users);

    return res.status(200).json({
      message: "successful",
      user: users,
    });
  } catch (err) {
    console.error(err);
    // Handle the error and send an appropriate response
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// ? for update only the one user
const searchByBloodController = async (req, res, next) => {
  try {
    const { searchText } = req.body;

    // Calculate the date 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Create a regex pattern to match the text in any part of the address properties
    const regexPattern = new RegExp(searchText || "", "i");

    const users = await User.find({
      wantToDonate: true,
      bloodGroup: { $ne: null },
      $or: [
        { lastDonateDate: { $lt: threeMonthsAgo.toISOString() } }, // Users who last donated more than 3 months ago
        { lastDonateDate: null }, // Users with lastDonateDate as null
      ],
      $or: [
        { village: { $regex: regexPattern } },
        { union: { $regex: regexPattern } },
        { thana: { $regex: regexPattern } },
        { district: { $regex: regexPattern } },
      ],
    }).exec();

    console.log(users);

    return res.status(200).json({
      message: "successful",
      user: users,
    });
  } catch (err) {
    console.error(err);
    // Handle the error and send an appropriate response
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  updateOneUserController,
  findAllUserController,
  findOneUserController,
  findOneTheTeacherInfoController,
  findAllTeacherWithUserController,
  ChangePassController,
  GetAllBloodController,
  searchByBloodController,
};
