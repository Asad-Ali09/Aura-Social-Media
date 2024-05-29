// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const customError = require("../errors/customError");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please Provide first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please Provide last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please fill a valid email address",
    ],
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/dxwkdjhe0/image/upload/v1687462951/profile-avatar.png",
  },
  password: String,
  following: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      profilePicture: String,
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
  ],
  followers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      profilePicture: String,
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
  ],
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.firstName, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};

userSchema.methods.validatePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.followUser = async function (userIdToFollow) {
  try {
    // Find the target user
    const targetUser = await this.model("User").findById(userIdToFollow);

    // console.log("hello");

    if (!targetUser) {
      return { success: false, message: "User doesn't exist", status: 404 };
    }
    // console.log({ target: targetUser.followers, user: this.following });
    // Check if the current user is already following the target user
    const isAlreadyFollowing = this.following.some((followedUser) =>
      followedUser.id.equals(targetUser._id)
    );

    if (isAlreadyFollowing) {
      return {
        success: false,
        message: "User is already being followed",
        status: 400,
      };
    }

    // Update the current user's following array
    this.following.push({
      id: targetUser._id,
      profilePicture: targetUser.profilePicture,
      firstName: targetUser.firstName,
      lastName: targetUser.lastName,
    });

    // Update the target user's followers array
    targetUser.followers.push({
      id: this._id,
      profilePicture: this.profilePicture,
      firstName: this.firstName,
      lastName: this.lastName,
    });

    // Save changes to both users
    await Promise.all([this.save(), targetUser.save()]);

    return {
      success: true,
      message: "User followed successfully",
      status: 200,
    };
  } catch (error) {
    throw new customError(500, "Can not follow user");
  }
};

userSchema.methods.unfollowUser = async function (userIdToUnfollow) {
  try {
    // Find the target user
    const targetUser = await this.model("User").findById(userIdToUnfollow);

    if (!targetUser) {
      return { success: false, message: "User doesn't exist", status: 404 };
    }

    // Update the current user's following array
    this.following = this.following.filter(
      (followedUser) => !followedUser.id.equals(targetUser._id)
    );

    // Update the target user's followers array
    targetUser.followers = targetUser.followers.filter(
      (follower) => !follower.id.equals(this._id)
    );

    // Save changes to both users
    await Promise.all([this.save(), targetUser.save()]);

    return {
      success: true,
      message: "User unfollowed successfully",
      status: 200,
    };
  } catch (error) {
    return { success: false, message: "Failed to unfollow user", status: 500 };
  }
};

userSchema.methods.toResponseObject = function () {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    profilePicture: this.profilePicture,
    following: this.following,
    followers: this.followers,
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
