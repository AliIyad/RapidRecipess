import axios from "axios";

const API_URL = "http://localhost:6969/auth";

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure cookies are included in requests
  credentials: 'include'
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await api.post("/refresh_token");
        
        // If we get a new access token, retry the original request
        if (response.data.accessToken) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, throw the original error
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error during registration" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error during login" };
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error during logout" };
  }
};

export const verifyAuth = async (accessToken, refreshToken) => {
  try {
    const response = await api.get("/protected", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error verifying authentication" };
  }
};

export default api;
