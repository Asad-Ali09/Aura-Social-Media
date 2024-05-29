// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  // For posts with photos, you can include an array of photo objects
  photos: [
    {
      url: {
        type: String,
        required: true,
      },
      caption: {
        type: String,
      },
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  comments: [
    {
      text: String,
      author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        profilePicture: String,
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
