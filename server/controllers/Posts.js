const customError = require("../errors/customError");
const Post = require("../models/PostModel");
const User = require("../models/User");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({ author: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json(posts);
};

const getUserPosts = async (req, res) => {
  const { userID } = req.params;

  const posts = await Post.find({ author: userID }).sort({
    createdAt: -1,
  });
  res.status(200).json(posts);
};

const userPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  return res.status(200).json(posts);
};

const createPost = async (req, res) => {
  const { content, photos } = req.body;

  if (!photos && !content) {
    throw new customError(400, "Please provide content for post");
  }

  if (!content && (!Array.isArray(photos) || photos.length === 0)) {
    throw new customError(400, "Please provide photos for post");
  }

  const author = req.user._id;

  const newPost = new Post({
    content,
    photos,
    author,
  });

  await newPost.save();

  res
    .status(201)
    .json({ message: "Post created successfully.", post: newPost });
};

const getPostById = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);

  if (!post) {
    throw new customError(404, "Post not found");
  }
  res.status(200).json(post);
};

// Update a post by ID
const updatePostById = async (req, res) => {
  const postId = req.params.id;
  const { content, photo } = req.body;

  const post = await Post.findById(postId);

  if (!post || post.author.toString() !== req.user._id.toString()) {
    throw new customError(404, "Post not found");
  }

  if (!content && !photo) {
    throw new customError(400, "Please provide content for post");
  }

  post.content = content || post.content;
  if (photo) {
    if (!post.photos) {
      post.photos = [photo];
    } else {
      post.photos.push({ url: photo });
    }
  }

  const updatedPost = await post.save();

  if (!updatedPost) {
    throw new customError(404, "Invalid Content");
  }
  res.status(200).json(updatedPost);
};

const deletePost = async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (!post || post.author.toString() !== req.user._id.toString()) {
    throw new customError(404, "Post not found");
  }
  await post.deleteOne();
  res.status(200).json({ message: "Post deleted successfully" });
};

const likePost = async (req, res) => {
  const userID = req.user._id;
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new customError(404, "Post not found");
  }

  post.likes?.forEach((like) => {
    if (like.toString() === userID.toString()) {
      throw new customError(400, "Already Liked");
    }
  });

  post.likes?.push(userID);
  await post.save();
  res.status(200).json({ message: "Post Liked Successfully" });
};

const unlikePost = async (req, res) => {
  const userID = req.user._id;
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new customError(404, "Post not found");
  }

  post.likes = post.likes?.filter((el) => el.toString() !== userID.toString());

  await post.save();
  res.status(200).json({ message: "Unliked Successfully" });
};

const createComment = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!postId || !text) {
    throw new customError(400, "Bad request");
  }

  const author = {
    id: req.user._id,
    profilePicture: req.user.profilePicture,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
  };

  const post = await Post.findById(postId);

  if (!post) {
    throw new customError(404, "Post not found");
  }
  // Add the comment to the post
  post.comments.push({
    text,
    author,
  });

  // Save the updated post
  await post.save();

  return res.status(201).json({ success: true, data: post.comments });
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePostById,
  deletePost,
  likePost,
  unlikePost,
  createComment,
  getUserPosts,
  userPosts,
};
