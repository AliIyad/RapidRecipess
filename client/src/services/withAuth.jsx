import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const { user, loading, isAuthenticated } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle auth state changes
    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          setIsModalOpen(true); // Show modal if not authenticated
        } else {
          setIsModalOpen(false); // Hide modal if authenticated
        }
      }
    }, [loading, isAuthenticated]);

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
