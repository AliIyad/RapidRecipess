import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";
import Cookies from "js-cookie";

const AuthContext = createContext();

const fetchUser = () => {
  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        try {
          const response = await axios.get("/auth/protected", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, []);
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      Cookies.set("accessToken", response.token);
      Cookies.set("refreshToken", response.refreshToken);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await registerUser({ username, email, password });
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Registration failed:", error);
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
      value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default { AuthContext, AuthProvider };
