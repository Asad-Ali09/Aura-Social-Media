import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const commURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/community`;

const Community = () => {
  const verySmallScreen = useMediaQuery("(max-width:300px)");
  const somwWhatSmallScreen = useMediaQuery("(max-width:600px)");
  const mdScreen = useMediaQuery("(max-width:900px)");
  const mobileScreen = useMediaQuery("(max-width:1190px)");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const [community, setCommunity] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const getCommunity = async () => {
      try {
        const response = await axios.get(`${commURL}/${id}`);
        if (response.status !== 200) {
          return toast.error("error loading community. try reloading page...");
        }
        console.log(response.data);
        setCommunity(response.data.community);
      } catch (error) {
        return toast.error("error loading community. try reloading page...");
      }
    };
    getCommunity();
  }, []);

  const handleStatusDialogOpen = () => {
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setAttachedMedia(null);
    setMediaPreview(null);
  };

  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    setAttachedMedia(file);

    // For images, create a preview URL
    if (file && file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    } else {
      // For videos, you might need additional handling
      setMediaPreview(null);
    }
  };

  const handleRemoveMedia = () => {
    setAttachedMedia(null);
    setMediaPreview(null);
  };

  const handlePostStatus = () => {
    // Handle posting logic here
    handleStatusDialogClose();
  };
  return (
    <Container component="main" maxWidth="100%">
      <Stack
        position={"relative"}
        sx={{
          alignItems: "center",
          width: "100%",
          backgroundImage:
            'url("https://img.freepik.com/free-photo/red-black-brush-stroke-banner-background-perfect-canva_1361-3597.jpg?w=1380&t=st=1702326586~exp=1702327186~hmac=1368b2702db5fbf9dd4c925305ad1ce1576bbe43630fac13aad5233331ef8301")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "40vh",
        }}
      >
        {mobileScreen ? (
          <Stack
            alignItems={"center"}
            direction={"column"}
            position={"absolute"}
            width={"100%"}
            top={"80%"}
          >
            <Avatar
              alt="User Avatar"
              src="https://image.winudf.com/v2/image1/bmV0LndsbHBwci5ib3lzX3Byb2ZpbGVfcGljdHVyZXNfc2NyZWVuXzBfMTY2NzUzNzYxN18wOTk/screen-0.webp?fakeurl=1&type=.webp"
              sx={{ width: 200, height: 200 }}
            />

            <Typography variant="h4" sx={{ marginTop: 2 }}>
              Softec
            </Typography>

            <Stack direction={"column"} width={"100%"} marginTop={2}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                sx={{ marginTop: 1 }}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                sx={{ marginTop: 1 }}
                onClick={handleStatusDialogOpen}
              >
                Add Status
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                sx={{ marginTop: 1 }}
              >
                Post an Event
              </Button>
            </Stack>
          </Stack>
        ) : (
          // Desktop view
          <Stack
            alignItems={"center"}
            direction={"row"}
            position={"absolute"}
            width={"100%"}
            top={"75%"}
          >
            <Avatar
              alt="User Avatar"
              src="https://image.winudf.com/v2/image1/bmV0LndsbHBwci5ib3lzX3Byb2ZpbGVfcGljdHVyZXNfc2NyZWVuXzBfMTY2NzUzNzYxN18wOTk/screen-0.webp?fakeurl=1&type=.webp"
              sx={{ width: 200, height: 200 }}
            />

            {/* Stack for Name and Buttons */}
            <Stack
              direction={"row"}
              width={"100%"}
              marginTop={10}
              marginLeft={1}
              alignSelf={"center"}
              justifyContent={"space-between"}
            >
              <Typography variant="h4" sx={{ marginTop: 2 }}>
                Softec
              </Typography>

              {/* Stack for Buttons */}
              <Stack
                direction={"row"}
                width={"50%"}
                justifyContent={"space-evenly"}
                flexWrap={"wrap"}
              >
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  onClick={handleStatusDialogOpen}
                >
                  Add Status
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  Post an Event
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>

      <Grid container spacing={3} sx={{ marginTop: mobileScreen ? 40 : 14 }}>
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
              deserunt repellendus nemo consequatur eius beatae sapiente nisi
              sed cupiditate hic velit, perspiciatis quae commodi dignissimos
              expedita. Fugiat, vitae? Voluptates nobis laborum porro
              consequuntur voluptatibus minus accusantium dolores alias
              reiciendis blanditiis.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ padding: 3 }}></Paper>
        </Grid>
      </Grid>
      <Dialog
        open={statusDialogOpen}
        onClose={handleStatusDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Post a Status</DialogTitle>
        <DialogContent sx={{ height: "50vh" }}>
          <input
            accept="image/*, video/*"
            id="media-upload"
            type="file"
            onChange={handleMediaChange}
            style={{ display: "none" }}
          />
          <label htmlFor="media-upload">
            <Button
              variant="contained"
              component="span"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Attach Media
            </Button>
          </label>

          {attachedMedia && (
            <Stack direction="row" alignItems="center" mt={2}>
              <Typography variant="h6" sx={{ marginRight: 1 }}>
                {attachedMedia.name}
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleRemoveMedia}
              >
                Remove
              </Button>
            </Stack>
          )}
          {mediaPreview && (
            <img
              src={mediaPreview}
              alt="Media Preview"
              style={{ marginTop: 10 }}
              width={300}
              height={300}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose}>Cancel</Button>
          <Button onClick={handlePostStatus} color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Community;
