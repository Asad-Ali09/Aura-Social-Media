import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const userURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users`;

export default function UserSearchDialog({ open, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(0);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length === 0) {
      toast.error("Please enter a search query");
      return;
    }

    try {
      const response = await axios.get(
        `${userURL}/searchusers?searchString=${searchQuery}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      toast.error("Network error. Please try again later...");
    }
  };

  const handleClose = () => {
    setSearchQuery(""); // Clear search query on close
    setSearchResults(0); // Clear search results on close
    onClose();
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleUserClick = (userId) => {
    handleClose();
    navigate(`/profile/${userId}`); // Redirect to user profile
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-container": {
          marginTop: "-3%",
        },
      }}
    >
      <DialogTitle>User Search</DialogTitle>
      <DialogContent sx={{ height: "70vh" }}>
        <TextField
          sx={{ marginTop: "5px", width: "100%" }}
          label="Search User"
          placeholder="Enter username or email"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onKeyDown={handleEnter}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {searchResults.length > 0 ? (
          <List>
            {searchResults.map((user) => (
              <ListItem
                key={user._id}
                button
                sx={{ marginTop: "5px" }}
                onClick={() => handleUserClick(user._id)}
              >
                <ListItemAvatar>
                  <Avatar alt={user.firstName} src={user.profilePicture} />
                </ListItemAvatar>
                <ListItemText primary={`${user.firstName} ${user.lastName}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          searchResults.length === 0 && (
            <Typography
              variant="h6"
              textAlign={"center"}
              marginTop={5}
              color="initial"
            >
              No Users Found
            </Typography>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
