import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import { useNavigate } from "react-router-dom"; // Use Redirect to navigate the user if unauthenticated

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, verifyAuthState } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      if (!isAuthenticated && !isLoading) {
        setIsModalOpen(true); // Open modal if not authenticated
      } else {
        setIsModalOpen(false); // Close modal if authenticated
      }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
      return <div>Loading...</div>; // Show loading screen while checking auth
    }

    if (!isAuthenticated) {
      return navigate("/"); // Redirect to homepage or login page if not authenticated
    }

    return (
      <>
        <AuthModal isOpen={isModalOpen} toggleModal={setIsModalOpen} />
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withAuth;
