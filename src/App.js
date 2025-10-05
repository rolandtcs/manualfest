import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CameraCapture from "./components/CameraCapture";
import UploadPhoto from "./components/UploadPhoto";
import ManualInput from "./components/ManualInput";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/camera" element={<CameraCapture onCaptureBack={() => window.history.back()} />} />
      <Route path="/upload" element={<UploadPhoto />} />
      <Route path="/manual" element={<ManualInput />} />
    </Routes>
  );
}

export default App;