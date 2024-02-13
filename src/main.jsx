import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Header from "./components/Header/Header.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <div className="h-screen flex flex-col">
    <Header />
    <App className="flex-1"/>
  </div>,
);
