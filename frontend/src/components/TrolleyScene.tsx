// src/components/TrolleyScene.tsx
import React, { useState } from "react";

export const TrolleyScene = () => {
  const [choice, setChoice] = useState<"left" | "right" | null>(null);

  return (
    <div>
      <svg
        viewBox="0 0 800 400"
        width="100%"
        height="auto"
        style={{ background: "#fff" }}
      >
        {/* Tracks */}
        <path d="M 100 200 Q 300 100 700 100" stroke="#000" fill="none" strokeWidth="2" />
        <path d="M 100 200 Q 300 300 700 300" stroke="#000" fill="none" strokeWidth="2" />

        {/* Trolley */}
        <rect
          x={choice ? (choice === "left" ? 450 : 460) : 100}
          y={choice ? 90 + (choice === "right" ? 110 : 0) : 190}
          width="40"
          height="30"
          fill="#bbb"
          stroke="#000"
        />

        {/* Stick figures */}
        {choice !== "left" && (
          <circle cx="700" cy="290" r="10" fill="#000" />
        )}
        {choice !== "right" && (
          <circle cx="700" cy="90" r="10" fill="#000" />
        )}

        {/* "SPLAT" bubble */}
        {choice && (
          <text
            x="700"
            y={choice === "left" ? 100 : 300}
            fontSize="20"
            fill="red"
            fontWeight="bold"
          >
            SPLAT!
          </text>
        )}
      </svg>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setChoice("left")}>Pull Lever (Left Track)</button>
        <button onClick={() => setChoice("right")}>Do Nothing (Right Track)</button>
      </div>
    </div>
  );
};
