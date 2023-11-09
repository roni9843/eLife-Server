const { model, Schema, default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      minlength: 8,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    wantToDonate: {
      type: Boolean,
      default: null,
    },
    lastDonateDate: {
      type: String,
      default: null,
    },
    numberOfDonate: {
      type: Number,
      default: 0,
    },
    village: String,
    union: String,
    thana: String,
    district: String,
    profilePic: String,
    aboutMe: String,
    markAs: {
      type: String,
      enum: ["Student", "Teacher", "Guest"],
      default: "Guest", // Default value set to "Guest"
    },
    verified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
