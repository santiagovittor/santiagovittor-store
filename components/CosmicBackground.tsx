"use client";

import { ReactNebula } from "@flodlc/nebula";

export default function CosmicBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        height: "100vh",
        maxHeight: "100vh",
      }}
    >
      <ReactNebula
        config={{
          starsCount: 400,
          starsRotationSpeed: 2,
          nebulasIntensity: 6,
          bgColor: "#050505",
          cometFrequence: 150,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "rgba(0, 0, 0, 0.35)",
        }}
      />
    </div>
  );
}
