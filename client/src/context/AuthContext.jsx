import React, { createContext, useState, useContext } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
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
