const { default: mongoose } = require("mongoose");
const Message = require("../models/MessageModel");
const User = require("../models/User");

const getMessages = async (req, res) => {
  const { to } = req.body;
  const from = req.user._id;

  if (!from) {
    throw new customError(400, "Bad Request");
  }

  const toID = await User.findById(to);
  if (!toID) {
    throw new customError(404, "used does not exist");
  }

  const messages = await Message.find({
    users: {
      $all: [from, toID._id],
    },
  }).sort({ updatedAt: 1 });

  const projectedMessages = messages.map((msg) => {
    return {
      fromSelf: msg.sender.toString() === from.toString(),
      message: msg.message.text,
      createdAt: msg.createdAt,
    };
  });

  return res.status(200).json({ success: true, data: projectedMessages });
};

const addMessage = async (req, res) => {
  const { to, message } = req.body;
  const toID = await User.findById(to);
  if (!toID) {
    throw new customError(404, "used does not exist");
  }
  const from = req.user._id;

  const data = await Message.create({
    message: { text: message },
    users: [from, toID._id],
    sender: from,
  });

  if (!data) {
    throw new customError(500, "Error creating message");
  }
  return res
    .status(201)
    .json({ success: true, message: "message created successfully", data });
};

const getUsersWithChat = async (req, res) => {
  const currentUserId = req.user._id;
  // Find distinct users whom the current user has chatted with
  //   const usersWithChat = await Message.aggregate([
  //     {
  //       $match: {
  //         $or: [{ sender: currentUserId }, { users: currentUserId }],
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         users: { $addToSet: "$sender" },
  //       },
  //     },
  //   ]);

  //   // Extract the user IDs from the result
  //   const userIDs = usersWithChat.length > 0 ? usersWithChat[0].users : [];

  const usersWithChat = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: currentUserId }, { users: currentUserId }],
      },
    },
    {
      $project: {
        users: {
          $cond: {
            if: { $eq: ["$sender", currentUserId] },
            then: "$users",
            else: ["$sender"],
          },
        },
      },
    },
    {
      $unwind: "$users",
    },
    {
      $group: {
        _id: "$users",
      },
    },
    {
      $match: {
        _id: { $ne: currentUserId },
      },
    },
  ]);

  const userIDs = usersWithChat.map((user) => user._id);

  //   console.log(userIDs);
  // Fetch user details based on the extracted IDs
  const users = await User.aggregate([
    {
      $match: { _id: { $in: userIDs } },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        profilePicture: 1,
      },
    },
  ]);
  //   console.log(users);
  let chatUsers = users.filter((user) => !user._id.equals(currentUserId));

  res.status(200).json({ success: true, data: chatUsers });
};

module.exports = {
  getMessages,
  addMessage,
  getUsersWithChat,
};
