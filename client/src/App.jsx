import { Box, Stack } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout";
import SideNav from "./Components/SideNav";
import ChatPage from "./Pages/Chat";
import Community from "./Pages/Community";
import CommunityList from "./Pages/CommunityList";
import CreateCommunity from "./Pages/CreateCommunity";
import Feed from "./Pages/Feed";
import NotFound from "./Pages/NotFound";
import PrivacyPolicy from "./Pages/Privacy";
import SeeEvents from "./Pages/SeeEvents";
import SeeSinglePost from "./Pages/SeeSinglePost";
import EditProfile from "./Pages/user/EditProfile";
import ForgetPassword from "./Pages/user/ForgetPassword";
import OthersProfile from "./Pages/user/OthersProfile";
import Profile from "./Pages/user/Profile";
import ResetPassword from "./Pages/user/Reset";
import SignIn from "./Pages/user/SignIn";
import SignUp from "./Pages/user/SignUp";
import { getFollowSuggestions } from "./redux/user/userServices";

function App() {
  const dispatch = useDispatch();
  dispatch(getFollowSuggestions());

  return (
    <>
      <Box bgcolor={"mygray.bg"}>
        <Router>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            minHeight={"100vh"}
          >
            <Routes>
              {/* User & Auth Pages */}
              <Route path="/" element={<Layout children={<Feed />} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route
                path="/resetpassword/:resetToken"
                element={<ResetPassword />}
              />
              <Route
                path="/editprofile"
                element={<Layout children={<EditProfile />} />}
              />
              <Route
                path="/profile"
                element={
                  <>
                    <SideNav />
                    <Profile />
                  </>
                }
              />
              <Route
                path="/profile/:userID"
                element={<Layout children={<OthersProfile />} />}
              />

              <Route
                path={"/seepost/:postID"}
                element={<Layout children={<SeeSinglePost />} />}
              />

              <Route path="/messages" element={<ChatPage />} />

              {/* Calender */}
              <Route
                path="/calender"
                element={<Layout children={<SeeEvents />} />}
              />

              <Route
                path="/community"
                element={
                  <>
                    <SideNav />
                    <CommunityList />
                  </>
                }
              />

              <Route
                path="/community/:id"
                element={
                  <>
                    <SideNav />
                    <Community />
                  </>
                }
              />

              <Route
                path="/privacy"
                element={<Layout children={<PrivacyPolicy />} />}
              />

              <Route
                path="/createcommunity"
                element={
                  <>
                    <SideNav />
                    <CreateCommunity />
                  </>
                }
              />

              {/* Not Found 404 */}
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </Stack>
        </Router>
        <Toaster />
      </Box>
    </>
  );
}

export const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;
export default App;
