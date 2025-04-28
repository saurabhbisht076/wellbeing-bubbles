import React, { useEffect, useState, useRef } from "react";

// Modern gradient palettes with vibration colors
const COLOR_PALETTES = [
  ["#FF1744", "#F50057", "#D500F9"], // hot neon
  ["#00B8D4", "#2979FF", "#651FFF"], // cool cyber
  ["#00E676", "#FFEA00", "#FF9100"], // toxic energy
  ["#FF3D00", "#FF9100", "#FFEA00"], // solar flare
  ["#651FFF", "#D500F9", "#F50057"], // quantum plasma
];

// Interactive bubble properties
type BubbleData = {
  id: number;
  left: number;
  size: number;
  duration: number;
  colors: string[];
  rotation: number;
  hasParticles: boolean;
  glowIntensity: number;
  morphSpeed: number;
  pulseRate: number;
  depth: number; // Z-index relative position
};

// Particle system within bubbles
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
  lifespan: number;
};

let nextId = 0;
let particleId = 0;

const BubbleField: React.FC = () => {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ambientLight, setAmbientLight] = useState(0.2);
  
  // Create new bubbles over time - FASTER INTERVAL (500ms instead of 800ms)
  useEffect(() => {
    // Initial bubbles to avoid empty start
    const initialBubbles: BubbleData[] = Array.from({ length: 5 }).map(() => {
      const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
      return {
        id: nextId++,
        left: Math.random() * 90 + 5,
        size: Math.random() * 60 + 30, // Slightly smaller bubbles on average
        duration: Math.random() * 3 + 4, // FASTER DURATION: 4-7s instead of 7-13s
        colors: palette,
        rotation: Math.random() * 360,
        hasParticles: Math.random() > 0.7,
        glowIntensity: Math.random() * 0.5 + 0.5,
        morphSpeed: Math.random() * 3 + 1, // Faster morphing
        pulseRate: Math.random() * 2 + 0.8, // Faster pulsing
        depth: Math.random() * 0.8 + 0.2,
      };
    });
    
    setBubbles(initialBubbles);
    
    const interval = setInterval(() => {
      const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
      const hasParticles = Math.random() > 0.7;
      
      setBubbles((prev) => [
        ...prev,
        {
          id: nextId++,
          left: Math.random() * 90 + 5,
          size: Math.random() * 50 + 30, // Slightly smaller bubbles
          duration: Math.random() * 3 + 4, // FASTER DURATION: 4-7s instead of 7-13s
          colors: palette,
          rotation: Math.random() * 360,
          hasParticles,
          glowIntensity: Math.random() * 0.5 + 0.5,
          morphSpeed: Math.random() * 3 + 1, // Faster morphing
          pulseRate: Math.random() * 2 + 0.8, // Faster pulsing
          depth: Math.random() * 0.8 + 0.2,
        }
      ]);
    }, 500); // FASTER GENERATION: 500ms instead of 800ms
    
    return () => clearInterval(interval);
  }, []);

  // Remove bubbles after animation completes - FASTER cleanup
  useEffect(() => {
    if (!bubbles.length) return;
    
    const timeout = setTimeout(() => {
      setBubbles((prev) => prev.slice(1));
    }, bubbles[0].duration * 800); // Slightly shorter than full duration to prevent bubble buildup
    
    return () => clearTimeout(timeout);
  }, [bubbles]);

  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!fieldRef.current) return;
      
      const rect = fieldRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
      setIsHovering(true);
      
      // Adjust ambient light based on mouse position
      const centerDistanceX = Math.abs(50 - x) / 50;
      const centerDistanceY = Math.abs(50 - y) / 50;
      const distance = Math.sqrt(centerDistanceX ** 2 + centerDistanceY ** 2);
      setAmbientLight(0.6 - distance * 0.4);
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      setAmbientLight(0.2);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Generate and update particles - OPTIMIZED
  useEffect(() => {
    // Only run particle effects if we have bubbles with particles
    if (!bubbles.some(b => b.hasParticles)) return;
    
    const particleInterval = setInterval(() => {
      // Generate new particles for bubbles with particle effects
      const bubblesWithParticles = bubbles.filter(b => b.hasParticles);
      
      if (bubblesWithParticles.length === 0) return;
      
      const newParticles: Particle[] = [];
      
      // Limit to processing just 2 bubbles at a time for performance
      bubblesWithParticles.slice(0, 2).forEach(bubble => {
        const particleCount = Math.floor(Math.random() * 2) + 1; // Fewer particles
        
        for (let i = 0; i < particleCount; i++) {
          // Position particles inside the bubble
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * (bubble.size * 0.4);
          const x = distance * Math.cos(angle);
          const y = distance * Math.sin(angle);
          
          newParticles.push({
            id: particleId++,
            x,
            y,
            size: Math.random() * 4 + 2, // Smaller particles
            opacity: Math.random() * 0.6 + 0.4,
            speed: Math.random() * 0.6 + 0.3, // Slightly faster particle movement
            color: bubble.colors[Math.floor(Math.random() * bubble.colors.length)],
            lifespan: Math.random() * 1.5 + 0.8 // Shorter lifespan
          });
        }
      });
      
      setParticles(prev => {
        // Limit total particles for performance
        const combined = [...prev, ...newParticles];
        return combined.slice(Math.max(0, combined.length - 30));
      });
    }, 300); // Faster particle generation
    
    const updateParticles = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            opacity: p.opacity - 0.08, // Faster fade
            size: p.size * 0.92, // Faster shrink
            x: p.x + (Math.random() - 0.5) * p.speed * 1.2,
            y: p.y + (Math.random() - 0.5) * p.speed * 1.2,
          }))
          .filter(p => p.opacity > 0.05)
      );
    }, 100);
    
    return () => {
      clearInterval(particleInterval);
      clearInterval(updateParticles);
    };
  }, [bubbles]);

  return (
    <div
      ref={fieldRef}
      style={{
        position: "fixed",
        inset: 0,
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(40,40,60,${ambientLight + 0.1}) 0%, rgba(10,10,20,${ambientLight}) 100%)`,
        zIndex: 1000,
        overflow: "hidden",
        perspective: "1000px",
        transform: "translateZ(0)",
        willChange: "transform", // Performance optimization
      }}
    >
      {/* Dynamic background mesh */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(30,30,50,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30,30,50,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: `rotateX(${isHovering ? 5 : 0}deg) rotateY(${isHovering ? (mousePosition.x - 50) / 10 : 0}deg)`,
          transformOrigin: "center center",
          transition: "transform 1s cubic-bezier(0.23, 1, 0.32, 1)", // Faster transition
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: "100%", 
          height: "100%",
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                      rgba(100,50,255,${isHovering ? 0.15 : 0.05}) 0%, 
                      transparent 70%)`,
          pointerEvents: "none",
          mixBlendMode: "screen",
          transition: "background 0.8s ease", // Faster transition
        }}
      />

      {/* Bubbles */}
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
            zIndex: Math.round(1001 + bubble.depth * 10),
            animation: `bubble-float ${bubble.duration}s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`, // Snappier easing
            overflow: "visible",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${bubble.rotation}deg) scale(${isHovering && Math.abs(mousePosition.x - bubble.left) < 20 ? 1.1 : 1})`,
            transition: "transform 0.3s ease", // Faster transition
            willChange: "transform", // Performance optimization
          }}
        >
          {/* Main bubble body with dynamic gradient */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `
                radial-gradient(
                  circle at 30% 30%, 
                  rgba(255,255,255,0.9) 0%, 
                  ${bubble.colors[0]} 50%, 
                  ${bubble.colors[1]} 80%, 
                  ${bubble.colors[2]} 100%
                )
              `,
              boxShadow: `
                0 0 ${15 * bubble.glowIntensity}px ${bubble.colors[0]},
                0 0 ${30 * bubble.glowIntensity}px rgba(255,255,255,0.3),
                0 0 0 1px rgba(255,255,255,0.1) inset
              `,
              opacity: 0.85,
              position: "relative",
              animation: `
                pulse ${bubble.pulseRate}s ease-in-out infinite alternate,
                colorShift ${bubble.morphSpeed}s ease-in-out infinite alternate
              `,
            }}
          >
            {/* Primary reflection */}
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "27%",
                width: "25%",
                height: "18%",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.6)",
                filter: "blur(2px)",
              }}
            />
            
            {/* Secondary reflection */}
            <div
              style={{
                position: "absolute",
                top: "55%",
                left: "15%",
                width: "12%",
                height: "10%",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.4)",
                filter: "blur(1px)",
              }}
            />

            {/* Bubble edge highlight */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "transparent",
                boxShadow: "0 0 10px 2px rgba(255,255,255,0.3) inset",
                opacity: 0.7,
              }}
            />

            {/* Only render particles if bubble has particles flag - optimization */}
            {bubble.hasParticles && particles.map(particle => (
              <div
                key={particle.id}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${particle.x}px)`,
                  top: `calc(50% + ${particle.y}px)`,
                  width: particle.size,
                  height: particle.size,
                  borderRadius: "50%",
                  background: particle.color,
                  opacity: particle.opacity,
                  filter: "blur(1px)",
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Global animation styles - FASTER ANIMATIONS */}
      <style>
        {`
          @keyframes bubble-float {
            0% { transform: translateY(0) scale(1) rotate(0deg); }
            10% { transform: translateY(-15%) scale(1.02) rotate(${Math.random() > 0.5 ? 5 : -5}deg); }
            40% { transform: translateY(-50%) scale(0.98) rotate(${Math.random() > 0.5 ? 3 : -3}deg); }
            70% { transform: translateY(-85%) scale(1.01) rotate(${Math.random() > 0.5 ? 6 : -6}deg); }
            100% { transform: translateY(-120%) scale(0.8) rotate(${Math.random() > 0.5 ? 10 : -10}deg); opacity: 0; }
          }
          
          @keyframes pulse {
            0% { transform: scale(0.97); }
            100% { transform: scale(1.03); }
          }
          
          @keyframes colorShift {
            0% { filter: hue-rotate(0deg) brightness(1); }
            50% { filter: hue-rotate(15deg) brightness(1.05); }
            100% { filter: hue-rotate(-15deg) brightness(0.95); }
          }
        `}
      </style>
    </div>
  );
};

export default BubbleField;