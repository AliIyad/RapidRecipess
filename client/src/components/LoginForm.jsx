import React, { useState } from "react";
import { loginUser } from "../services/authService";

import "../CSS/AuthForm.css";

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };

    try {
      const response = await loginUser(credentials);
      setMessage({ type: "success", text: response.message });
      onSuccess();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit' onClick={handleSubmit}>
          Login
        </button>
      </form>
      {message && <p className={message.type}>{message.text}</p>}
    </div>
  );
};

export default LoginForm;
