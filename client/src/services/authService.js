import axios from "axios";
import { app } from "../../firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach Firebase token to requests using context
api.interceptors.request.use(
  async (config) => {
    // Get current user token
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Firebase Registration
export const registerUser = async ({ email, password, username }) => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await userCredential.user.updateProfile({ displayName: username });

  const idToken = await userCredential.user.getIdToken();
  const response = await api.post("/auth/register", { idToken });

  return response.data;
};

// Firebase Login
export const loginUser = async ({ email, password }) => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const idToken = await userCredential.user.getIdToken();
  const response = await api.post("/auth/login", { idToken });

  return response.data;
};

// Firebase Logout
export const logoutUser = async () => {
  const auth = getAuth();
  await signOut(auth);
  await api.post("/auth/logout");
};

export default api;
