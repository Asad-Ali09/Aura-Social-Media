import { Box, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Post from "../Components/Post";
import useRedirectUser from "../hooks/useRedirectUser";

const postURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts`;

const Feed = () => {
  useRedirectUser("/login");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
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
    getFeed();
  }, []);

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
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default Feed;
