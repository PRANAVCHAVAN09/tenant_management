import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "../context/AuthContext.jsx";
import { LoaderProvider } from "../context/LoaderContext";
import Loader from "../components/Loader.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <LoaderProvider>
      <AuthProvider>
        <Loader />
        <App />
      </AuthProvider>
    </LoaderProvider>
  </React.StrictMode>
);
