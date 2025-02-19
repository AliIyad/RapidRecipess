import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { loginUser, registerUser } from "../services/authService";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const verifyTokens = async () => {
    try {
      // Check for both tokens
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (!accessToken || !refreshToken) {
        throw new Error("No tokens found");
      }

      // Verify tokens with backend
      const response = await axios.get("/auth/protected", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      });

      // Update cookies from response if refreshed
      const newAccessToken = response.headers["x-access-token"];
      if (newAccessToken) {
        Cookies.set("accessToken", newAccessToken, {
          expires: 15 / (24 * 60), // 15 minutes
          secure: true,
          sameSite: "strict",
        });
      }

      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      // Clear invalid tokens
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyTokens();
  }, []);

  const login = async (email, password) => {
    try {
      const { accessToken, refreshToken } = await loginUser({
        email,
        password,
      });

      // Set cookies client-side
      Cookies.set("accessToken", accessToken, {
        expires: 15 / (24 * 60), // 15 minutes
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("refreshToken", refreshToken, {
        expires: 7, // 7 days
        secure: true,
        sameSite: "strict",
      });

      await verifyTokens();
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const { accessToken, refreshToken } = await registerUser({
        username,
        email,
        password,
      });

      Cookies.set("accessToken", accessToken, {
        expires: 15 / (24 * 60),
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("refreshToken", refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      await verifyTokens();
      return true;
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
        isLoading,
        login,
        register,
        logout,
        verifyTokens,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
