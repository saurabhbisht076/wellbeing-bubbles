import React, { useEffect, useState } from "react";

// Highly visible, contrasting colors
const COLORS = [
  "#FF1744", // red
  "#F50057", // pink
  "#D500F9", // purple
  "#651FFF", // deep violet
  "#2979FF", // blue
  "#00B8D4", // cyan
  "#00E676", // green
  "#FFEA00", // yellow
  "#FF9100", // orange
  "#FF3D00", // deep orange
];

type BubbleData = {
  id: number;
  left: number;
  size: number;
  duration: number;
  color: string;
};

let nextId = 0;

const BubbleField: React.FC = () => {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: nextId++,
          left: Math.random() * 90 + 5,
          size: Math.random() * 50 + 40,
          duration: Math.random() * 5 + 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }
      ]);
    }, 700);

    return () => clearInterval(interval);
  }, []);

  // Remove bubbles after their duration
  useEffect(() => {
    if (!bubbles.length) return;
    const timeout = setTimeout(() => {
      setBubbles((prev) => prev.slice(1));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [bubbles]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(180deg, #181818 0%, #222233 100%)", // dark background
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            position: "absolute",
            left: `${bubble.left}%`,
            bottom: -bubble.size,
            width: bubble.size,
            height: bubble.size,
            borderRadius: "50%",
            zIndex: 1001,
            animation: `bubble-float ${bubble.duration}s linear forwards`,
            overflow: "hidden",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, #fff 60%, ${bubble.color} 100%)`,
              boxShadow: "0 2px 24px 4px rgba(0,0,0,0.35), 0 0 0 2px #222 inset",
              opacity: 0.85,
              position: "relative",
              transition: "background 0.5s",
            }}
          >
            {/* Reflection spot */}
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "27%",
                width: "25%",
                height: "18%",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.45)",
                filter: "blur(2px)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BubbleField;