import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const postURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts`;

//---- Create New POST --------------------------------
const createPost = async (postData) => {
  try {
    const response = await axios.post(postURL, postData, {
      withCredentials: true,
    });
    if (response.status === 201) return { success: true, data: response.data };
    return {
      success: false,
      data: response.data.message || "Error creating Post",
    };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return { success: false, data: message || "Can not create post" };
  }
};

//---- Get My Posts --------------------------------
const getMyPosts = createAsyncThunk("postSlice/getMyPosts", async () => {
  const response = await axios.get(postURL, { withCredentials: true });
  return response.data;
});

const deletePost = async (postID) => {
  const response = await axios.delete(`${postURL}/${postID}`, {
    withCredentials: true,
  });
  if (response.status === 200) return true;
  return false;
};

export { createPost, getMyPosts, deletePost };
