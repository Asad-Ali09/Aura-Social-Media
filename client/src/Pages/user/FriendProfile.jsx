import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ImageList,
  ImageListItem,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";

const FriendProfile = () => {
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);
  const verySmallScreen = useMediaQuery("(max-width:300px)");
  const somwWhatSmallScreen = useMediaQuery("(max-width:600px)");
  const mdScreen = useMediaQuery("(max-width:900px)");
  const fontQuery = useMediaQuery("(max-width:360px)");

  const FollowButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#dbd3d361",
    "&:hover": {
      backgroundColor: "#b3b3b399",
    },
  }));

  const ButtonText = styled(Typography)(({ theme }) => ({
    color: "black",
    fontWeight: "bold",
    fontSize: 10,
  }));

  const followers = [
    {
      id: 1,
      name: "Follower 1",
      avatar: "avatar_url_1",
      isUserFollowing: false,
    },
    {
      id: 2,
      name: "Follower 2",
      avatar: "avatar_url_2 ",
      isUserFollowing: false,
    },
    // Add more followers as needed
  ];

  const following = [
    {
      id: 1,
      name: "Following 1",
      avatar: "avatar_url_3",
      isUserFollowing: true,
    },
    {
      id: 2,
      name: "Following 2",
      avatar: "avatar_url_4",
      isUserFollowing: true,
    },
    // Add more following as needed
  ];

  const handleFollowersDialogOpen = () => {
    setIsFollowersDialogOpen(true);
  };

  const handleFollowersDialogClose = () => {
    setIsFollowersDialogOpen(false);
  };

  const handleFollowingDialogOpen = () => {
    setIsFollowingDialogOpen(true);
  };

  const handleFollowingDialogClose = () => {
    setIsFollowingDialogOpen(false);
  };

  const handleIsUserFollowing = (index, e) => {
    following[index - 1].isUserFollowing =
      !following[index - 1].isUserFollowing;
    e.target.textContent === "Follow"
      ? (e.target.textContent = "Unfollow")
      : (e.target.textContent = "Follow");
    console.log(following[index - 1].isUserFollowing);
  };
  return (
    <Stack spacing={4} bgcolor={"mygray.bg"} width={"100%"} p={[1, 4]}>
      {/* Header */}
      <Stack direction={"row"} spacing={[2, 9]} alignItems={"center"}>
        <Box
          width={[100, 150]}
          height={[100, 150]}
          overflow={"hidden"}
          borderRadius={"50%"}
        >
          <img
            src="https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH=w240-h480-rw"
            width={"100%"}
            height={"100%"}
          />
        </Box>

        {/* Main Info Box */}
        <Box>
          <Stack height={"100%"} spacing={1} justifyContent={"space-evenly"}>
            <Typography fontSize={[16, 24]} variant="h6">
              Huzaifa Bin Kashif
            </Typography>
            {/* Buttons */}
            <Stack direction={"row"} spacing={1}>
              <FollowButton>
                <ButtonText>Follow</ButtonText>
              </FollowButton>
              <FollowButton>
                <ButtonText>Message</ButtonText>
              </FollowButton>
            </Stack>
            {/* Follow Details */}

            <Stack direction={"row"} spacing={verySmallScreen ? 1 : [1, 0.5]}>
              <Button
                disabled
                fontSize={[12, 13]}
                sx={{ textTransform: "capitalize", color: "black !important" }}
                onClick={{}}
              >
                <Stack direction={"column"}>
                  <Typography fontWeight={"bold"} alignSelf={"flex-start"}>
                    100
                  </Typography>
                  <Typography fontSize={13}>Posts</Typography>
                </Stack>
              </Button>

              <Button
                fontSize={[12, 13]}
                sx={{ textTransform: "capitalize", color: "black" }}
                onClick={handleFollowersDialogOpen}
              >
                <Stack direction={"column"}>
                  <Typography fontWeight={"bold"} alignSelf={"flex-start"}>
                    100
                  </Typography>
                  <Typography fontSize={13}>Followers</Typography>
                </Stack>
              </Button>

              <Button
                fontSize={[12, 13]}
                sx={{ textTransform: "capitalize", color: "black" }}
                onClick={handleFollowingDialogOpen}
              >
                <Stack direction={"column"}>
                  <Typography fontWeight={"bold"} alignSelf={"flex-start"}>
                    100
                  </Typography>
                  <Typography fontSize={13}>Following</Typography>
                </Stack>
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      <hr />
      {/* Posts */}
      <ImageList
        sx={{ height: "100%" }}
        cols={somwWhatSmallScreen ? 1 : mdScreen ? 2 : 3}
        rowHeight={300}
      >
        <ImageListItem
          sx={{
            "&:hover": {
              transform: "scale(1.1)",
              zIndex: 100,
            },
            transition: "0.3s ease-in-out",
            cursor: "pointer",
          }}
        >
          <img
            style={{ height: "100%" }}
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHMDlwRCHOHZP_tX7jRYNxV8W8MpNEog45w"
            }
            loading="lazy"
          />
        </ImageListItem>
        <ImageListItem>
          <img
            style={{ height: "100%" }}
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHMDlwRCHOHZP_tX7jRYNxV8W8MpNEog45w"
            }
            loading="lazy"
          />
        </ImageListItem>
        <ImageListItem>
          <img
            style={{ height: "100%" }}
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHMDlwRCHOHZP_tX7jRYNxV8W8MpNEog45w"
            }
            loading="lazy"
          />
        </ImageListItem>
        <ImageListItem>
          <img
            style={{ height: "100%" }}
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHMDlwRCHOHZP_tX7jRYNxV8W8MpNEog45w"
            }
            loading="lazy"
          />
        </ImageListItem>
      </ImageList>

      <Dialog
        open={isFollowersDialogOpen}
        onClose={handleFollowersDialogClose}
        fullWidth
      >
        <DialogTitle>Followers</DialogTitle>
        <DialogContent sx={{ height: "70vh" }}>
          <List>
            {followers.map((data, index) => {
              return (
                <ListItem key={index}>
                  <Stack
                    direction={"row"}
                    width={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Button
                      component="Link"
                      sx={{ textTransform: "capitalize", width: ["40% "] }}
                      to="/follower-profile-1"
                      fullWidth
                    >
                      <Avatar src={data.avatar} sx={{ marginRight: "10px" }}>
                        A
                      </Avatar>
                      <ListItemText>
                        <Typography
                          color="black"
                          fontSize={fontQuery ? 12 : null}
                        >
                          {data.name.length > 5 && fontQuery
                            ? `${data.name.substring(0, 3)}...`
                            : data.name}
                        </Typography>
                      </ListItemText>
                    </Button>
                    <Button
                      key={index}
                      variant="contained"
                      sx={{
                        textTransform: "capitalize",
                        alignSelf: "flex-end",
                        marginBottom: `9px `,
                        height: "40px",
                      }}
                      onClick={(e, index) => {
                        handleIsUserFollowing(data.id, e);
                      }}
                    >
                      {data.isUserFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog
        open={isFollowingDialogOpen}
        onClose={handleFollowingDialogClose}
        fullWidth
      >
        <DialogTitle>Following</DialogTitle>
        <DialogContent sx={{ height: "70vh" }}>
          <List>
            {following.map((data, index) => {
              return (
                <ListItem key={index}>
                  <Stack
                    direction={"row"}
                    width={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Button
                      component="Link"
                      sx={{ textTransform: "capitalize", width: ["40% "] }}
                      to="/follower-profile-1"
                      fullWidth
                    >
                      <Avatar src={data.avatar} sx={{ marginRight: "10px" }}>
                        A
                      </Avatar>
                      <ListItemText>
                        <Typography
                          color="black"
                          fontSize={fontQuery ? 12 : null}
                        >
                          {data.name.length > 5 && fontQuery
                            ? `${data.name.substring(0, 3)}...`
                            : data.name}
                        </Typography>
                      </ListItemText>
                    </Button>
                    <Button
                      key={index}
                      variant="contained"
                      sx={{
                        textTransform: "capitalize",
                        alignSelf: "flex-end",
                        marginBottom: `9px `,
                        height: "40px",
                      }}
                      onClick={(e) => {
                        handleIsUserFollowing(index, e);
                      }}
                    >
                      {data.isUserFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default FriendProfile;
