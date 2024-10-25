const User = require("../models/User");
const axios = require("axios");
const customError = require("../errors/customError");
const Token = require("../models/resetTokenModel");
const crypto = require("crypto");
const sendMail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  path: "/",
  httpOnly: true,
  expires: new Date(Date.now() + 1000 * 86400 * 3),
  sameSite: "strict",
  secure: true,
};

const signinController = async (req, res) => {
  if (req.body.googleAccessToken) {
    // gogole-auth
    const { googleAccessToken } = req.body;

    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      }
    );
    const firstName = response.data.given_name;
    const lastName = response.data.family_name;
    const email = response.data.email;
    const picture = response.data.picture;

    const user = await User.findOne({ email });

    if (!user) throw new customError(404, "User doesn't exists");

    const token = user.createJWT();
    res.cookie("token", token, cookieOptions);

    const userObj = user.toResponseObject();
    res.status(200).json({
      message: "Logged In Successfully",
      user: userObj,
    });
  } else {
    // normal-auth
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "")
      throw new customError(400, "Invalid Credentials");
    const user = await User.findOne({ email });

    if (!user) throw new customError(404, "User doesn't exists");

    const isPasswordOk = await user.validatePassword(password);

    if (!isPasswordOk) throw new customError(400, "Invalid Credentials");

    const token = user.createJWT();
    res.cookie("token", token, cookieOptions);

    const userObj = user.toResponseObject();

    res.status(200).json({
      message: "Logged In Successfully",
      user: userObj,
    });
  }
};

const signupController = async (req, res) => {
  // Sign Up With Google Account
  if (req.body.googleAccessToken) {
    const { googleAccessToken } = req.body;

    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new customError(400, "Invalid Google Access Token");
    }

    const firstName = response.data.given_name;
    const lastName = response.data.family_name;
    const email = response.data.email;
    const profilePicture = response.data.picture;
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new customError(400, "User already exists");
    }

    const user = await User.create({
      email,
      firstName,
      lastName,
      profilePicture,
    });
    const token = user.createJWT();
    res.cookie("token", token, cookieOptions);

    const userObj = user.toResponseObject();

    return res.status(201).json({
      message: "User created",
      user: userObj,
    });
  }

  // Normal Sign Up
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new customError(400, "Invalid Credentials");
  }
  if (password.length < 6) {
    throw new customError(400, "Password must be at least 6 characters");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new customError(400, "User already exists");
  }

  const user = await User.create({ firstName, lastName, email, password });

  if (user) {
    const token = user.createJWT();
    res.cookie("token", token, cookieOptions);

    const userObj = user.toResponseObject();
    return res.status(201).json({
      message: "User created",
      user: userObj,
    });
  } else {
    throw new customError(400, "Invalid user Data");
  }
};

const isLoggedIn = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json(false);
  }

  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

  if (decodedToken) {
    return res.status(200).json(true);
  }
  return res.status(200).json(false);
};

const LogoutUser = async (req, res) => {
  res.cookie("token", "", cookieOptions);
  res.status(200).json({ message: "Logged Out Successfully" });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new customError(400, "Please provide old and new passwords");
  }

  if (newPassword.length < 6) {
    throw new customError(400, "Password must be at least 6 characters");
  }

  const user = await User.findOne({ email: req.user.email });

  const isMatched = await user.validatePassword(oldPassword);

  if (!isMatched) {
    throw new customError(400, "Old Password is incorrect");
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({ message: "Password updated successfully" });
};

