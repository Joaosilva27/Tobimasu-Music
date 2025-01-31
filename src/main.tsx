import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.tsx";
import ArtistDiscography from "./pages/ArtistDiscography.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/artist/:artistName" element={<ArtistDiscography />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
