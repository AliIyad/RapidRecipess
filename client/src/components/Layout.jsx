import React from "react";
import Navi from "./NavBar";
import SideBar from "./SideBar";

import "../CSS/Layout.css";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navi />
      <SideBar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
