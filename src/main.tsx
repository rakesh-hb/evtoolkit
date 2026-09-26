import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { PrimaryVehicleProvider } from "./context/PrimaryVehicleContext";


import App from "./App";
import "./styles.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AuthProvider>
      <PrimaryVehicleProvider>
        <App />
      </PrimaryVehicleProvider>
    </AuthProvider>
  </React.StrictMode>
);