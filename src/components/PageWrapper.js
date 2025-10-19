import React from "react";

export default function PageWrapper({ children, contentHeight = "500px" }) {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #dbeafe, #fef3c7)",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "480px",
    height: contentHeight,
    background: "rgba(255,255,255,0.35)",
    backdropFilter: "blur(20px)",
    borderRadius: "36px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    overflowY: "auto",
  };

  return <div style={containerStyle}>{<div style={cardStyle}>{children}</div>}</div>;
}