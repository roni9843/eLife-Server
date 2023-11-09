const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByProperty, createNewUser } = require("./users");
const error = require("../utils/error");

const registerService = async ({ phone, name, password }) => {
  //  ^ find user
  let user = await findUserByProperty("phone", phone);

  // ^ if found this user
  if (user) {
    throw error("user already exist", 400);
  }

  // ^ convert user pass hash
  password = await bcrypt.hash(password, 10);

  const saveData = await createNewUser({
    name,
    password,
    phone,
  });

  const payload = {
    id: saveData._id,
  };

  const token = jwt.sign(payload, "secret-key");

  return {
    token,
    info: saveData,
  };
};

const loginService = async ({ phone, password }) => {
  // ^ find user with his phone
  let user = await findUserByProperty("phone", phone);

  // ^ if user not found
  if (!user) {
    throw error("This phone number not found", 400);
  }

  // ^ convert hash
  const isValidPass = await bcrypt.compare(password, user.password);

  if (!isValidPass) {
    throw error("Please input valid password", 400);
  }

  const payload = {
    _id: user._id,
    phone: user.phone,
  };

  // jwt token
  const token = jwt.sign(payload, "secret-key");

  return {
    token,
    user,
  };
};

module.exports = {
  loginService,
  registerService,
};
