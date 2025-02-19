import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import Cookies from "js-cookie";

const withAuth = (WrappedComponent) => {
  function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, verifyTokens } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    // Check cookies directly on mount
    useEffect(() => {
      const checkAuth = async () => {
        const hasTokens =
          Cookies.get("accessToken") && Cookies.get("refreshToken");
        if (hasTokens) {
          await verifyTokens();
        }
        setInitialCheckDone(true);
      };
      checkAuth();
    }, [verifyTokens]);

    useEffect(() => {
      if (!isLoading && initialCheckDone) {
        if (!isAuthenticated) {
          setIsModalOpen(true);
        } else {
          setIsModalOpen(false);
        }
      }
    }, [isAuthenticated, isLoading, initialCheckDone]);

    const handleModalClose = () => {
      setIsModalOpen(false);
      if (!isAuthenticated) {
        //navigate("/");
      }
    };

    if (!initialCheckDone || isLoading) {
      return <div className='loading-screen'>Checking authentication...</div>;
    }

    return (
      <>
        <AuthModal
          isOpen={isModalOpen && !isAuthenticated}
          toggleModal={handleModalClose}
        />
        {isAuthenticated && <WrappedComponent {...props} />}
      </>
    );
  }

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthenticatedComponent;
};

export default withAuth;
