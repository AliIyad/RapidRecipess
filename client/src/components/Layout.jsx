import React from "react";
import Navi from "./NavBar";
import "../CSS/Layout.css";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className='app-container'>
      <Navi />
      <main className='main-content'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
