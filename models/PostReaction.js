const mongoose = require("mongoose");

const postReactionSchema = new mongoose.Schema(
  {
    reactionId: {
      type: Number,
      enum: [1, 2], // Assuming reactionId can be either 1 or 2
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference the Post model
      required: true,
    },
    reactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model
      required: true,
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

const PostReaction = mongoose.model("PostReaction", postReactionSchema);

module.exports = PostReaction;
