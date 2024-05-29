import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const commURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/community`;

const CommunitiesPage = () => {
  const [followStatus, setFollowStatus] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const response = await axios.get(commURL, { withCredentials: true });

        if (response.status !== 200) {
          return toast.error("Error loading communities.Please reaload page");
        }
        // console.log(response.data.communities);
        setCommunities(response.data.communities);
      } catch (error) {
        toast.erro("error loading communities.Please reaload page");
      }
    };
    getCommunities();
  }, []);

  const handleFollowClick = (communityName, isAlreadyJoined) => {
    if (!isAlreadyJoined) {
      // If not already followed, update the follow status and set dialog state
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [communityName]: true,
      }));
      setSelectedCommunity(communityName);
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleImageClick = (communityName) => {
    console.log(`Clicked on image of ${communityName}`);
  };

  return (
    <>
      <Typography variant="h1" color="initial"></Typography>
      <Stack
        width={"100%"}
        direction="row"
        alignItems="flex-start"
        sx={{ textAlign: "center", marginTop: 4, padding: 2 }}
        flexWrap={"wrap"}
      >
        {communities.map((community, index) => (
          <Stack
            onClick={() => navigate(`/community/${community._id}`)}
            key={index}
            sx={{
              marginBottom: 4,
              padding: 2,
              textAlign: "center",
              width: "18%", // Adjust the width as needed
              "@media (max-width: 600px)": {
                width: "100%", // Full width on small screens
              },
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
            marginLeft={4}
          >
            <Avatar
              alt={community.name}
              src={community.profile}
              sx={{ width: "100%", height: "auto", cursor: "pointer" }}
              onClick={() => handleImageClick(community.name)}
            />
            <Typography variant="h6" sx={{ marginTop: 4 }}>
              {community.name}
            </Typography>
            <Button
              variant="contained"
              sx={{
                marginTop: 1,
                cursor: community.isAlreadyJoined ? "not-allowed" : "pointer",
              }}
              onClick={() =>
                handleFollowClick(community.name, community.isAlreadyJoined)
              }
              disabled={
                community.isAlreadyJoined || followStatus[community.name]
              }
            >
              {followStatus[community.name]
                ? "Request Sent"
                : community.isAlreadyJoined
                ? "Joined"
                : "Join"}
            </Button>
          </Stack>
        ))}
      </Stack>

      {/* Unfollow Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{`Request Sent for ${selectedCommunity}`}</DialogTitle>
        <DialogContent>
          <Typography>
            Your request to join {selectedCommunity} has been sent.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommunitiesPage;
