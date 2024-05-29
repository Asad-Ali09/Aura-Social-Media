const express = require("express");
const {
  createPost,
  getPostById,
  updatePostById,
  deletePost,
  getAllPosts,
  likePost,
  unlikePost,
  createComment,
  getUserPosts,
  userPosts,
} = require("../controllers/Posts");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createPost)
  .get(authMiddleware, getAllPosts);

router
  .route("/:id")
  .get(authMiddleware, getPostById)
  .patch(authMiddleware, updatePostById)
  .delete(authMiddleware, deletePost);

router.route("/feed").post(authMiddleware, userPosts);

router.route("/like/:id").post(authMiddleware, likePost);
router.route("/unlike/:id").post(authMiddleware, unlikePost);

router.route("/comment/:postId").post(authMiddleware, createComment);

router.route("/userposts/:userID").get(authMiddleware, getUserPosts);

module.exports = router;
