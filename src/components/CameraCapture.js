import React, { useRef, useState, useEffect, useCallback } from "react";
import NeumorphicButton from "../components/NeumorphicButton";
import PageWrapper from "../components/PageWrapper";

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

      const res = await fetch(`${process.env.REACT_APP_API_URL}/camera`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.manual) {
        alert(`✅ Manual Found!\nBrand: ${data.manual.brand}\nProduct: ${data.manual.product}\nModel: ${data.manual.model}\nURL: ${data.manual.manualUrl}`);
      } else {
        alert(data.message);
      }
    } catch {
      alert("Failed to send photo to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper contentHeight="500px">
      <h2 style={{ fontSize: "clamp(24px, 5vw, 28px)", fontWeight: "700", textAlign: "center", margin: 0 }}>
        Scan Your Device
      </h2>
      <p style={{ fontSize: "14px", color: "#475569", textAlign: "center", margin: "4px 0 16px" }}>
        Point at product labels or model numbers
      </p>

      {!capturedPhoto ? (
        <>
          {error ? (
            <>
              <p style={{ color: "red", textAlign: "center", marginBottom: "12px" }}>{error}</p>
              <NeumorphicButton onClick={startCamera}>🔄 Retry</NeumorphicButton>
              <NeumorphicButton onClick={onCaptureBack}>🔙 Back</NeumorphicButton>
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", borderRadius: "16px", backgroundColor: "#000", height: "200px" }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                <NeumorphicButton onClick={takePhoto}>📸 Take Photo</NeumorphicButton>
                <NeumorphicButton onClick={onCaptureBack}>🔙 Back</NeumorphicButton>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "12px 0 8px", textAlign: "center" }}>Preview</h3>
          <img src={capturedPhoto} alt="Captured" style={{ width: "100%", borderRadius: "16px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
            <NeumorphicButton onClick={() => sendPhotoToBackend(capturedPhoto)} disabled={loading}>
              {loading ? "⏳ Sending..." : "✅ Confirm"}
            </NeumorphicButton>
            <NeumorphicButton onClick={() => setCapturedPhoto(null)}>🔄 Retake</NeumorphicButton>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
