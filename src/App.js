import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import CameraCapture from "./CameraCapture";
import UploadPhoto from "./UploadPhoto";
import ManualInput from "./ManualInput";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/camera" element={<CameraCapture onCaptureBack={() => window.history.back()} />} />
        <Route path="/upload" element={<UploadPhoto />} />
        <Route path="/manual" element={<ManualInput />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
