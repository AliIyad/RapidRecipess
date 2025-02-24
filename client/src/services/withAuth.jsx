import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const { user, loading, setLoading, isAuthenticated, verifyTokens } =
      useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      verifyTokens();
    }, []);

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          setTimeout(() => {
            setIsModalOpen(true); // Show modal if not authenticated
          }, 500); // Add a 500ms delay
        } else {
          setIsModalOpen(false); // Hide modal if authenticated
        }
      }
    }, [loading, isAuthenticated, user]);

    // Handle modal close
    const handleModalClose = () => {
      setIsModalOpen(false);
      if (!isAuthenticated) {
        //navigate("/"); // Redirect to home if not authenticated
      }
    };

    if (loading) {
      return <div>Loading authentication status...</div>; // Show loading state
    }

    return (
      <>
        <AuthModal isOpen={isModalOpen} toggleModal={handleModalClose} />
        {isAuthenticated ? <WrappedComponent {...props} /> : null}
      </>
    );
  };
};

export default withAuth;
