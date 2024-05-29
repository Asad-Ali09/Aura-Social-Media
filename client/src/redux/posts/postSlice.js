import { createSlice } from "@reduxjs/toolkit";
import { getMyPosts } from "./postServices";

const initialState = {
  status: "idle",
  posts: [],
  myPosts: [],
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMyPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMyPosts.fulfilled, (state, action) => {
        state.myPosts = action.payload;
        state.status = "success";
      })
      .addCase(getMyPosts.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export default postSlice.reducer;

export const selectMyPosts = (state) => state.posts.myPosts;
export const selectPostStatus = (state) => state.posts.status;
export const selectPostError = (state) => state.posts.error;
