import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import NeumorphicButton from "../components/NeumorphicButton";

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
      if (data.manual) {
        alert(
          `✅ Manual Found!\nBrand: ${data.manual.brand}\nProduct: ${data.manual.product}\nModel: ${data.manual.model}\nURL: ${data.manual.manualUrl}`
        );
      } else {
        alert(data.message);
      }
      setBrand("");
      setProduct("");
      setModel("");
    } catch {
      alert("Failed to send manual input.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = brand && product && model;

  return (
    <PageWrapper>
      <h2 style={{ fontSize: "clamp(24px,5vw,28px)", fontWeight: "700", textAlign: "center", margin: 0 }}>
        Enter Device Details
      </h2>
      <p style={{ fontSize: "14px", color: "#475569", textAlign: "center", margin: "4px 0 16px" }}>
        Fill in what you know about your device
      </p>

      {/* Form Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
        <div>
          <label style={{ display: "block", fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
            Brand
          </label>
          <input
            type="text"
            placeholder="e.g. Apple, Samsung, Sony"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "16px", boxSizing: "border-box" }}
            disabled={loading}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
            Product Type
          </label>
          <input
            type="text"
            placeholder="e.g. Phone, Laptop, Router, TV"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "16px", boxSizing: "border-box" }}
            disabled={loading}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
            Model Number
          </label>
          <input
            type="text"
            placeholder="e.g. iPhone 15 Pro, Zenbook 14, WRT3200ACM"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "16px", boxSizing: "border-box" }}
            disabled={loading}
          />
          <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>
            Usually found on the device label or packaging
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px", width: "100%" }}>
        <NeumorphicButton onClick={handleSubmit} disabled={!isFormValid || loading}>
          {loading ? "⏳ Submitting..." : "✅ Submit"}
        </NeumorphicButton>
        <NeumorphicButton onClick={() => navigate("/")}>
          🔙 Back
        </NeumorphicButton>
      </div>
    </PageWrapper>
  );
}
