import React, { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const accessToken = Cookies.get("accessToken");
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log("withAuth executing - AccessToken:", accessToken);

    useEffect(() => {
      if (!accessToken) {
        console.log("User not authenticated - Opening modal");
        setIsModalOpen(true);
        // Uncomment the navigate below if you want to redirect
        // navigate("/home");
      }
    }, [accessToken, navigate]);

    if (!accessToken && isModalOpen) {
      console.log("Rendering AuthModal");
      return (
        <AuthModal
          isOpen={isModalOpen}
          toggleModal={() => setIsModalOpen(false)}
        />
      );
    }

    console.log("Rendering WrappedComponent");
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
