import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Avatar,
  TextareaAutosize,
} from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const commURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/community`;

const CreateCommunityForm = () => {
  const navigate = useNavigate();

  const [communityData, setCommunityData] = useState({
    profilePicture: null,
    backgroundPicture: null,
    name: "",
    aboutUs: "",
  });

  const handleChange = (field) => (event) => {
    setCommunityData({
      ...communityData,
      [field]: event.target.files[0],
    });
  };

  const handleSubmit = async () => {
    // Add your logic to submit the form data
    console.log("Form data submitted:", communityData);

    const toastID = toast.loading("uploading...");

    const formData = new FormData();

    formData.append("file", communityData.profilePicture);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET_KEY);
    const cloudName = import.meta.env.VITE_UPLOAD_CLOUD_NAME;
    console.log(formData);
    try {
      const uploadImage = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData
      );
      console.log({ uploadImage });
      if (uploadImage.status < 200 || uploadImage.status >= 300) {
        return toast.error("Error uploading Image. Please Try Again Later...", {
          id: toastID,
        });
      }
      const profile = uploadImage.data.secure_url;

      console.log("profile loaded", profile);

      formData.append("file", communityData.profilePicture);
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET_KEY);
      const uploadImage2 = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData
      );
      if (uploadImage2.status < 200 || uploadImage2.status >= 300) {
        return toast.error("Error uploading Image. Please Try Again Later...", {
          id: toastID,
        });
      }

      const bgImg = uploadImage2.data.secure_url;

      const postData = {
        name: communityData.name,
        description: communityData.aboutUs,
        profile: profile,
        background_picture: bgImg,
      };
      const response = await axios.post(`${commURL}`, postData, {
        withCredentials: true,
      });
      if (response.status !== 201) {
        return toast.error(response.data.message);
      }
      toast.success(response.data.message, { id: toastID });
      navigate("/community");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error creating community",
        {
          id: toastID,
        }
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginBlock: "auto" }}>
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h4" gutterBottom>
          Create a Community
        </Typography>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Profile Picture"
            type="file"
            onChange={handleChange("profilePicture")}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {communityData.profilePicture && (
            <Avatar
              src={URL.createObjectURL(communityData.profilePicture)}
              alt="Profile Preview"
              style={{ marginTop: "10px" }}
              sx={{ width: "150px", height: "150px" }}
            />
          )}

          <TextField
            fullWidth
            label="Background Picture"
            type="file"
            onChange={handleChange("backgroundPicture")}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {communityData.backgroundPicture && (
            <Avatar
              src={URL.createObjectURL(communityData.backgroundPicture)}
              alt="Background Preview"
              style={{
                marginTop: "10px",
                borderRadius: "0px",
                width: "150px",
                height: "150px",
              }}
            />
          )}

          <TextField
            fullWidth
            label="Community Name"
            variant="outlined"
            value={communityData.name}
            onChange={(e) =>
              setCommunityData({ ...communityData, name: e.target.value })
            }
          />

          <TextareaAutosize
            minRows={3}
            placeholder="About Us"
            style={{
              width: "100%",
              resize: "vertical",
              fontFamily: "inherit", // Use the default MUI font
              fontSize: "16px", // Set the font size as needed
              marginBottom: "16px", // Add margin to create spacing
            }}
            value={communityData.aboutUs}
            onChange={(e) =>
              setCommunityData({ ...communityData, aboutUs: e.target.value })
            }
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create Community
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreateCommunityForm;
