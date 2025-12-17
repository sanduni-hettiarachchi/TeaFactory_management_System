// src/pages/customer/CustomerWelcome.jsx
import React, { useState } from "react";

export default function CustomerWelcome() {
  const [videoError, setVideoError] = useState(false);
  const videoSrc = "/assets/accessories/videos/bg.mp4";
  return (
    <section style={{ position: "relative", height: "45vh", overflow: "hidden" }}>
      {/* Background video */}
      {!videoError ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <></>
      )}

      {/* Overlay content */}
      <div style={{ position: "relative", zIndex: 1, padding: "12px 16px" }}>
        <h1
          style={{
            color: "#ffffff",
            fontWeight: 800,
            lineHeight: 1.25,
            margin: 0,
            fontSize: "clamp(18px, 3.2vw, 34px)",
            textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          Savor the Taste of Tradition – Fresh Ceylon Tea, Straight from Our Gardens to Your Cup
        </h1>
      </div>
    </section>
  );
}
