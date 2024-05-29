import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

export default function Loader() {
  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          size: "100%",
        }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
