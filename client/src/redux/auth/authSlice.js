import { createSlice } from "@reduxjs/toolkit";
import { getUserData } from "./authServices";
import { followUser, unfollowUser } from "../user/userServices";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  status: "",
  error: "",
  isLoggedIn: false,
  user: {
    _id: user?._id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    profilePicture: user?.profilePicture || "",
    followers: [],
    following: [],
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (state.user.following) {
        state.user.following.forEach((follow) => {
          follow.isFollowed = true;
        });
      }
      if (state.user.followers) {
        state.user.followers.forEach((follower) => {
          const isFollowed = state.user.following.some(
            (user) => user.id === follower.id
          );
          follower.isFollowed = isFollowed;
        });
      }
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    logoutUser: (state, action) => {
      state.isLoggedIn = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.user = action.payload;
        state.user.following.forEach((follow) => {
          follow.isFollowed = true;
        });
        state.user.followers.forEach((follower) => {
          const isFollowed = state.user.following.some(
            (user) => user.id === follower.id
          );
          follower.isFollowed = isFollowed;
        });
        state.status = "success";
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(followUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.user.followers = state.user.followers.map((user) => {
          if (user.id === action.payload.userID) {
            user.isFollowed = true;
          }
          return user;
        });
        state.user.following = state.user.following.map((user) => {
          if (user.id === action.payload.userID) {
            user.isFollowed = true;
          }
          return user;
        });
        state.status = "fulfilled";
      })
      .addCase(followUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.user.followers = state.user.followers.map((user) => {
          if (user.id === action.payload.userID) {
            user.isFollowed = false;
          }
          return user;
        });
        state.user.following = state.user.following.map((user) => {
          if (user.id === action.payload.userID) {
            user.isFollowed = false;
          }
          return user;
        });
        state.status = "fullfilled";
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
export const { setUser, setIsLoggedIn, logoutUser } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAuthStatus = (state) => state.auth.status;
