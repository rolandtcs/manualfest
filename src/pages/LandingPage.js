import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

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
    alignItems: "center",
    gap: "8px", // add small consistent gap between elements
  };

  const headerStyle = { fontSize: "28px", fontWeight: "600", margin: 0 };
  const subHeaderStyle = { fontSize: "14px", fontWeight: "500", margin: 0, color: "#6b7280" };
  const subTextStyle = { fontSize: "16px", fontWeight: "600", color: "#6b7280", textAlign: "center", marginTop: "8px", marginBottom: "16px" };

  const btnStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };

  const btnHoverStyle = { backgroundColor: "#2563eb" };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headerStyle}>ManualFest</h1>
        <p style={subHeaderStyle}>Find manuals for any device</p>
        <p style={subTextStyle}>How would you like to find your manual?</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          {[
            { label: "📷 Take Photo", path: "/camera" },
            { label: "⬆️ Upload Photo", path: "/upload" },
            { label: "✏️ Manual Input", path: "/manual" },
          ].map((btn) => (
            <button
              key={btn.path}
              style={btnStyle}
              onClick={() => navigate(btn.path)}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = btnHoverStyle.backgroundColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = btnStyle.backgroundColor)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
