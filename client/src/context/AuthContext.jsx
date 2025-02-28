import React, { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
import { loginUser, registerUser, logoutUser } from "../services/authService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await getIdToken(user);
        // Get the ID token result to check for custom claims
        const tokenResult = await user.getIdTokenResult();
        setUser({
          id: user.uid,
          email: user.email,
          username: user.displayName,
          role: tokenResult.claims.admin ? 'admin' : 'user'
        });
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const idToken = await getIdToken(user);
      setToken(idToken);
    }
    return response;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const idToken = await getIdToken(user);
      setToken(idToken);
    }
    return response;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
