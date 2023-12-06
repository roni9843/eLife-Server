const User = require("../models/User");
const {
  loginService,
  registerService,
  otpService,
} = require("../service/auth");
const { findUserByProperty } = require("../service/users");
const error = require("../utils/error");

// ? for new user
const registerController = async (req, res, next) => {
  let { name, phone, password } = req.body;

  console.log("this is req : ", req.body);

  /**
   * TODO:
   * ^ validation user input -> name ,email and password -> if user input not valid return 400 error
   * ^ find this user by email form database -> if user exist -> return 400 error
   * ^  if not find user lets create new user from database
   *   FIXME:
   * ? password create hash
   */

  if (!name || !phone || !password) {
    return res.status(400).json({
      message: "invalid data",
    });
  }

  try {
    const user = await registerService({
      name,
      phone,
      password,
    });

    return res.status(201).json({
      user,
    });
  } catch (e) {
    next(e);
  }
};

// ? for login user
const loginController = async (req, res, next) => {
  let { phone, password } = req.body;

  // ^ valid user input
  if (!phone || !password) {
    return res.status(400).json({
      message: "Please input phone number and password",
    });
  }

  /**
   * TODO:
   * ^ find the this with his email
   * ^ if user not found -> return 400 error
   * ^ if user not ===  to user.hash -> return 400 error
   * ^ if user pass and user.hash equal -> generate token
   * ^ get token to the user
   * FIXME:
   * ?
   */

  try {
    const userInfo = await loginService({ phone, password });

    return res.status(200).json({
      message: "Login successful",
      userInfo,
    });
  } catch (e) {
    next(e);
  }
};

// ? for new user
const otpController = async (req, res, next) => {
  let { name, phone, password } = req.body;

  console.log("this is req : ", req.body);

  /**
   * TODO:
   * ^ validation user input -> name ,email and password -> if user input not valid return 400 error
   * ^ find this user by email form database -> if user exist -> return 400 error
   * ^  if not find user lets create new user from database
   *   FIXME:
   * ? password create hash
   */

  if (!name || !phone || !password) {
    return res.status(400).json({
      message: "invalid data",
    });
  }

  //  ^ find user
  let user = await findUserByProperty("phone", phone);

  // ^ if found this user
  if (user) {
    return res.status(400).json({ error: "user already exist" });
  }

  try {
    const recipientNumber = "880" + parseInt(phone);
    const senderId = "8809617611301";
    const bearerToken = "261|HIyhkh5cOvNbB2Rg16g0deJ47KpQGl3hx8P1w14m";
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const apiUrl = `https://app.smsnoc.com/api/v3/sms/send?recipient=${recipientNumber}&sender_id=${senderId}`;

    const messageBody = {
      message: `Welcome to our service! Your OTP is ${randomNumber}. Please enter this code to verify your eLife account.`,
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
      res.status(200).json({ message: randomNumber });
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
  registerController,
  loginController,
  otpController,
};
