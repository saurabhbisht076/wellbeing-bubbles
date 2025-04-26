import React, { useState, useCallback } from "react";
import Bubble from "./Bubble";

type BubbleData = {
  id: number;
  size: number;
  left: number;
  duration: number;
  color: string;
};

const COLORS = [
  "#94e2ff", "#a4e6b8", "#f9e79f", "#f8bbd0",
  "#e1bee7", "#ffe082", "#b2dfdb", "#c5e1a5",
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

let bubbleId = 0;

const BubbleField: React.FC = () => {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  const addBubble = useCallback(() => {
    const size = randomBetween(30, 80);
    const left = randomBetween(5, 95);
    const duration = randomBetween(6, 15);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const id = bubbleId++;
    setBubbles((prev) => [...prev, { id, size, left, duration, color }]);
  }, []);

  // Add a new bubble every 800ms
  React.useEffect(() => {
    const interval = setInterval(addBubble, 800);
    return () => clearInterval(interval);
  }, [addBubble]);

  // Remove bubbles when their animation ends
  const handleBubbleEnd = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        background: "linear-gradient(180deg, #f0fcff 0%, #fff9e5 100%)",
      }}
    >
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          {...bubble}
          onAnimationEnd={() => handleBubbleEnd(bubble.id)}
        />
      ))}
    </div>
  );
};

export default BubbleField;