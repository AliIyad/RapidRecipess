import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyTokens = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      console.log("Access Token:", accessToken); // Debugging line
      console.log("Refresh Token:", refreshToken); // Debugging line

      if (!accessToken || !refreshToken) {
        throw new Error("No tokens found");
      }

      const response = await axios.get("/auth/protected", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      });

      const newAccessToken = response.headers["x-access-token"];
      if (newAccessToken) {
        Cookies.set("accessToken", newAccessToken, {
          expires: 15 / (24 * 60), // 15 minutes
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      }

      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token verification failed:", error);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    verifyTokens();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Logging in with:", { email, password }); // Log the credentials
      const response = await loginUser({ email, password }); // Call loginUser  directly
      console.log("Login response:", response); // Log the response

      const { accessToken, refreshToken, user } = response; // Destructure the response

      // Set cookies
      Cookies.set("accessToken", accessToken, {
        expires: 15 / (24 * 60),
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("refreshToken", refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      // Update user state
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error); // Log the error
      throw error; // Rethrow the error for handling in the component
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await registerUser({ username, email, password });
      const { accessToken, refreshToken, user } = response;

      // Set cookies
      Cookies.set("accessToken", accessToken, {
        expires: 15 / (24 * 60),
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("refreshToken", refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      // Update user state
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        verifyTokens,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
