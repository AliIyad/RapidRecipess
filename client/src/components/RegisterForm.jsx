import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const RegisterForm = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, email, password };
    try {
      const response = await register(userData);
      setMessage({ type: "success", text: response.message });
      onSuccess();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type='submit'>Register</button>
      </form>
      {message && <p className={message.type}>{message.text}</p>}
    </div>
  );
};

export default RegisterForm;
