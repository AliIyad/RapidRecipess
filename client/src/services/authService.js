import axios from "axios";

const API_URL = "http://localhost:6969/auth";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during registration";
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during login";
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/send-password-reset-email`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error sending password reset email";
  }
};

export const resetPassword = async (id, token, newPassword) => {
  try {
    const response = await axios.post(
      `${API_URL}/reset-password/${id}/${token}`,
      { newPassword }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error resetting password";
  }
};
