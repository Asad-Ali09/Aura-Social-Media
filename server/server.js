require("express-async-errors");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const socket = require("socket.io");

const app = express();

// Middleswares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
//////

app.get("/", (req, res) => {
  return res.send("Hello, world!");
});

app.use("/api/v1/users", require("./routes/User"));
app.use("/api/v1/posts", require("./routes/Posts"));
app.use("/api/v1/chats", require("./routes/Message"));
app.use("/api/v1/community", require("./routes/Community"));
app.use("api/v1/events", require("./routes/Events"));

// Error handling
app.use(errorHandler);
// Not Found
app.use(notFound);
// let server;
// Connect to DB and Listening Server
const PORT = process.env.PORT || 5500;
const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const server = app.listen(
    PORT,
    console.log(`listening on http://localhost:${PORT}`)
  );
  const io = socket(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  global.onlineUsers = new Map();

  io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("add-user", (userID) => {
      // console.log(userID);
      onlineUsers.set(userID, socket.id);
      // console.log(onlineUsers);
    });

    socket.on("send-msg", (data) => {
      // console.log(data);
      // console.log(onlineUsers);
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        // console.log("is-online");
        socket.to(sendUserSocket).emit("msg-recieve", data.message);
      }
    });
  });
};

start();
