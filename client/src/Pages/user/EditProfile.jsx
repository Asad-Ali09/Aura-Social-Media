import React, { useRef, useState } from "react";
import {
  Avatar,
  Button,
  IconButton,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, setUser } from "../../redux/auth/authSlice";
import {
  UpdatePassword,
  getUserData,
  updateUser,
} from "../../redux/auth/authServices";
import useRedirectUser from "../../hooks/useRedirectUser";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";

const authURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/auth`;

const EditProfile = () => {
  useRedirectUser("/login");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const fileInputRef = useRef(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openUsernameDialog, setOpenUsernameDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Added state for confirmation
  const [selectedFile, setSelectedFile] = useState(null); // Added state for selected file

  const handleConfirmDialogClose = async (confirmed) => {
    setOpenConfirmDialog(false);
    if (confirmed) {
      const formData = new FormData();
      const toastID = toast.loading("uploading...");
      formData.append("file", selectedFile);
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET_KEY);
      const cloudName = import.meta.env.VITE_UPLOAD_CLOUD_NAME;

      try {
        const uploadImage = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
          formData
        );
        if (uploadImage.status < 200 || uploadImage.status >= 300) {
          return toast.error(
            "Error uploading Image. Please Try Again Later...",
            {
              id: toastID,
            }
          );
        }

        const response = await axios.patch(
          `${authURL}/updateprofile`,
          { profilePicture: uploadImage.data.secure_url },
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.success(response.data.message, { id: toastID });
          dispatch(getUserData());
        }
      } catch (error) {}

      // Perform the necessary actions with the selected file
      // console.log("Selected file:", selectedFile);
    }
  };

  const handleDialogClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setNewFirstName("");
    setNewLastName("");
    setOpenPasswordDialog(false);
    setOpenUsernameDialog(false);
  };

  const handleProfilePicChange = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setOpenConfirmDialog(true);
    // console.log("Selected file:", selectedFile);
  };

  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true);
  };

  const handleUsernameDialogOpen = () => {
    setOpenUsernameDialog(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePasswordChange = async () => {
    const toastID = toast.loading("waiting...");
    if (!newPassword || !confirmPassword || !oldPassword) {
      return toast.error("Please fill all the fields", { id: toastID });
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Password does not match", { id: toastID });
    }
    try {
      const response = await UpdatePassword({ oldPassword, newPassword });
      if (response.success === true) {
        toast.success(response.data.message, { id: toastID });
        handleDialogClose();
      } else {
        toast.error(response.data, { id: toastID });
      }
    } catch (error) {
      toast.error("Can not update password", { id: toastID });
    }
  };

  const handleUsernameChange = async () => {
    const toastID = toast.loading("waiting...");
    if (!newFirstName && !newLastName) {
      return toast.error("Please enter valid name", { id: toastID });
    }

    try {
      const response = await updateUser({
        firstName: newFirstName,
        lastName: newLastName,
      });
      if (response.success === true) {
        dispatch(setUser(response.data.user));
        toast.success("Name updated successfully", { id: toastID });
      } else {
        toast.error(response.data, { id: toastID });
      }
    } catch (error) {
      toast.error("Can not change name", { id: toastID });
    }
    handleDialogClose();
  };

  return (
    <>
      <Stack width={"100%"}>
        <IconButton
          sx={{ alignSelf: "flex-start" }}
          size="large"
          onClick={handleGoBack}
        >
          <ArrowBack />
        </IconButton>

        <Stack alignItems={"center"} justifyContent={"center"}>
          <Avatar sx={{ width: 150, height: 150 }} src={user.profilePicture} />
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <IconButton onClick={handleProfilePicChange}>
            <ModeEditRoundedIcon />
          </IconButton>
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-around"}
          mt={4}
          width={"80%"}
          marginInline={"auto"}
        >
          <TextField
            defaultValue="Small"
            variant="filled"
            label="First Name"
            size="small"
            value={user.firstName}
            focused
            InputProps={{ readOnly: true }}
            sx={{
              width: "40%",
              marginInline: "auto",
              "& .MuiFilledInput-underline:after": { borderColor: "silver" },
            }}
          />
          <TextField
            defaultValue="Small"
            variant="filled"
            label="Last Name"
            size="small"
            value={user.lastName}
            focused
            InputProps={{ readOnly: true }}
            sx={{
              width: "40%",
              marginInline: "auto",
              "& .MuiFilledInput-underline:after": { borderColor: "silver" },
            }}
          />
        </Stack>

        <Stack width={"80%"} marginInline={"auto"} mt={4}>
          <TextField
            defaultValue="Small"
            variant="filled"
            label="Email"
            size="small"
            value={user.email}
            focused
            InputProps={{ readOnly: true }}
            sx={{
              width: "90%",
              marginInline: "auto",
              "& .MuiFilledInput-underline:after": { borderColor: "silver" },
            }}
          />
        </Stack>

        <Stack alignItems={"center"} width={"72%"} marginInline={"auto"}>
          <Stack
            width={"100%"}
            direction={"row"}
            justifyContent={"space-evenly"}
            flexWrap={"wrap"}
            alignSelf={"flex-start"}
            mt={4}
          >
            <Button
              variant="contained"
              size="medium"
              sx={{ marginTop: [2, 2] }}
              onClick={handlePasswordDialogOpen}
            >
              Change Password
            </Button>
            <Button
              variant="contained"
              size="medium"
              sx={{ marginTop: [2, 2] }}
              onClick={handleUsernameDialogOpen}
            >
              Change Username
            </Button>
          </Stack>
        </Stack>
      </Stack>

      {/* Password Change Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={3} marginBlock={2}>
            <TextField
              label="Old Password"
              type="password"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Username Change Dialog */}
      <Dialog open={openUsernameDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Change Username</DialogTitle>
        <DialogContent>
          <Stack spacing={3} marginBlock={2}>
            <TextField
              label="New First Name"
              fullWidth
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />
            <TextField
              label="New Last Name"
              fullWidth
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleUsernameChange}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile cahnge */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => handleConfirmDialogClose(false)}
        fullWidth
      >
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to change your profile picture?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmDialogClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmDialogClose(true)}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
              
      </Dialog>
    </>
  );
};

export default EditProfile;
