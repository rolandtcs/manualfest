import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import NeumorphicButton from "../components/NeumorphicButton";

// Fixed API URL - works in both dev and production
const API_URL = process.env.REACT_APP_API_URL || '/api';

export default function UploadPhoto() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      // Fixed API call
      const res = await fetch(`${API_URL}/upload`, { 
        method: "POST", 
        body: formData 
      });
      
      const data = await res.json();
      
      if (data.manual) {
        alert(
          `✅ Manual Found!\nBrand: ${data.manual.brand}\nProduct: ${data.manual.product}\nModel: ${data.manual.model}\nURL: ${data.manual.manualUrl}`
        );
      } else {
        alert(data.message || "Failed to process photo");
      }
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <h2 style={{ fontSize: "clamp(24px,5vw,28px)", fontWeight: "700", textAlign: "center", margin: 0 }}>
        Upload Photo
      </h2>
      <p style={{ fontSize: "14px", color: "#475569", textAlign: "center", margin: "4px 0 16px" }}>
        Choose a clear photo of your device
      </p>

      <div style={{ width: "100%", marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "16px", fontWeight: "600", color: "#000", marginBottom: "8px" }}>
          Select File
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        <NeumorphicButton onClick={handleUpload} disabled={!selectedFile || loading}>
          {loading ? "⏳ Uploading..." : "⬆️ Upload"}
        </NeumorphicButton>
        <NeumorphicButton onClick={() => navigate("/")}>🔙 Back</NeumorphicButton>
      </div>
    </PageWrapper>
  );
}