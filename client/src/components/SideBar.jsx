import React from "react";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const getSidebarContent = () => {
    switch (location.pathname) {
      case "/home":
        return <div>Home Sidebar Content</div>;
      case "/about":
        return <div>About Sidebar Content</div>;
      case "/contact":
        return <div>Contact Sidebar Content</div>;
      default:
        return <div>Default Sidebar Content</div>;
    }
  };

  return <div className='sidebar'>{getSidebarContent()}</div>;
};

export default Sidebar;
