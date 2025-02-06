import React from "react";
import Navi from "./NavBar";
import SideBar from "./SideBar";

import "../CSS/Layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <Navi />
      <SideBar />
      {children}
    </>
  );
};

export default Layout;
