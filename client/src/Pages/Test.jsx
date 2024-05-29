import React from "react";
import Post from "../Components/Post";
import AddPost from "../Components/AddPost";
import { Box, Stack } from "@mui/material";

const Test = () => {
  return (
    <Box width={"100%"} bgcolor={"mygray.bg"}>
      <Stack alignItems={"center"} p={6} spacing={6}>
        <Box width={["100%", "100%", "80%", "80%", "65%"]}>
          <AddPost />
        </Box>
        <Post />
        <Post />
      </Stack>
    </Box>
  );
};

export default Test;
