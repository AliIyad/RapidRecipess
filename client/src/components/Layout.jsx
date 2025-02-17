import React from "react";
import Navi from "./NavBar";
import "../CSS/Layout.css";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navi />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
