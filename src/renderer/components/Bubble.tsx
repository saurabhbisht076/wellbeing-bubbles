import React, { useEffect, useRef } from "react";

type BubbleProps = {
  size: number;
  left: number; // percent (0-100)
  duration: number; // seconds
  color: string;
  onAnimationEnd?: () => void;
};

const Bubble: React.FC<BubbleProps> = ({ size, left, duration, color, onAnimationEnd }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAnimationEnd = () => {
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    };
    const node = bubbleRef.current;
    if (node) {
      node.addEventListener("animationend", handleAnimationEnd);
      return () => node.removeEventListener("animationend", handleAnimationEnd);
    }
  }, [onAnimationEnd]);

  return (
    <div
      ref={bubbleRef}
      className="bubble"
      style={{
        position: "absolute",
        left: `${left}%`,
        bottom: -size, // start just below the visible area
        width: size,
        height: size,
        background: color,
        borderRadius: "50%",
        opacity: 0.6,
        pointerEvents: "none",
        animation: `bubble-float ${duration}s linear forwards`,
      }}
    />
  );
};

export default Bubble;