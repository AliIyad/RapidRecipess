import React, { createContext, useState, useEffect, useContext } from "react";
import { registerUser, loginUser } from "../services/authService"; // Import the API functions
import Cookies from "js-cookie"; // To handle cookies

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component that will wrap your app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For loading state (to handle auth checks)

  // Check if the user is already authenticated based on stored tokens
  const verifyAuth = async () => {
    setIsLoading(true);
    try {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (accessToken && refreshToken) {
        // Verify the tokens (using your existing API function)
        const response = await axios.get("/auth/verify", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        });

        if (response.status === 200) {
          setUser(response.data); // Set the user data if tokens are valid
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAuthState = async () => {
    setIsLoading(true);
    try {
      await verifyAuth(); // This will check if the user is authenticated using the token in cookies
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle login
  const login = async (credentials) => {
    try {
      const { accessToken, refreshToken } = await loginUser(credentials);
      // Store tokens in cookies after login
      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
      });

      setIsAuthenticated(true);
      verifyAuth(); // Re-verify after login
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      throw error; // Propagate error to be handled in the UI
    }
  };

  // Function to handle registration
  const register = async (userData) => {
    try {
      const { accessToken, refreshToken } = await registerUser(userData);
      // Store tokens in cookies after registration
      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
      });

      setIsAuthenticated(true);
      verifyAuth(); // Re-verify after registration
    } catch (error) {
      console.error("Registration failed:", error);
      setIsAuthenticated(false);
      throw error; // Propagate error to be handled in the UI
    }
  };

  // Function to handle logout
  const logout = () => {
    // Clear cookies on logout
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    verifyAuth();
    verifyAuthState();
  }, []);

  // Context value that will be provided to the rest of the app
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyAuth, // Add verifyAuth to context value so it can be used in components
    verifyAuthState,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
