import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const userURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users`;

//---- Get Follow Suggestions --------------------------------
const getFollowSuggestions = createAsyncThunk(
  "userSlice/getsuggestions",
  async () => {
    const response = await axios.get(`${userURL}/getfollowsuggestions`, {
      withCredentials: true,
    });
    return response.data;
  }
);

//--- Follow A User --------------------------------
const followUser = createAsyncThunk("userSlice/follow", async (userID) => {
  const response = await axios.post(
    `${userURL}/follow/${userID}`,
    {},
    { withCredentials: true }
  );
  return { success: response.data.success, userID };
});

const unfollowUser = createAsyncThunk("userSlice/unfollow", async (userID) => {
  const response = await axios.post(
    `${userURL}/unfollow/${userID}`,
    {},
    { withCredentials: true }
  );
  return { success: response.data.success, userID };
});

export { getFollowSuggestions, followUser, unfollowUser };
