import React from "react";

export default function NeumorphicButton({ children, onClick }) {
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

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-3px) scale(1.02)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
    >
      {children}
    </button>
  );
}
