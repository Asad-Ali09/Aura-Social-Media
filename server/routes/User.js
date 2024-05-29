const express = require("express");
const {
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
} = require("../controllers/User");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.post("/auth/signup", signupController);
router.route("/auth/login").post(signinController);
router.route("/auth/logout").get(LogoutUser);
router.route("/auth/isloggedin").get(isLoggedIn);
router.route("/auth/changepassword").patch(authMiddleware, changePassword);
router.route("/auth/updateprofile").patch(authMiddleware, updateProfile);

router.route("/auth/forgetpassword").post(forgetPassword);
router.route("/auth/resetpassword").put(resetPassword);

router.route("/auth").get(authMiddleware, getUserData);

router.route("/getuser/:userID").get(authMiddleware, getUserByID);

router.route("/follow/:userId").post(authMiddleware, followUser);
router.route("/unfollow/:userId").post(authMiddleware, unFollowUser);

router.route("/getfollowsuggestions").get(authMiddleware, getSuggestions);
router.route("/searchusers").get(authMiddleware, searchUsers);

module.exports = router;
