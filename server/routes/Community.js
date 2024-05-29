const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  getAllCommunities,
  createCommunity,
  getCommunity,
  findCommunityByAuthorId,
} = require("../controllers/Community");
const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getAllCommunities)
  .post(authMiddleware, createCommunity);
router.route("/:id").get(authMiddleware, getCommunity);
router.route("/mycommunity").get(authMiddleware, findCommunityByAuthorId);

module.exports = router;
