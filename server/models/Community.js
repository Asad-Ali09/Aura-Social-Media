const mongoose = require("mongoose");

const communityPageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  background_image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

const CommunityPage = mongoose.model("CommunityPage", communityPageSchema);

module.exports = CommunityPage;
