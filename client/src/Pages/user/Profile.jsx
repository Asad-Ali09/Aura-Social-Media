import React, { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectMyPosts, selectPostStatus } from "../../redux/posts/postSlice";
import { getMyPosts } from "../../redux/posts/postServices";
import { selectAuthStatus, selectUser } from "../../redux/auth/authSlice";
import Loader from "../../Components/Loader";
import useRedirectUser from "../../hooks/useRedirectUser";
import { getUserData } from "../../redux/auth/authServices";
import { followUser, unfollowUser } from "../../redux/user/userServices";

const Profile = () => {
  useRedirectUser("/login");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const posts = useSelector(selectMyPosts);
  const status = useSelector(selectPostStatus);
  const userStatus = useSelector(selectAuthStatus);

  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getUserData());
    dispatch(getMyPosts());
  }, [dispatch]);

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

  const handleFollowersDialogOpen = () => {
    setIsFollowersDialogOpen(true);
  };

  const handleFollowersDialogClose = () => {
    dispatch(getUserData());
    setIsFollowersDialogOpen(false);
  };

  const handleFollowingDialogOpen = () => {
    setIsFollowingDialogOpen(true);
  };

  const handleFollowingDialogClose = () => {
    dispatch(getUserData());
    setIsFollowingDialogOpen(false);
  };

  const handleFollow = (userID) => {
    console.log("following....");
    dispatch(followUser(userID));
  };
  const handleUnFollow = (userID) => {
    console.log("unfollowing....");
    dispatch(unfollowUser(userID));
  };

  return (
    <>
      {(status === "loading" || userStatus === "loading") && <Loader />}

      <Stack spacing={4} bgcolor={"mygray.bg"} width={"100%"} p={[1, 4]}>
        {/* Header */}
        <Stack direction={"row"} spacing={[2, 9]} alignItems={"center"}>
          <Box
            width={[100, 150]}
            height={[100, 150]}
            overflow={"hidden"}
            borderRadius={"50%"}
          >
            <Avatar
              src={user.profilePicture}
              sx={{ width: "100%", height: "100%" }}
            >
              {user.firstName?.at(0)}
            </Avatar>
          </Box>

          {/* Main Info Box */}
          <Box>
            <Stack height={"100%"} spacing={1} justifyContent={"space-evenly"}>
              <Typography fontSize={[16, 24]} variant="h6">
                {`${user.firstName} ${user.lastName}`}
              </Typography>
              {/* Buttons */}
              <Stack direction={"row"} spacing={1}>
                <FollowButton onClick={() => navigate("/editprofile")}>
                  <ButtonText>Edit Profile</ButtonText>
                </FollowButton>
              </Stack>
              {/* Follow Details */}

              <Stack direction={"row"} spacing={verySmallScreen ? 1 : [1, 0.5]}>
                <Button
                  disabled
                  fontSize={[12, 13]}
                  sx={{
                    textTransform: "capitalize",
                    color: "black !important",
                  }}
                  onClick={{}}
                >
                  <Stack direction={"column"}>
                    <Typography fontWeight={"bold"} alignSelf={"flex-start"}>
                      {posts.length}
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
                      {user.followers?.length}
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
                      {user.following?.length}
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
          {posts.length === 0 && <>You haven't uploaded anything</>}
          {posts.map((post) => {
            if (!post.photos || !post.photos[0]) {
              return;
            }

            return (
              <ImageListItem
                key={post._id}
                component={"button"}
                onClick={() => navigate(`/seepost/${post._id}`)}
                sx={{
                  cursor: "pointer",
                }}
              >
                <img
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  src={post.photos?.at(0)?.url}
                  loading="lazy"
                />
              </ImageListItem>
            );
          })}
        </ImageList>

        {/* Followers */}
        <Dialog
          open={isFollowersDialogOpen}
          onClose={handleFollowersDialogClose}
          fullWidth
        >
          <DialogTitle>Followers</DialogTitle>
          <DialogContent sx={{ height: "70vh" }}>
            <List>
              {user.followers.map((data) => {
                return (
                  <ListItem
                    disablePadding={fontQuery ? true : false}
                    key={data.id}
                  >
                    <Stack
                      direction={"row"}
                      width={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Button
                        component="Link"
                        sx={{ textTransform: "capitalize", width: ["40% "] }}
                        onClick={() => navigate(`/profile/${data.id}`)}
                        fullWidth
                      >
                        <Avatar
                          src={data.profilePicture}
                          sx={{ marginRight: "10px" }}
                        >
                          A
                        </Avatar>
                        <ListItemText>
                          <Typography
                            color="black"
                            fontSize={fontQuery ? 12 : null}
                          >
                            {data.firstName > 5 && fontQuery
                              ? `${data.firstName.substring(0, 5)}...`
                              : data.firstName}{" "}
                            {data.firstName > 5 && fontQuery
                              ? null
                              : data.lastName}
                          </Typography>
                        </ListItemText>
                      </Button>
                      <Button
                        key={data.id}
                        variant="contained"
                        sx={{
                          textTransform: "capitalize",
                        }}
                        size={fontQuery ? "small" : "normal"}
                        onClick={() => {
                          data.isFollowed
                            ? handleUnFollow(data.id)
                            : handleFollow(data.id);
                        }}
                      >
                        {data.isFollowed ? "unFollow" : "follow"}
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
              {user.following.map((data) => {
                return (
                  <ListItem key={data.id}>
                    <Stack
                      direction={"row"}
                      width={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Button
                        component="Link"
                        sx={{ textTransform: "capitalize", width: ["40% "] }}
                        onClick={() => navigate(`/profile/${data.id}`)}
                        fullWidth
                      >
                        <Avatar
                          src={data.profilePicture}
                          sx={{ marginRight: "10px" }}
                        >
                          {data.firstName ? data.firstName[0] : null}
                        </Avatar>
                        <ListItemText>
                          <Typography
                            color="black"
                            fontSize={fontQuery ? 12 : null}
                          >
                            {data.firstName.length > 5 && fontQuery
                              ? `${data.firstName.substring(0, 5)}...`
                              : data.firstName}{" "}
                            {data.firstName.length > 5 && fontQuery
                              ? null
                              : data.lastName}
                          </Typography>
                        </ListItemText>
                      </Button>
                      <Button
                        key={data.id}
                        variant="contained"
                        sx={{
                          textTransform: "capitalize",
                        }}
                        size={fontQuery ? "small" : "normal"}
                        onClick={() => {
                          data.isFollowed
                            ? handleUnFollow(data.id)
                            : handleFollow(data.id);
                        }}
                      >
                        {data.isFollowed ? "unFollow" : "follow"}
                      </Button>
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          </DialogContent>
        </Dialog>
      </Stack>
    </>
  );
};

export default Profile;
