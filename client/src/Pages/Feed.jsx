import { Box, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Post from "../Components/Post";
import useRedirectUser from "../hooks/useRedirectUser";
import { deletePost } from "../redux/posts/postServices";

const postURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts`;

const Feed = () => {
  useRedirectUser("/login");

  const [posts, setPosts] = useState([]);

  const getFeed = async () => {
    try {
      const response = await axios.post(
        `${postURL}/feed`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setPosts(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Loading Posts...");
    }
  };
  useEffect(() => {
    getFeed();
  }, []);

  const handleDeletePost = async (postId) => {
    const resp = await deletePost(postId);
    if (resp === true) {
      getFeed();
    } else {
      toast.error("Error deleteing Post");
    }
  };

  return (
    <Box width={"100%"} bgcolor={"mygray.bg"}>
      <Stack alignItems={"center"} p={6} spacing={6}>
        {/* <Stack
          width={["100%", "100%", "80%", "80%", "65%"]}
          direction={"row"}
          spacing={3}
          alignItems={"center"}
          justifyContent={"center"}
        >
         

          <Status />
        </Stack> */}

        {posts.map((post) => {
          return (
            <Post
              key={post._id}
              id={post._id}
              author={post.author}
              likes={post.likes}
              comments={post.comments}
              photos={post.photos}
              content={post.content}
              time={post.createdAt}
              handleDeletePost={handleDeletePost}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default Feed;