const updateProfile = async (req, res) => {
  const { firstName, lastName, profilePicture } = req.body;

  if (!firstName && !lastName && !profilePicture) {
    throw new customError(400, "Bad request");
  }

  const user = await User.findOne({ email: req.user.email });

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.profilePicture = profilePicture || user.profilePicture;

  await user.save();
  return res.status(200).json({
    message: "User updated successfully",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      email: user.email,
    },
  });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new customError(404, "User not found");
  }

  // TODO: ADD check for someone reseting gmail password

  const existingToken = await Token.findOne({ userID: user._id });
  if (existingToken) {
    await existingToken.deleteOne();
  }

  // Generate new Token
  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save to DB
  await Token.create({
    userID: user._id,
    token: hashedToken,
    expiresAt: Date.now() + 30 * (60 * 1000),
  });

  const resetURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `
  <h2 >Hello! ${user.firstName}</h2>
  <p>Please use the url below to reset your password.</p>
  <p>This reset link is valid for only 30 minutes.</p>
  <a href=${resetURL} clicktracking=off>${resetURL}</a>
  </br>
  <h4>AURA-SocialMedia-Team</h4>
`;

  const subject = "Forget Password | AURA Social Media";
  const to = user.email;

  const isSent = await sendMail(subject, message, to);
  if (isSent === true) {
    return res
      .status(200)
      .json({ message: "A mail is sent to your email address" });
  } else throw new customError(500, "Internal Server Error");
};

const resetPassword = async (req, res) => {
  const { password, resetToken } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const isFound = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!isFound) {
    throw new customError(400, "Invalid or Expired Token");
  }

  if (!password || password.length < 6) {
    throw new customError("400", "Invalid password");
  }

  const user = await User.findById(isFound.userID);

  if (!user) {
    throw new customError(404, "User not found");
  }

  user.password = password;
  await user.save();

  return res.status(200).json({ message: "Password updated successfully" });
};

const getUserData = async (req, res) => {
  return res.status(200).json({ message: "", data: req.user });
};

const getUserByID = async (req, res) => {
  const { userID } = req.params;
  const user = await User.findById(userID).select("-password");
  return res.status(200).json({ success: true, data: user });
};

//---- Follow a User --------------------------------
const followUser = async (req, res) => {
  const { userId } = req.params;
  const followerId = req.user._id;

  const currentUser = await User.findById(followerId);
  const data = await currentUser.followUser(userId);

  res
    .status(data.status || 500)
    .json({ message: data.message, success: data.success });
};

const unFollowUser = async (req, res) => {
  const { userId } = req.params;
  const followerId = req.user._id;

  const currentUser = await User.findById(followerId);
  const data = await currentUser.unfollowUser(userId);

  res
    .status(data.status || 500)
    .json({ message: data.message, success: data.success });
};

//--- Get Suggestions to Follow --------------------------------
const getSuggestions = async (req, res) => {
  const currentUserID = req.user._id;

  // Get the users that the current user is already following
  const currentUser = await User.findById(currentUserID);
  const followingIds = currentUser.following.map((user) => user.id);
  // Get 5 random users that the current user is not already following
  const randomUsers = await User.aggregate([
    { $match: { _id: { $nin: followingIds.concat(currentUserID) } } }, // Exclude current user and users they are following
    { $sample: { size: 5 } },
    {
      $project: {
        firstName: 1,
        profilePicture: 1,
        _id: 1,
        lastName: 1,
        email: 1,
      },
    },
  ]);

  res.status(200).json(randomUsers);
};

const searchUsers = async (req, res) => {
  const { searchString } = req.query;
  const users = await User.find({
    $or: [
      { firstName: { $regex: searchString, $options: "i" } },
      { lastName: { $regex: searchString, $options: "i" } },
      // { email: { $regex: searchString, $options: 'i' } },
    ],
  }).select("_id firstName lastName email profilePicture");

  const usersObj = users.filter((user) => !user._id.equals(req.user._id));

  return res.status(200).json({ success: true, data: usersObj });
};

module.exports = {
  signupController,
  signinController,
  LogoutUser,
  changePassword,
  updateProfile,
  forgetPassword,
  resetPassword,
  isLoggedIn,
  getUserData,
  followUser,
  unFollowUser,
  getSuggestions,
  searchUsers,
  getUserByID,
};
