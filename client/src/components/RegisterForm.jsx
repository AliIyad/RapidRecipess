import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

import "../CSS/AuthForm.css";

const RegisterForm = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    // Basic validation
    if (!username || !email || !password) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    const userData = { username, email, password };

    try {
      const response = await register(userData);
      setMessage({ type: "success", text: "Registration successful!" });
      onSuccess(); // Trigger onSuccess callback after successful registration
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Registration failed",
      });
    }
  };

  return (
    <div className='auth-form'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Register</button>
      </form>
      {message && <p className={message.type}>{message.text}</p>}
    </div>
  );
};

export default RegisterForm;
