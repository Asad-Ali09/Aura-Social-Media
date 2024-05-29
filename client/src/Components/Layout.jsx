import React, { useEffect } from "react";
import Sidebar from "./SideNav"; // Assume you have a Sidebar component
import RightBar from "./RightBar";

const Layout = ({ children }) => {
  // const exception = ["/signin", "/signup"];
  // // Check if the current route is the exception

  // const isExceptionPage = exception.includes(
  //   window.location.pathname.toLocaleLowerCase()
  // );

  // Render the component on every page except the exception page
  return (
    <>
      <Sidebar />
      <>{children}</>
      <RightBar />
    </>
  );
};

export default Layout;
