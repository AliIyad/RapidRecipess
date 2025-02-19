import axios from "axios";

const API_URL = "http://localhost:6969/auth";

// Add this to your axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is crucial for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await axios.get(`${API_URL}/refresh_token`, { withCredentials: true });
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during registration";
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during login";
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const response = await api.post("/send-password-reset-email", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error sending password reset email";
  }
};

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
