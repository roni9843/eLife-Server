const mongoose = require("mongoose");
const Post = require("../models/Post");
const PostReaction = require("../models/PostReaction");
const {
  makePost,
  updatePost,
  deletePost,
  getAllPost,
} = require("../service/post");

// ? for create a post
const createPostController = async (req, res, next) => {
  const postBy = req.body.postBy;
  const status = req.body.status;

  const post = await makePost(postBy, status);

  return res.status(200).json({
    message: "successful",
    posts: post,
  });
};

// ? for get all post
const getAllPostController = async (req, res, next) => {
  const posts = await getAllPost();

  return res.status(200).json({
    message: "successful",
    posts,
  });
};

// ? for update a post
const updatePostController = async (req, res, next) => {
  const postId = req.body.id;
  const status = req.body.status;

  const post = await updatePost(postId, status);

  return res.status(200).json({
    message: "successful",
    post,
  });
};

// ? for delete a post
const deletePostController = async (req, res, next) => {
  const postId = req.body.id;

  const post = await deletePost(postId);

  return res.status(200).json({
    message: "successful delete",
    post,
  });
};

// ?  create a post reaction controller
const createPostReactionController = async (req, res, next) => {
  const reactionId = req.body.reactionId;
  const postId = req.body.postId;
  const reactId = req.body.reactId;

  const postCreate = await PostReaction({
    reactionId,
    postId,
    reactId,
  });

  const reactSave = await postCreate.save();

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

  // return allPosts;

  return res.status(200).json({
    message: "successful",
    posts: reactSave,
  });
};

// ?  delete a post reaction controller
const deletePostReactionController = async (req, res, next) => {
  const id = req.body.id;

  const deletedReaction = await PostReaction.findOneAndRemove({ _id: id });
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

  // return allPosts;

  return res.status(200).json({
    message: "successful",
    posts: allPosts,
  });
};

const getOneUserPostsController = async (req, res, next) => {
  const allPosts = await Post.aggregate([
    {
      $match: {
        postBy: new mongoose.Types.ObjectId(req.body.currentUserId), // Convert the ID to ObjectId type
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

  return res.status(200).json({
    message: "successful",
    posts: allPosts,
  });
};

const getTheReactionController = async (req, res, next) => {
  const postId = req.body.id;

  try {
    PostReaction.find({ postId: postId })
      .populate("reactId") // Populate the 'reactId' field with User information
      .then((reactions) => {
        // 'reactions' will contain an array of post reactions with populated user information
        console.log(reactions);
        return res.status(200).json({
          message: "successful",
          reactions,
        });
      })
      .catch((err) => {
        console.error(err);
        // Handle the error appropriately
        return res.status(200).json({
          message: "successful",
          reactions: [],
        });
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createPostController,
  updatePostController,
  deletePostController,
  getAllPostController,
  createPostReactionController,
  deletePostReactionController,
  getOneUserPostsController,
  getTheReactionController,
};
