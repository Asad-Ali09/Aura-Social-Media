const customError = require("../errors/customError");
const CommunityPage = require("../models/Community");
const User = require("../models/User");

// Create Community Controller
const createCommunity = async (req, res) => {
  // Assuming the user ID is provided in the request body

  const { name, profile, background_image, description } = req.body;
  const authorId = req.user._id;

  // Check if the author (user) exists
  const existingCommunity = await CommunityPage.findOne({ author: authorId });
  if (existingCommunity) {
    throw new customError(400, "Author already has a community");
  }

  // Create a new community page
  const community = new CommunityPage({
    name,
    profile,
    background_image,
    description,
    author: authorId,
  });

  // Save the community page to the database
  await community.save();

  // You can customize the response as needed
  res
    .status(201)
    .json({ message: "Community created successfully", community });
};

// Get Community Controller
const getCommunity = async (req, res) => {
  // Assuming the community ID is provided in the request parameters
  const communityId = req.params.id;

  // Find the community page and populate the 'author' field with user details
  const community = await CommunityPage.findById(communityId);

  if (!community) {
    return res.status(404).json({ error: "Community not found" });
  }

  // You can customize the response as needed
  res.status(200).json({ community });
};

const getAllCommunities = async (req, res) => {
  // Retrieve all community pages and populate the 'author' field with user details
  const communities = await CommunityPage.find();

  // You can customize the response as needed
  res.status(200).json({ communities });
};

// Find Community by Author ID Controller
const findCommunityByAuthorId = async (req, res) => {
  // Assuming the author ID is provided in the request parameters
  const authorId = req.user._id;

  // Find the community page associated with the specified author ID and populate the 'author' field with user details
  const community = await CommunityPage.findOne({ author: authorId });

  if (!community) {
    return res
      .status(404)
      .json({ error: "Community not found for the specified author" });
  }

  // You can customize the response as needed
  res.status(200).json({ community });
};

module.exports = {
  createCommunity,
  getCommunity,
  getAllCommunities,
  findCommunityByAuthorId,
};
