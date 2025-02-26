import axios from "axios";
import cookies from "js-cookie";

const API_URL = "http://localhost:6969/";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});

// Add a request interceptor to dynamically set the Authorization header
api.interceptors.request.use((config) => {
  const token = cookies.get("accessToken");

  console.log(token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle token refreshing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post(
          "/auth/refresh_token",
          {},
          {
            withCredentials: true,
          }
        );

        if (response.data.accessToken) {
          cookies.set("accessToken", response.data.accessToken, { path: "/" });
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error during registration" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error during login" };
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
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
        "x-refresh-token": refreshToken,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error verifying authentication" };
  }
};

export default api;
