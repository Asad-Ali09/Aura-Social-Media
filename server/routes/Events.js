const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { getAllEvents, addEvent } = require("../controllers/Events");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getAllEvents)
  .post(authMiddleware, addEvent);

module.exports = router;
