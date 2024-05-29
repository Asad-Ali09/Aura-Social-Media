import { createSlice } from "@reduxjs/toolkit";
import { followUser, getFollowSuggestions, unfollowUser } from "./userServices";

const initialState = {
  status: "idle",
  error: null,
  followSuggestions: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFollowSuggestions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFollowSuggestions.fulfilled, (state, action) => {
        state.followSuggestions = action.payload;
        state.status = "success";
      })
      .addCase(getFollowSuggestions.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(followUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(followUser.fulfilled, (state, action) => {
        console.log(action.payload);
        state.followSuggestions = state.followSuggestions.map((suggestion) => {
          if (suggestion._id === action.payload.userID) {
            suggestion.isFollowed = true;
          }
          return suggestion;
        });
        state.status = "success";
      })
      .addCase(followUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "rejected";
      })
      .addCase(unfollowUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        console.log(action.payload);
        state.followSuggestions = state.followSuggestions.map((suggestion) => {
          if (suggestion._id === action.payload.userID) {
            suggestion.isFollowed = false;
          }
          return suggestion;
        });
        state.status = "success";
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "rejected";
      });
  },
});

export default userSlice.reducer;

export const selectFollowSuggestions = (state) => state.user.followSuggestions;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
