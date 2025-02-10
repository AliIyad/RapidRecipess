import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Router from "./router/routes.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Layout from "./components/Layout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Layout>
        <App />
      </Layout>
    </Router>
  </React.StrictMode>
);
