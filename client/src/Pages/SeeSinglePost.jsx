import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { IconButton, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../Components/Post";

const postURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts`;

const SeeSinglePost = () => {
  const { postID } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  useEffect(() => {
    const getPost = async () => {
      if (!postID) return;
      try {
        const response = await axios.get(`${postURL}/${postID}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setPost(response.data);
        } else toast.error("error loading post");
      } catch (error) {
        toast.error("network error");
      }
    };
    getPost();
  }, [postID]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!postID) {
    return <>Wrong Page</>;
  }

  return (
    <>
      <Stack
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={"row"}
      >
        <IconButton
          onClick={handleGoBack}
          sx={{ position: "absolute", top: "5%", left: "17%" }}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        {post && (
          <Post
            id={post._id}
            author={post.author}
            likes={post.likes}
            comments={post.comments}
            photos={post.photos}
            content={post.content}
            time={post.createdAt}
          />
        )}
      </Stack>
    </>
  );
};

export default SeeSinglePost;
