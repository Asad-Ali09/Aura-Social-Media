import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../redux/auth/authServices";
import toast from "react-hot-toast";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        AURA
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Reset() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const toastID = toast.loading("waiting...");

    if (!password && !confirmPassword) {
      return toast.error("Please fill all fields", { id: toastID });
    }
    if (password !== confirmPassword) {
      return toast.error("Password does not match", { id: toastID });
    }
    try {
      const response = await resetPassword({ password, resetToken });
      if (response.success === true) {
        toast.success(response.data.message, { id: toastID });
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
        return;
      }
      toast.error(response.data.message, { id: toastID });
    } catch (error) {
      toast.error("Can not reset Password", { id: toastID });
    }
  };

  return (
    <Stack
      width={"100%"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "error.dark" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="New Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="ConfirmPassword"
              label="Confirm New password"
              name="ConfirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Stack>
    </Stack>
  );
}
