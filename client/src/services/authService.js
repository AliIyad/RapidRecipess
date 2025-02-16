import axios from "axios";

const API_URL = "http://localhost:6969/auth";

// ✅ Global Axios Instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ Ensures cookies are sent
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during registration";
  }
};

// ✅ Login User (Fixed withCredentials)
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during login";
  }
};

// ✅ Send Password Reset Email
export const sendPasswordResetEmail = async (email) => {
  try {
    const response = await api.post("/send-password-reset-email", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error sending password reset email";
  }
};

// ✅ Reset Password
export const resetPassword = async (id, token, newPassword) => {
  try {
    const response = await api.post(`/reset-password/${id}/${token}`, {
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error resetting password";
  }
};

export default api;
