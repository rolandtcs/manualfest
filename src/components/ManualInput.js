import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManualInput() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!brand || !product || !model) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/manual-input`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, product, model }),
      });
      const data = await res.json();
      alert(
        data.manual
          ? `✅ Found manual: ${data.manual.manualUrl}`
          : data.message
      );
      setBrand("");
      setProduct("");
      setModel("");
    } catch {
      alert("Failed to send manual input.");
    } finally {
      setLoading(false);
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
  };

  const headerStyle = {
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center",
    margin: 0,
  };
  const subTextStyle = {
    fontSize: "14px",
    color: "#6b7280",
    textAlign: "center",
    margin: 0,
  };

  const btnPrimary = {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.2s ease",
  };
  const btnPrimaryDisabled = {
    ...btnPrimary,
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  };
  const btnSecondary = {
    width: "100%",
    padding: "12px",
    borderRadius: "16px",
    fontSize: "16px",
    backgroundColor: "#e5e7eb",
    color: "#374151",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.2s ease",
  };

  const labelStyle = {
    display: "block",
    fontSize: "16px",
    fontWeight: "600",
    color: "#000",
    marginBottom: "6px",
  };
  const inputStyle = {
    width: "100%",
    padding: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "16px",
    boxSizing: "border-box",
  };
  const smallTextStyle = {
    color: "#6b7280",
    fontSize: "12px",
    marginTop: "4px",
  };

  const isFormValid = brand && product && model;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
          <h2 style={headerStyle}>Enter Device Details</h2>
          <p style={subTextStyle}>Fill in what you know about your device</p>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Brand</label>
            <input
              type="text"
              placeholder="e.g. Apple, Samsung, Sony"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              style={inputStyle}
              disabled={loading}
            />
          </div>

          <div>
            <label style={labelStyle}>Product Type</label>
            <input
              type="text"
              placeholder="e.g. Phone, Laptop, Router, TV"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              style={inputStyle}
              disabled={loading}
            />
          </div>

          <div>
            <label style={labelStyle}>Model Number</label>
            <input
              type="text"
              placeholder="e.g. iPhone 15 Pro, Zenbook 14, WRT3200ACM"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={inputStyle}
              disabled={loading}
            />
            <p style={smallTextStyle}>
              Usually found on the device label or packaging
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            style={!isFormValid || loading ? btnPrimaryDisabled : btnPrimary}
            onMouseOver={(e) => {
              if (isFormValid && !loading)
                e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            onMouseOut={(e) => {
              if (isFormValid && !loading)
                e.currentTarget.style.backgroundColor = "#3b82f6";
            }}
          >
            {loading ? "⏳ Submitting..." : "✅ Submit"}
          </button>
          <button
            style={btnSecondary}
            onClick={() => navigate("/")}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#d1d5db";
            }}
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#e5e7eb")
            }
          >
            🔙 Back
          </button>
        </div>
      </div>
    </div>
  );
}
