import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Error() {
  const Navigate = useNavigate();
  const mobileScreen = useMediaQuery("(min-width:500px)");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        marginInline: "auto",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={mobileScreen ? 6 : 12}>
            <Typography variant="h1">Oops...! 404</Typography>
            <Typography variant="h6">
              The page you’re looking for doesn’t exist.
            </Typography>
            <Button
              variant="contained"
              sx={{ marginTop: "20px" }}
              onClick={() => {
                Navigate("/");
              }}
            >
              Back Home
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100%",
              // Optionally, you can add more specific styles based on the media query result
            }}
          >
            {mobileScreen && (
              <img
                src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
                alt=""
                width="100%"
                height="auto"
              />
            )}
          </Grid>
        </Grid>
      </Container>
       
    </Box>
  );
}
