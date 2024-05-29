const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "please provide a user id"],
  },
  token: {
    type: String,
    required: [true, "Please provide a token"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
