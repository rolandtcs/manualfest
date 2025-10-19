import React from "react";

export default function NeumorphicButton({ children, onClick, disabled }) {
  const buttonStyle = {
    width: "100%",
    padding: "clamp(12px, 2.5vw, 16px) clamp(16px, 4vw, 24px)",
    borderRadius: "24px",
    fontSize: "clamp(16px, 2.5vw, 18px)",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    transition: "all 0.25s ease",
    background: disabled ? "rgba(200,200,200,0.5)" : "rgba(255,255,255,0.75)",
    color: disabled ? "#999" : "#1e293b",
    boxShadow: disabled 
      ? "none" 
      : "8px 8px 15px rgba(0,0,0,0.08), -8px -8px 15px rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <button
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
        }
      }}
    >
      {children}
    </button>
  );
}