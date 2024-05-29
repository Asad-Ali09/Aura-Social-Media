import styled from "@emotion/styled";
import { Logout } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Sidebar } from "react-pro-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUser } from "../redux/auth/authSlice";
import { LogoutUser, getUserData } from "../redux/auth/authServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { selectFollowSuggestions } from "../redux/user/userSlice";
import {
  followUser,
  getFollowSuggestions,
  unfollowUser,
} from "../redux/user/userServices";

const FollowButton = styled(Button)({
  fontSize: 14,
  fontWeight: "normal",
  textTransform: "capitalize",
  width: "80px",
});

const SuggestionText = styled(ListItemButton)(({ theme }) => ({
  color: "#707070",
  ":hover": {
    // color: "black",
    backgroundColor: "transparent",
    cursor: "default",
  },
}));

const RightBar = () => {
  const Suggestions = useSelector(selectFollowSuggestions);

  const tabView = useMediaQuery("(max-width: 800px)");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = async () => {
    try {
      const response = await LogoutUser();
      if (response.success === false) {
        toast.error("Can not log out");
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error("Can not log out");
    }
  };

  if (tabView) {
    return <></>;
  }

  const handleFollow = (userID, followed) => {
    if (followed === true) {
      dispatch(unfollowUser(userID));
    } else {
      dispatch(followUser(userID));
    }
    dispatch(getUserData());
  };

  return (
    <>
      <Box height={"60vh"} mr={15} mt={5} width={440}>
        <List sx={{ width: "100%" }}>
          <ListItem disablePadding onClick={() => navigate("/profile")}>
            <ListItemButton>
              <ListItemIcon>
                <Avatar src={user.profilePicture}>
                  {user.firstName?.at(0)}
                </Avatar>
              </ListItemIcon>
              <ListItemText>
                <Typography fontSize={14}>
                  {user.firstName} {user.lastName}
                </Typography>
              </ListItemText>
            </ListItemButton>
            <FollowButton size="small" variant="text" onClick={handleLogout}>
              <Logout fontSize="small" />
            </FollowButton>
          </ListItem>
          <Box mt={2}>
            <SuggestionText>
              <Typography fontSize={13}>Suggested For You</Typography>
            </SuggestionText>
            {/* <Divider /> */}
          </Box>
          {Suggestions.map((element) => {
            const followed =
              element.isFollowed && element.isFollowed === true ? true : false;

            return (
              <ListItem disablePadding key={element._id}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  width={"100%"}
                >
                  <ListItemButton
                    onClick={() => navigate(`/profile/${element._id}`)}
                  >
                    <ListItemIcon>
                      <Avatar
                        src={element.profilePicture}
                      >{`${element.firstName?.at(0)}`}</Avatar>
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        fontSize={14}
                      >{`${element.firstName} ${element.lastName}`}</Typography>
                    </ListItemText>
                  </ListItemButton>
                  <FollowButton
                    size="small"
                    variant={
                      element.isFollowed === true ? "contained" : "outlined"
                    }
                    onClick={() => handleFollow(element._id, followed)}
                  >
                    {element.isFollowed === true ? "unfollow" : "follow"}
                  </FollowButton>
                </Stack>
              </ListItem>
            );
          })}
        </List>
        <SuggestionText>
          <Typography fontSize={12} textAlign={"center"} width={"100%"}>
            Copyright &copy; All rights reserved
          </Typography>
        </SuggestionText>
      </Box>
    </>
  );
};

export default RightBar;

{
  /* <List spacing={1}>
<ListItem disablePadding>
  <ListItemButton>
    <ListItemIcon>
      <Avatar>H</Avatar>
    </ListItemIcon>
    <ListItemText primary="Aiza Khuram" />
  </ListItemButton>
</ListItem>

<ListItem disablePadding>
  <ListItemButton>
    <ListItemIcon>
      <Avatar>H</Avatar>
    </ListItemIcon>
    <ListItemText primary="Hamza Awan" />
  </ListItemButton>
</ListItem>
<ListItem disablePadding>
  <ListItemButton>
    <ListItemIcon>
      <Avatar>H</Avatar>
    </ListItemIcon>
    <ListItemText primary="Saad Bharwa" />
  </ListItemButton>
</ListItem>
</List> */
}
