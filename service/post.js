const { default: mongoose } = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

const makePost = async (postBy, status) => {
  const postCreate = new Post({
    postBy,
    status,
  });

  postCreate.save();

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
  const uPost = await Post.updateOne({ _id: postId }, { status: status });

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

  return allPosts;
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

  return allPosts;
};

module.exports = {
  makePost,
  updatePost,
  deletePost,
  getAllPost,
};
