import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import { Stack } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-hot-toast";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { createPost, getMyPosts } from "../redux/posts/postServices";

export default function AddPost({ open, setOpen }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();

  const handleClose = () => {
    setImage(null);
    setText("");
    setOpen(false);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    const imageURL = URL.createObjectURL(selectedImage);

    setImage({ file: selectedImage, URL: imageURL });
  };

  const handleUpload = async () => {
    const toastID = toast.loading("uploading...");
    if (!image || !image.file) {
      toast.error("Please Provide an image", { id: toastID });
    }

    const formData = new FormData();

    formData.append("file", image.file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET_KEY);
    const cloudName = import.meta.env.VITE_UPLOAD_CLOUD_NAME;
    try {
      const uploadImage = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData
      );
      if (uploadImage.status < 200 || uploadImage.status >= 300) {
        return toast.error("Error uploading Image. Please Try Again Later...", {
          id: toastID,
        });
      }

      const postData = {
        content: text,
        photos: [{ url: uploadImage.data.secure_url }],
      };
      const response = await createPost(postData);
      if (response.success === true) {
        dispatch(getMyPosts());
        toast.success(response.data.message, { id: toastID });
        handleClose();
        return;
      }
      toast.error(response.data, { id: toastID });
    } catch (error) {
      toast.error("Error uploading Image. Please Try Again Later", {
        id: toastID,
      });
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>New Post</DialogTitle>
        <DialogContent>
          <Stack
            // mb={4}
            width={"100%"}
            bgcolor={"bg.main"}
            p={1}
            pt={2}
            borderRadius={"10px"}
            boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="post-text">What's on your mind</InputLabel>
              <Input
                id="post-text"
                multiline
                maxRows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    {text.length}/300
                  </InputAdornment>
                }
                sx={{
                  fontSize: "1rem",
                  "@media (max-width: 600px)": {
                    fontSize: "0.8rem",
                  },
                }}
              />
            </FormControl>
            <Stack
              alignItems={"center"}
              justifyContent={"flex-end"}
              direction={"row"}
              spacing={2}
              margin={1}
            >
              <Stack alignItems={"center"}>
                {image && (
                  <>
                    <img
                      src={image.URL}
                      alt="Selected"
                      style={{
                        maxWidth: "20%",
                        maxHeight: "20%",
                        marginTop: "10px",
                        marginLeft: "auto",
                      }}
                    />
                    <Typography
                      sx={{ marginLeft: "auto", fontSize: "0.8rem" }}
                      variant="body2"
                    >
                      {image.file.name}{" "}
                    </Typography>
                  </>
                )}
              </Stack>
              <Stack direction={"row"}>
                <input
                  accept="image/*"
                  id="upload-image"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  // sx={{ mt: "50px" }}
                />
                <label htmlFor="upload-image">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <AddPhotoAlternateIcon />
                  </IconButton>
                </label>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpload}>Post</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
