import {
  Add,
  CalendarViewMonth,
  Forum,
  HelpCenter,
  People,
  RssFeed,
  Search,
  Shield,
} from "@mui/icons-material";
import { Stack, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import AuraIcon from "../assets/Logo.jpg";
import AddPost from "./AddPost";
import SearchComp from "./SearchComp";

export default function MiniDrawer() {
  const [drawerWidth, setDrawerWidth] = React.useState(240);
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState(true);
  const tabview = useMediaQuery("(max-width: 800px)");
  const mobileView = useMediaQuery("(max-width: 500px)");

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [openCreatePost, setOpenCreatePost] = React.useState(false);

  React.useEffect(() => {
    if (mobileView) {
      setIsOpen(true);
    } else if (tabview) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [tabview, mobileView]);

  React.useEffect(() => {
    mobileView ? setDrawerWidth("100%") : setDrawerWidth(240);
  }, [mobileView]);

  const drawerItems = [
    { name: "Feed", icon: <RssFeed />, handleClick: () => navigate("/") },
    {
      name: "Search",
      icon: <Search />,
      handleClick: () => setIsSearchOpen(true),
    },
    {
      name: "Create",
      icon: <Add />,
      handleClick: () => setOpenCreatePost(true),
    },
    // {
    //   name: "Community",
    //   icon: <People />,
    //   handleClick: () => navigate("/community"),
    // },
    // {
    //   name: "Create Community",
    //   icon: <People />,
    //   handleClick: () => navigate("/createcommunity"),
    // },
    {
      name: "Messages",
      icon: <Forum />,
      handleClick: () => navigate("/messages"),
    },
    // {
    //   name: "Event Planner",
    //   icon: <CalendarViewMonth />,
    //   handleClick: () => navigate("/calender"),
    // },
    // { name: "Help Center", icon: <HelpCenter /> },
    {
      name: "Privacy Policy",
      icon: <Shield />,
      handleClick: () => navigate("/privacy"),
    },
  ];
  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const closeSearchDialog = () => {
    setIsSearchOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SearchComp open={isSearchOpen} onClose={closeSearchDialog} />
      <CssBaseline />
      {openCreatePost && (
        <AddPost open={openCreatePost} setOpen={setOpenCreatePost} />
      )}
      <Drawer
        anchor={mobileView ? "bottom" : "left"}
        variant="permanent"
        open={isOpen}
        sx={{
          position: mobileView ? "absolute" : "static",
        }}
      >
        <Stack direction={mobileView ? "row" : "column"} width={"100%"}>
          <DrawerHeader>
            {!mobileView && (
              <Stack
                mt={5}
                mb={4}
                ml={2}
                width={"100%"}
                direction={"row"}
                alignItems={"center"}
                spacing={2}
              >
                <Box width={35}>
                  <img width={"100%"} src={AuraIcon} alt="" />
                </Box>
                {isOpen && (
                  <Typography
                    // fontFamily={"Bilbo Swash Caps"}
                    fontFamily={"Cookie"}
                    variant="h3"
                    fontSize={35}
                    color="initial"
                  >
                    AURA
                  </Typography>
                )}
              </Stack>
            )}
          </DrawerHeader>
          <Stack direction={mobileView ? "row" : "column"} width={"100%"}>
            {drawerItems.map((item, ind) => {
              if (mobileView && ind > 4) return;

              return (
                <ListItem
                  onClick={item.handleClick ? item.handleClick : null}
                  disablePadding
                  sx={{ display: "block" }}
                  key={ind}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!mobileView && (
                      <Typography fontSize={14}>{item.name}</Typography>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
}
