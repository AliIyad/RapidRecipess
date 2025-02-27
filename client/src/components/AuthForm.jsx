import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../CSS/AuthForm.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    console.log("Toggling form. Current state before toggle:", isLogin);
    setIsLogin((prevState) => {
      console.log("New state:", !prevState);
      return !prevState;
    });
  };

  return (
    <div className='auth-form-container'>
      {isLogin ? <LoginForm /> : <RegisterForm />}

      <div className='auth-switch-btn'>
        {isLogin ? (
          <p>
            Don't have an account?
            <span onClick={toggleForm}> Register</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={toggleForm}> Login</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
