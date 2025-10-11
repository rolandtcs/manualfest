import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadPhoto() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) { alert("Please select a file first."); return; }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      alert(data.manual ? `✅ Found manual: ${data.manual.manualUrl}` : data.message);
      setSelectedFile(null);
    } catch {
      alert("Failed to upload photo.");
    }
  };

  // ---------- Styles ----------
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  };
  const cardStyle = {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
  };

  // Headers
  const headerStyle = { fontSize: "24px", fontWeight: "600", textAlign: "center", margin: 0 };
  const subTextStyle = { fontSize: "14px", color: "#6b7280", textAlign: "center", margin: 0 };

  // Input
  const labelStyle = { display: "block", fontSize: "16px", fontWeight: "600", color: "#000", marginBottom: "8px", width: "100%" };
  const inputStyle = { width: "100%", padding: "16px", border: "1px solid #d1d5db", borderRadius: "16px", fontSize: "16px", boxSizing: "border-box" };

  // Buttons
  const btnPrimary = {
    width: "100%", padding: "16px", borderRadius: "16px", fontSize: "16px", fontWeight: "600",
    backgroundColor: "#3b82f6", color: "#fff", cursor: "pointer", border: "none",
    transition: "background-color 0.2s ease",
  };
  const btnPrimaryDisabled = { ...btnPrimary, backgroundColor: "#93c5fd", cursor: "not-allowed" };
  const btnSecondary = {
    width: "100%", padding: "12px", borderRadius: "16px", fontSize: "16px",
    backgroundColor: "#e5e7eb", color: "#374151", cursor: "pointer", border: "none",
    transition: "background-color 0.2s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headerStyle}>Upload Photo</h2>
        <p style={subTextStyle}>Choose a clear photo of your device</p>

        <div style={{ width: "100%" }}>
          <label style={labelStyle}>Select File</label>
          <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px", width: "100%" }}>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            style={!selectedFile ? btnPrimaryDisabled : btnPrimary}
            onMouseOver={(e) => {
              if (selectedFile) e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            onMouseOut={(e) => {
              if (selectedFile) e.currentTarget.style.backgroundColor = "#3b82f6";
            }}
          >
            ⬆️ Upload
          </button>
          <button
            style={btnSecondary}
            onClick={() => navigate("/")}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#d1d5db"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
          >
            🔙 Back
          </button>
        </div>
      </div>
    </div>
  );
}