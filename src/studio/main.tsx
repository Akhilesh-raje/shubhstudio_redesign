import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/global.css";
import "./studio.css";
import Studio from "./Studio";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Studio />
  </StrictMode>,
);
