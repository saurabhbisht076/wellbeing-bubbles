import React, { useEffect, useRef } from "react";

type BubbleProps = {
  size: number;
  left: number; // percent (0-100)
  duration: number; // seconds
  color: string;
  onAnimationEnd?: () => void;
};

const Bubble: React.FC<BubbleProps> = ({
  size,
  left,
  duration,
  color,
  onAnimationEnd,
}) => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = bubbleRef.current;
    if (!node || !onAnimationEnd) return;
    node.addEventListener("animationend", onAnimationEnd);
    return () => node.removeEventListener("animationend", onAnimationEnd);
  }, [onAnimationEnd]);

  // Randomly drift left/right
  const drift = Math.random() * 20 - 10; // px

  return (
    <div
      ref={bubbleRef}
      className="bubble"
      style={{
        position: "absolute",
        left: `calc(${left}% + ${drift}px)`,
        bottom: -size,
        width: size,
        height: size,
        pointerEvents: "none",
        animation: `bubble-float ${duration}s linear forwards, bubble-scale ${duration/2}s ease-in-out infinite alternate`,
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, #fff 60%, ${color} 100%)`,
          boxShadow:
            "0 4px 40px 4px rgba(120,200,255,0.25), 0 0 0 1px rgba(180,220,255,0.14) inset",
          opacity: 0.7,
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
  );
};

export default Bubble;