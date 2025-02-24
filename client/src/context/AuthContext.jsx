import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { loginUser, registerUser, verifyAuth } from "../services/authService";

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

      if (!accessToken || !refreshToken) {
        setLoading(false);
        return;
      }

      const response = await verifyAuth(accessToken, refreshToken);

      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
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
    const onLoadAuthCheck = async () => {
      const storedAuthState = localStorage.getItem("authState");
      if (storedAuthState) {
        const { user, isAuthenticated } = JSON.parse(storedAuthState);
        if (isAuthenticated) {
          setUser(user);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
      }
      await verifyTokens();
    };
    onLoadAuthCheck();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const storeAuthState = {
        user: response.user,
        isAuthenticated: true,
      };
      localStorage.setItem("authState", JSON.stringify(storeAuthState));
      if (response.accessToken && response.refreshToken) {
        Cookies.set("accessToken", response.accessToken, { path: "/" });
        Cookies.set("refreshToken", response.refreshToken, { path: "/" });
      }

      if (response.user) {
        console.log("Login successful:", response);
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);

      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
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
