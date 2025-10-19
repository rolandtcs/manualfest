import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  // ---- Global styles to prevent overflow ----
  React.useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.documentElement.style.boxSizing = "border-box";
  }, []);

  // ---- Responsive styles ----
  const containerStyle = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #dbeafe, #fef3c7)",
    fontFamily: "'Inter', sans-serif",
  };

  const cardStyle = {
    width: "90%",
    maxWidth: "480px",
    background: "rgba(255,255,255,0.35)",
    backdropFilter: "blur(20px)",
    borderRadius: "36px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  };

  const headerStyle = {
    fontSize: "clamp(28px, 5vw, 36px)",
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
    margin: 0,
  };

  const subHeaderStyle = {
    fontSize: "clamp(16px, 3vw, 18px)",
    fontWeight: "500",
    color: "#475569",
    textAlign: "center",
    margin: 0,
  };

  const buttonsContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(12px, 2vw, 16px)",
    width: "100%",
  };

  const buttonStyle = {
    width: "100%",
    padding: "clamp(12px, 2.5vw, 16px) clamp(16px, 4vw, 24px)",
    borderRadius: "24px",
    fontSize: "clamp(16px, 2.5vw, 18px)",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    transition: "all 0.25s ease",
    background: "rgba(255,255,255,0.75)",
    color: "#1e293b",
    boxShadow: "8px 8px 15px rgba(0,0,0,0.08), -8px -8px 15px rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
  };

  const hintStyle = {
    fontSize: "clamp(12px, 2vw, 13px)",
    color: "#475569",
    textAlign: "center",
  };

  const buttons = [
    { label: "📷 Take Photo", path: "/camera", hint: "Point at product labels or interfaces" },
    { label: "⬆️ Upload Photo", path: "/upload", hint: "Upload a clear photo of your device" },
    { label: "✏️ Manual Input", path: "/manual", hint: "Enter device details manually" },
  ];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headerStyle}>ManualFest</h1>
        <p style={subHeaderStyle}>Find device manuals instantly</p>
        <p style={{ fontSize: "clamp(12px,2.5vw,14px)", color: "#475569", textAlign: "center", marginBottom: "8px" }}>
          Choose how you want to search:
        </p>

        <div style={buttonsContainer}>
          {buttons.map((btn) => (
            <div key={btn.path} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <button
                style={buttonStyle}
                onClick={() => navigate(btn.path)}
                onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-3px) scale(1.02)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
              >
                {btn.label}
              </button>
              <span style={hintStyle}>{btn.hint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
