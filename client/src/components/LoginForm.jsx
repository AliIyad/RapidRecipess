import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../CSS/AuthForm.css";

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setMessage({ type: "success", text: "Login successful!" });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || error.message || "Login failed"
      });
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}
    </div>
  );
};

export default LoginForm;
