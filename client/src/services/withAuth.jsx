import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
import AuthModal from "../components/AuthModal";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const auth = getAuth(); // Firebase Auth
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsAuthenticated(true);
          // Optionally, you can fetch the Firebase ID Token if needed
          const token = await getIdToken(firebaseUser);
          console.log("Firebase ID Token:", token); // Handle the token if necessary
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      });

      return () => unsubscribe(); // Clean up the listener on unmount
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
    }, [loading, isAuthenticated]);

    // Handle modal close
    const handleModalClose = () => {
      setIsModalOpen(false);
      if (!isAuthenticated) {
        // Optionally navigate to home or login page if user is not authenticated
        navigate("/"); // Redirect to home or a login page if not authenticated
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
