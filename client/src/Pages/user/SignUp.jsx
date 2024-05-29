import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import backgroundImage from "../../assets/Logo.jpg";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { signUpUser } from "../../redux/auth/authServices";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/auth/authSlice";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { getFollowSuggestions } from "../../redux/user/userServices";

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

const initialFormData = {
  name: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUp() {
  const [formData, setFormData] = useState(initialFormData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // sending data to backend
    const toastID = toast.loading("");
    if (formData.password !== formData.confirmPassword) {
      return toast.error("password does not match", {
        id: toastID,
      });
    }
    try {
      const response = await signUpUser({
        firstName: formData.name,
        lastName: formData.lastname,
        email: formData.email,
        password: formData.password,
      });
      if (response.success === true) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message, {
          id: toastID,
        });
        setFormData(initialFormData);
        dispatch(getFollowSuggestions());
        navigate("/");
      } else {
        toast.error(response.data, {
          id: toastID,
        });
      }
    } catch (error) {
      toast.error("Error Registering. Please Try Again Later...", {
        id: toastID,
      });
    }
  };

  const googleSignUp = async (googleAccessToken) => {
    const toastID = toast.loading("");
    try {
      const response = await signUpUser({ googleAccessToken });
      if (response.success) {
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
      toast.error("Error Registering. Please Try Again Later...", {
        id: toastID,
      });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleSignUp(tokenResponse.access_token);
    },
  });

  return (
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
          component={"form"}
          onSubmit={handleSubmit}
          xs={12}
          sm={5}
          md={4}
          lg={3}
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
              Sign up
            </Typography>
            <br />

            <Box
              sx={{
                mt: 1,
                "@media (max-width: 600px)": {
                  mt: -1,
                },
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="text"
                    label="First Name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={changeData}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="text"
                    label="Last Name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={changeData}
                    autoComplete="lastname"
                  />
                </Grid>
              </Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                type="email"
                id="Email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={changeData}
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
                value={formData.password}
                onChange={changeData}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="confirmPassword"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                value={formData.confirmPassword}
                onChange={changeData}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3, mb: 1 }}
              >
                Sign up
              </Button>
              <Typography
                sx={{
                  textAlign: "center",
                  mb: 1,
                  color: customTheme.palette.silver.main,
                }}
              >
                OR
              </Typography>
              <Button
                variant="contained"
                size="large"
                type="button"
                fullWidth
                onClick={() => googleLogin()}
                sx={{
                  backgroundColor: customTheme.palette.googleColor.main,
                  "&:hover": {
                    backgroundColor: customTheme.palette.googleColor.main, // Set the same background color to prevent color change
                  },
                }}
              >
                Continue with Google <GoogleIcon sx={{ ml: 1 }} />{" "}
              </Button>
              <Stack my={1} alignItems={"flex-end"}>
                <Link to={"/login"} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
