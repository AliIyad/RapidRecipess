import axios from "axios";
import { app } from "../../firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useAuth } from "../context/AuthContext"; // Import the AuthContext

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach Firebase token to requests using context
api.interceptors.request.use(async (config) => {
  const { token } = useAuth(); // Get the token from the context

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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
