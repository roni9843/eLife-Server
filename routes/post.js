const {
  createPostController,
  updatePostController,
  deletePostController,
  getAllPostController,
  createPostReactionController,
  deletePostReactionController,
  getOneUserPostsController,
  getTheReactionController,
  getAllPostWithPaginationController,
} = require("../controller/post");

const router = require("express").Router();

// * create a post
router.post("/createPost", createPostController);

// * get a post
router.get("/getAllPost", getAllPostController);

// * get a post
router.post("/getAllPostWithPagination", getAllPostWithPaginationController);

// * get a post
router.post("/getOneUserPosts", getOneUserPostsController);

// * update a post
router.patch("/updatePost", updatePostController);

// * delete a post
router.post("/deletePost", deletePostController);

// * create post reaction
router.post("/getTheReaction", getTheReactionController);

// * create post reaction
router.post("/createReaction", createPostReactionController);

// * create post reaction
router.post("/deleteReaction", deletePostReactionController);

module.exports = router;
