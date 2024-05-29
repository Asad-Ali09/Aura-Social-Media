const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  addMessage,
  getMessages,
  getUsersWithChat,
} = require("../controllers/Message");
const router = express.Router();

router.route("/addmessage").post(authMiddleware, addMessage);
router.route("/getmessages").post(authMiddleware, getMessages);
router.route("/getchatusers").get(authMiddleware, getUsersWithChat);

module.exports = router;
