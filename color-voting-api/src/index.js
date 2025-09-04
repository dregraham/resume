import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const rootEl = document.getElementById("root");
createRoot(rootEl).render(<App />);