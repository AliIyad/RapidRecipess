import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Router from "./router/routes.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
