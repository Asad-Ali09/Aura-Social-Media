import React, { useEffect, useRef, useState } from "react";
import { IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { motion, useDragControls } from "framer-motion";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AccountCircle, ArrowBack } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import { io } from "socket.io-client";

const ChatURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/chats`;
const userURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users`;

const Chat = () => {
  const socket = useRef();
  const scrollRef = useRef();
  const user = useSelector(selectUser);

  const navigate = useNavigate();

  const [currentChat, setCurrentChat] = useState("");

  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_URL);
    socket.current.emit("add-user", user._id);
    // console.log(socket.current);
    socket.current.on("msg-recieve", (msg) => {
      setArrivalMessage({ fromSelf: false, message: msg });
    });
  }, []);

  useEffect(() => {
    setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const [isChatOpen, setIsChatOpen] = useState(true);
  const smallButtonM = useMediaQuery("(max-width: 600px)");
  const largeScreen = useMediaQuery("(min-width: 900px)");

  const ref = useRef(null);
  const [height, setHeight] = useState("56");
  const [windowHeight, setWindowHeight] = useState(0);

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setHeight(windowHeight - ref.current.getBoundingClientRect().top);
  }, [ref, windowHeight]);

  useEffect(() => {
    const getChatUsers = async () => {
      try {
        const response = await axios.get(`${ChatURL}/getchatusers`, {
          withCredentials: true,
        });
        if (response.data.success !== true) {
          throw new Error("error loading users");
        }
        // console.log(response.data);
        setChatUsers(response.data.data);
      } catch (error) {
        toast.error("Error Loading Chats. Please try reloading page...");
        // console.log(error);
      }
    };
    getChatUsers();
  }, []);

  useEffect(() => {
    if (!currentChat) return;
    const getMessages = async () => {
      try {
        const response = await axios.post(
          `${ChatURL}/getmessages`,
          { to: currentChat },
          { withCredentials: true }
        );
        if (response.data.success !== true) {
          throw new Error("Couldn't get messages");
        }
        // console.log(response.data);
        setMessages(response.data.data);
      } catch (error) {
        toast.error("Error Loading Messages, please try reloading page...");
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // console.log(currentChat);
    try {
      const response = await axios.post(
        `${ChatURL}/addmessage`,
        { to: currentChat, message },
        { withCredentials: true }
      );
      if (response.status !== 201) {
        throw new Error("can not send message");
      }

      socket.current.emit("send-msg", {
        to: currentChat,
        from: user._id,
        message,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message });
      setMessages(msgs);
    } catch (error) {
      toast.error("Can not send message");
    }

    setMessage("");
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "" || e.target.value.length === 0) {
      setSearchResult([]);
      return;
    }

    try {
      const response = await axios.get(
        `${userURL}/searchusers?searchString=${e.target.value}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSearchResult(response.data.data);
      }
    } catch (error) {
      toast.error("error searching users");
    }
  };

  return (
    <>
      <IconButton
        style={{
          backgroundColor: "white",
          position: "absolute",
          zIndex: 999,
          top: 70,
          left: 20,
          borderRadius: "50%",
          display: largeScreen ? "none" : "block",
          padding: "0",
          boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;",
        }}
        color="primary"
      >
        <AccountCircle
          fontSize="large"
          style={{
            width: "100%",
            fontSize: 50,
            boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;",
          }}
        />
      </IconButton>

      <Grid
        ref={ref}
        overflow={"hidden"}
        container
        component={Paper}
        height={height}
        sx={{}}
        width={"100%"}
      >
        {/* Side Chats */}
        <Grid
          item
          display={["none", "none", "block"]}
          xs={0}
          md={3}
          borderRight={"1px solid #e0e0e0"}
        >
          {/* Profile */}
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <List>
            <ListItem button key={user.id} onClick={() => navigate("/profile")}>
              <ListItemIcon>
                <Avatar alt="Remy Sharp" src={user.profilePicture} />
              </ListItemIcon>
              <ListItemText
                primary={`${user.firstName} ${user.lastName}`}
              ></ListItemText>
            </ListItem>
          </List>

          <Divider />
          {/* Search Bar */}
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
              fullWidth
            />
          </Grid>
          <Divider />

          {/* Friends */}
          <List>
            {searchQuery.length !== 0 && searchResult.length !== 0
              ? searchQuery.length !== 0 &&
                searchResult.length !== 0 &&
                searchResult.map((user) => {
                  return (
                    <ListItem
                      button
                      key={user._id}
                      onClick={() => setCurrentChat(user._id)}
                    >
                      <ListItemIcon>
                        <Avatar
                          alt={user.firstName}
                          src={user.profilePicture}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${user.firstName} ${user.lastName}`}
                      >
                        {user.firstName} {user.lastName}
                      </ListItemText>
                      <ListItemText
                        secondary="online"
                        align="right"
                      ></ListItemText>
                    </ListItem>
                  );
                })
              : chatUsers.map((user) => {
                  return (
                    <ListItem
                      button
                      key={user._id}
                      sx={{
                        backgroundColor:
                          user._id === currentChat ? "#1565C0" : "transparent",
                        color: user._id === currentChat ? "#fff" : "black",
                        borderRadius: "10px",
                        "&:hover": {
                          backgroundColor:
                            user._id === currentChat
                              ? "#1565C0"
                              : "transparent",
                        },
                      }}
                      onClick={() => setCurrentChat(user._id)}
                    >
                      <ListItemIcon>
                        <Avatar
                          alt={user.firstName}
                          src={user.profilePicture}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${user.firstName} ${user.lastName}`}
                      >
                        {user.firstName} {user.lastName}
                      </ListItemText>
                    </ListItem>
                  );
                })}
          </List>
        </Grid>

        {/* Main Chat */}
        <Grid item xs={12} md={9} overflow={"scroll"} height={"100%"}>
          <Stack justifyContent={"space-between"} height={"100%"}>
            {/* Messages */}
            {!currentChat && (
              <Typography textAlign={"center"}>No Chat Selected</Typography>
            )}

            {currentChat && (
              <>
                <List sx={{ overflowY: "auto" }}>
                  {messages.map((message, index) => {
                    return (
                      <ListItem ref={scrollRef} key={index}>
                        <Grid container>
                          <Grid item xs={12}>
                            <ListItemText
                              align={message.fromSelf ? "right" : "left"}
                              primary={message.message}
                            ></ListItemText>
                          </Grid>
                          <Grid item xs={12}>
                            <ListItemText
                              align={message.fromSelf ? "right" : "left"}
                              secondary={moment(message.createdAt).fromNow()}
                            ></ListItemText>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  })}
                </List>

                {/* Send Mesaage Box */}
                <Grid
                  component={"form"}
                  onSubmit={handleSendMessage}
                  container
                  p={2}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  {/* message Bar */}
                  <Grid item xs={10} md={11}>
                    <TextField
                      id="outlined-basic-email"
                      label="Type Something"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  {/* Send Message Button */}
                  <Grid xs={2} md={1} align={smallButtonM ? "right" : "center"}>
                    <Fab
                      size="medium"
                      color="primary"
                      aria-label="add"
                      role="button"
                      type="submit"
                    >
                      <SendIcon />
                    </Fab>
                  </Grid>
                </Grid>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Chat;
