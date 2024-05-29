import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const authURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/auth`;

//---- Register a new user
const signUpUser = async (user) => {
  const { firstName, lastName, email, password, googleAccessToken } = user;

  if ((!firstName || !lastName || !email || !password) && !googleAccessToken) {
    return;
  }
  const URL = `${authURL}/signup`;

  try {
    const response = await axios.post(URL, user, {
      withCredentials: true,
    });
    if (response.status >= 200 && response.status <= 299) {
      return { success: true, data: response.data };
    }
    return {
      success: false,
      data: response.data.message || "Can not create account",
    };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return { success: false, data: message || "Can not create account" };
  }
};

//---- Login
const LoginUser = async (userData) => {
  try {
    const response = await axios.post(`${authURL}/login`, userData, {
      withCredentials: true,
    });
    if (response.status >= 200 && response.status <= 299) {
      return { success: true, data: response.data };
    }
    return { success: false, data: response.data.message || "Can not login" };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return { success: false, data: message || "Can not login" };
  }
};

//---- Logout
const LogoutUser = async () => {
  try {
    await axios.get(`${authURL}/logout`, {
      withCredentials: true,
    });
    return { success: true };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return { success: false, data: message || "Can not logout" };
  }
};

//---- get User details
const getUserData = createAsyncThunk("authSlice/getUserData", async () => {
  const response = await axios.get(`${authURL}`, {
    withCredentials: true,
  });
  return response.data.data;
});

//---- Change UserName
const updateUser = async (user) => {
  if (!user.firstName && !user.lastName && !user.profilePicture) {
    return { success: false, data: "Please provide new information" };
  }
  try {
    const response = await axios.patch(`${authURL}/updateprofile`, user, {
      withCredentials: true,
    });
    if (response.status >= 200 && response.status <= 299) {
      return { success: true, data: response.data };
    } else {
      return { success: false, data: response.data.message };
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return { success: false, data: message || "Can not login" };
  }
};

//---- Change Password
const UpdatePassword = async (Password) => {
  try {
    const response = await axios.patch(`${authURL}/changepassword`, Password, {
      withCredentials: true,
    });
    if (response.status >= 200 && response.status <= 299) {
      return { success: true, data: response.data };
    }
    return { success: false, data: response.data.message };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return { success: false, data: message || "Can not update password" };
  }
};

//---- Forget Password --------------------------------
const forgetPassword = async (email) => {
  try {
    const response = await axios.post(
      `${authURL}/forgetpassword`,
      { email },
      { withCredentials: true }
    );
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, data: response.data.message };
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return {
      success: false,
      data: message || "Can not send mail right now. Please try again later",
    };
  }
};

//---- Reset Password --------------------------------
const resetPassword = async ({ password, resetToken }) => {
  try {
    const response = await axios.put(
      `${authURL}/resetpassword`,
      { password, resetToken },
      { withCredentials: true }
    );
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
    return { success: false, data: response.data.message };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return {
      success: false,
      data: message || "Can not reset password",
    };
  }
};

const getLoginStatus = async () => {
  try {
    const response = await axios.get(`${authURL}/isloggedin`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return false;
  }
};

export {
  signUpUser,
  LoginUser,
  LogoutUser,
  getUserData,
  updateUser,
  UpdatePassword,
  forgetPassword,
  resetPassword,
  getLoginStatus,
};
