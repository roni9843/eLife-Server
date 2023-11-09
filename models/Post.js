const { model, Schema } = require("mongoose");

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    postBy: {
      type: mongoose.Schema.Types.ObjectId, // Assuming you store the User ID as a reference
      ref: "User", // Reference the User model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
