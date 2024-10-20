import {
  ChatBubbleOutline,
  ContentCopy,
  MoreVert,
  Share,
} from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CardHeader,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  Stack,
  TextField,
  Typography,
  styled,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth/authSlice";

const CommentButton = styled(Button)(({ theme }) => ({
  color: theme.palette.mygray.main,
  borderColor: theme.palette.mygray.main,
}));

function containsOnlySpaces(inputString) {
  const regex = /^\s*$/;
  return regex.test(inputString);
}

const CommentButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  color: theme.palette.mygray.main,
  borderColor: theme.palette.mygray.main,
  borderBlock: "1px solid",
  paddingBlock: 4,
  marginBlock: 3,
}));

const PostBox = styled(Box)({
  padding: 1,
  borderRadius: "10px",
  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
});

const userURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users`;
const postURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts`;

const Post = ({
  id,
  author,
  likes,
  comments,
  photos,
  content,
  time,
  handleDeletePost,
}) => {
  const [isLiked, setLiked] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [totalLikes, setTotalLikes] = useState(likes.length);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);

  const [displayComments, setDisplayComments] = useState(comments);
  const totalComments = comments.length;

  const [user, setUser] = useState({});

  const myUser = useSelector(selectUser);

  useEffect(() => {
    const getUser = async () => {
      if (!author || author === "") {
        return;
      }
      try {
        const response = await axios.get(`${userURL}/getuser/${author}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser(response.data.data);
        }
      } catch (error) {
        toast.error("Error loading user...");
      }
    };
    getUser();
  }, [author]);

  const handleCommentDialogOpen = () => {
    setIsCommentDialogOpen(true);
  };

  const handleShareDialogOpen = () => {
    setIsShareDialogOpen(true);
  };

  const handleCommentDialogClose = () => {
    setIsCommentDialogOpen(false);
  };
  const handleShareDialogClose = () => {
    setIsShareDialogOpen(false);
  };

  const handleMenuOpen = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  useEffect(() => {
    likes.some((likeID) => likeID === myUser._id)
      ? setLiked(true)
      : setLiked(false);
  }, [myUser, likes]);

  const handleCommentSubmit = async () => {
    if (!newComment || containsOnlySpaces(newComment)) {
      toast.error("please enter a valid comment");
    }

    try {
      const response = await axios.post(
        `${postURL}/comment/${id}`,
        { text: newComment },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setDisplayComments(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("error posting comment");
      }
    } catch (error) {
      toast.error("error uploading comment");
      console.log(error);
    }
    setNewComment("");
  };

  const handleLikeToggle = async () => {
    //req to backend
    try {
      if (isLiked) {
        const response = await axios.post(
          `${postURL}/unlike/${id}`,
          {},
          { withCredentials: true }
        );
        if (response.status === 200) {
          setLiked(false);
          setTotalLikes((prev) => prev - 1);
        }
      } else {
        const response = await axios.post(
          `${postURL}/like/${id}`,
          {},
          { withCredentials: true }
        );
        if (response.status === 200) {
          setLiked(true);
          setTotalLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const textFieldRef = React.useRef(null);

  const copyToClipboard = () => {
    if (textFieldRef.current) {
      navigator.clipboard.writeText(`${window.location.origin}/seepost/${id}`);
      toast.success("copied successfully");
    }
  };

  return (
    <>
      <PostBox mt={0} width={[330, 400, 400, 550]}>
        <Stack alignItems={"flex-start"} paddingInline={2} paddingBottom={2}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <CardHeader
              sx={{ paddingLeft: 0 }}
              avatar={<Avatar alt={"alt.."} src={user.profilePicture} />}
              title={`${user.firstName} ${user.lastName}`}
              subheader={moment(time).fromNow()}
            />
            {myUser._id === author && (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={moreMenuAnchor}
                  open={Boolean(moreMenuAnchor)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                    }}
                  >
                    Edit Post
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleDeletePost(id);
                      handleMenuClose();
                    }}
                  >
                    Delete Post
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
          <Typography>{content}</Typography>
          <Box width={[305, 365, 365, 515]}>
            <img
              src={photos && photos[0]?.url}
              style={{ objectFit: "contain", height: "100%", width: "100%" }}
              alt=""
            />
          </Box>
          <CommentButtonGroup fullWidth variant="string">
            <CommentButton
              startIcon={
                isLiked ? (
                  <FavoriteIcon style={{ color: "red" }} />
                ) : (
                  <FavoriteBorderIcon />
                )
              }
              onClick={handleLikeToggle}
            >
              {totalLikes} Likes
            </CommentButton>
            <CommentButton
              startIcon={<ChatBubbleOutline />}
              onClick={handleCommentDialogOpen}
            >
              {totalComments} Comments
            </CommentButton>
            <CommentButton
              onClick={handleShareDialogOpen}
              startIcon={<Share />}
            >
              Share
            </CommentButton>
          </CommentButtonGroup>
        </Stack>
      </PostBox>

      {/* Comments Dialog */}
      <Dialog
        open={isCommentDialogOpen}
        onClose={handleCommentDialogClose}
        fullWidth
      >
        <DialogContent sx={{ height: "100vh" }}>
          <DialogContentText variant="h3" color={"black"}>
            Comments
          </DialogContentText>

          <Stack direction={"row"} marginTop={3} marginBottom={5}>
            {/* Input field for new comment */}
            <TextField
              label="Add a comment"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            {/* Button to submit a new comment */}
            <IconButton
              onClick={handleCommentSubmit}
              variant="contained"
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </Stack>

          <Stack spacing={4}>
            {/* Display existing comments */}
            {displayComments &&
              displayComments.map((comment) => (
                <Stack
                  key={comment._id}
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                >
                  <Avatar src={comment.author?.profilePicture}>
                    {comment.author?.firstName}
                  </Avatar>
                  <Typography key={comment._id}>
                    <strong>
                      {comment.author.firstName} {comment.author.lastName}:
                    </strong>{" "}
                    {comment.text}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={isShareDialogOpen}
        onClose={handleShareDialogClose}
        fullWidth
      >
        <DialogContent sx={{ height: "50vh" }}>
          <DialogContentText variant="h4" color={"black"}>
            Share Post
          </DialogContentText>

          <Stack direction={"row"} marginTop={3} marginBottom={5}>
            {/* Input field for new comment */}
            <TextField
              ref={textFieldRef}
              disabled
              value={`${window.location.origin}/seepost/${id}`}
              label="Add a comment"
              variant="outlined"
              fullWidth
            />
            {/* Button to submit a new comment */}
            <IconButton
              onClick={copyToClipboard}
              variant="contained"
              color="primary"
            >
              <ContentCopy />
            </IconButton>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
Post.propTypes = {
  id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  likes: PropTypes.array.isRequired,
  comments: PropTypes.array.isRequired,
  photos: PropTypes.array,
  content: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  handleDeletePost: PropTypes.func,
};

export default Post;
