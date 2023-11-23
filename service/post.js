const { default: mongoose } = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

const makePost = async (postBy, status) => {
  // Create and save the new post
  const postCreate = new Post({
    postBy,
    status,
  });
  await postCreate.save();

  // Retrieve all posts with aggregations
  const allPosts = await Post.aggregate([
    {
      $match: {
        _id: postCreate._id, // Match the newly created post
      },
    },
    {
      $lookup: {
        from: "postreactions",
        localField: "_id",
        foreignField: "postId",
        as: "reactions",
      },
    },
    {
      $unwind: {
        path: "$reactions",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "postBy",
        foreignField: "_id",
        as: "postUser",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reactions.reactId",
        foreignField: "_id",
        as: "reactions.user",
      },
    },
    {
      $group: {
        _id: "$_id",
        status: { $first: "$status" },
        userInfo: { $push: "$postUser" },
        createdAt: { $first: "$createdAt" },
        reactions: { $push: "$reactions" },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return allPosts;
};

// ? get all status post
const getAllPost = async () => {
  // return await Post.find().populate("userId");
  // return await Post.find().populate("user");
  console.log("3");
  const allPosts = await Post.aggregate([
    {
      // ? find reaction
      $lookup: {
        from: "postreactions", // The name of the "Reaction" collection
        localField: "_id",
        foreignField: "postId",
        as: "reactions",
      },
    },
    {
      $unwind: {
        path: "$reactions",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      // ? find postUser
      $lookup: {
        from: "users", // The name of the "User" collection
        localField: "postBy",
        foreignField: "_id",
        as: "postUser",
      },
    },

    {
      // ? find user react
      $lookup: {
        from: "users", // The name of the "User" collection
        localField: "reactions.reactId",
        foreignField: "_id",
        as: "reactions.user",
      },
    },
    {
      $group: {
        _id: "$_id",
        status: { $first: "$status" },
        userInfo: { $push: "$postUser" },
        createdAt: {
          $first: "$createdAt",
        },
        reactions: { $push: "$reactions" },
      },
    },
    {
      $sort: {
        createdAt: -1, // Sort by createdAt field in descending order (most recent first)
      },
    },
  ]);

  return allPosts;
};

const updatePost = async (postId, status) => {
  // Update the post
  const uPost = await Post.findByIdAndUpdate(postId, { status }, { new: true });

  // Aggregate to get the updated post with join data
  const updatedPost = await Post.aggregate([
    {
      $match: {
        _id: uPost._id, // Match the updated post
      },
    },
    {
      $lookup: {
        from: "postreactions",
        localField: "_id",
        foreignField: "postId",
        as: "reactions",
      },
    },
    {
      $unwind: {
        path: "$reactions",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "postBy",
        foreignField: "_id",
        as: "postUser",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reactions.reactId",
        foreignField: "_id",
        as: "reactions.user",
      },
    },
    {
      $group: {
        _id: "$_id",
        status: { $first: "$status" },
        userInfo: { $push: "$postUser" },
        createdAt: { $first: "$createdAt" },
        reactions: { $push: "$reactions" },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return updatedPost;
};

const deletePost = async (postId) => {
  const uPost = await Post.deleteOne({ _id: postId });

  const allPosts = await Post.aggregate([
    {
      $lookup: {
        from: "postreactions",
        localField: "_id",
        foreignField: "postId",
        as: "reactions",
      },
    },
    {
      $unwind: {
        path: "$reactions",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "postBy",
        foreignField: "_id",
        as: "postUser",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reactions.reactId",
        foreignField: "_id",
        as: "reactions.user",
      },
    },
    {
      $group: {
        _id: "$_id",
        status: { $first: "$status" },
        userInfo: { $push: "$postUser" },
        createdAt: {
          $first: "$createdAt",
        },
        reactions: { $push: "$reactions" },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return uPost;
};

module.exports = {
  makePost,
  updatePost,
  deletePost,
  getAllPost,
};
