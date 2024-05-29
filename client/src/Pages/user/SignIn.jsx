import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useGoogleLogin } from "@react-oauth/google";
import * as React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/Logo.jpg";
import { LoginUser } from "../../redux/auth/authServices";
import { setUser } from "../../redux/auth/authSlice";
import { getFollowSuggestions } from "../../redux/user/userServices";
import { IconButton, Popover, Stack } from "@mui/material";
import { Login } from "@mui/icons-material";

const customTheme = createTheme({
  palette: {
    googleColor: {
      main: "#c82c2f",
    },
    silver: {
      main: "#757575",
    },
  },
});

export default function SignIn() {
  const [email, setEmail] = useState("demouser@gmail.com");
  const [password, setPassword] = useState("demo123");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popover_id = open ? "simple-popover" : undefined;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastID = toast.loading("");
    try {
      const response = await LoginUser({
        email,
        password,
      });
      if (response.success === true) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message, {
          id: toastID,
        });
        setEmail("demouser@gmail.com");
        setPassword("demo123");
        dispatch(getFollowSuggestions());
        navigate("/");
      } else {
        toast.error(response.data, {
          id: toastID,
        });
      }
    } catch (error) {
      toast.error("Error Logging In. Please Try Again Later...", {
        id: toastID,
      });
    }
  };

  const googleLoginHelper = async (googleAccessToken) => {
    const toastID = toast.loading("");
    try {
      const response = await LoginUser({ googleAccessToken });
      if (response.success === true) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message, {
          id: toastID,
        });
        dispatch(getFollowSuggestions());
        navigate("/");
      } else {
        toast.error(response.data, {
          id: toastID,
        });
      }
    } catch (error) {
      toast.error("Error Logging In. Please Try Again Later...", {
        id: toastID,
      });
    }
  };

  const googleLoginIn = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleLoginHelper(tokenResponse.access_token);
    },
    onError: () => {
      toast.error("Error logging in with Google Login");
    },
  });
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <Grid
          container
          component="main"
          sx={{ height: "100vh" }}
          bgcolor={"white"}
        >
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={7}
            md={7}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={backgroundImage}
              alt=""
              style={{
                width: "62%",
              }}
            />
          </Grid>

          {/* creating actual form */}
          <Grid
            item
            xs={12}
            sm={5}
            md={3}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                mx: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ m: 1, bgcolor: customTheme.palette.googleColor.main }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <br />

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  mt: 1,
                  "@media (max-width: 600px)": {
                    mt: -1,
                  },
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography>Demo Accounts </Typography>
                  <IconButton
                    aria-describedby={popover_id}
                    variant="contained"
                    onClick={handleClick}
                  >
                    <Login />
                  </IconButton>
                  <Popover
                    id={popover_id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Typography sx={{ p: 2 }}>
                      email: demouser@gmail.com
                      <br />
                      password: demo123
                      <br />
                      email: demouser2@gmail.com
                      <br />
                      password: demo123
                    </Typography>
                  </Popover>
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>

                <Typography
                  sx={{
                    textAlign: "center",
                    mb: 2,
                    color: customTheme.palette.silver.main,
                  }}
                >
                  OR
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => googleLoginIn()}
                  sx={{
                    backgroundColor: customTheme.palette.googleColor.main,
                    "&:hover": {
                      backgroundColor: customTheme.palette.googleColor.main,
                    },
                  }}
                >
                  {" "}
                  <GoogleIcon sx={{ mr: 1 }} /> Continue with Google{" "}
                </Button>
                <Grid container>
                  <Grid item xs sx={{ mt: 1 }}>
                    <Link
                      to={"/forgetpassword"}
                      style={{ color: "#3f50b5", fontSize: "15px" }}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item sx={{ mt: 1, color: "primary" }}>
                    <Link
                      style={{ color: "#3f50b5", fontSize: "15px" }}
                      to={"/SignUp"}
                    >
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
