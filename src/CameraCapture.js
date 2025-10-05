import React, { useRef, useState, useEffect, useCallback } from "react";

export default function CameraCapture({ onCaptureBack }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCameraConstraints = () => ({ video: { facingMode: { ideal: "environment" } }, audio: false });

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia(getCameraConstraints());
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (err) {
      setError("Cannot access camera. Ensure permissions are granted and no other app is using it, then click 'Retry'.");
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const tryCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia(getCameraConstraints());
        if (!mounted) return;
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }
      } catch {
        if (mounted) setError("Cannot access camera. Click 'Retry' if permissions are already granted.");
      }
    };

    if (!capturedPhoto) tryCamera();

    return () => {
      mounted = false;
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, [capturedPhoto]);

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setCapturedPhoto(canvas.toDataURL("image/png"));
  };

  const sendPhotoToBackend = async (imageData) => {
    setLoading(true);
    try {
      const blob = await (await fetch(imageData)).blob();
      const formData = new FormData();
      formData.append("photo", blob, "capture.png");

      const res = await fetch(`${process.env.REACT_APP_API_URL}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      alert(data.manual ? `✅ Found manual: ${data.manual.manualUrl}` : data.message);
    } catch {
      alert("Failed to send photo to backend");
    } finally {
      setLoading(false);
    }
  };

// ---------- Styles ----------
  // Card & container
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

  // Others
  const videoStyle = { width: "100%", borderRadius: "16px", backgroundColor: "#000" };
  const imgStyle = { width: "100%", borderRadius: "16px" };
  const errorTextStyle = { color: "red", textAlign: "center", marginBottom: "10px" };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headerStyle}>Scan Your Device</h2>
        <p style={subTextStyle}>Point at product labels or model numbers</p>

        {!capturedPhoto ? (
          <>
            {error ? (
              <>
                <p style={errorTextStyle}>{error}</p>
                <button style={btnPrimary} onClick={startCamera}>🔄 Retry</button>
                <button style={btnSecondary} onClick={onCaptureBack}>🔙 Back</button>
              </>
            ) : (
              <>
                <video ref={videoRef} style={videoStyle} autoPlay playsInline />
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button
                    style={btnPrimary}
                    onClick={takePhoto}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                    >
                      📸 Take Photo</button>
                  <button
                    style={btnSecondary}
                    onClick={onCaptureBack}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#d1d5db"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                    >
                      🔙 Back
                    </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h3>Preview</h3>
            <img src={capturedPhoto} alt="Captured" style={imgStyle} />
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                style={btnPrimary}
                onClick={() => sendPhotoToBackend(capturedPhoto)}
                disabled={loading}
                onMouseOver={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#2563eb"}}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                >
                {loading ? "⏳ Sending..." : "✅ Confirm"}
              </button>
              <button
                style={btnSecondary}
                onClick={() => setCapturedPhoto(null)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#d1d5db"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
              >
                🔄 Retake
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
