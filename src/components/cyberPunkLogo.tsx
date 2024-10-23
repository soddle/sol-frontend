"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";

interface CyberpunkLogoProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const CyberpunkLogo: React.FC<CyberpunkLogoProps> = ({
  src,
  alt = "Logo",
  // width = 200,
  height = 60,
  className = "",
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const glitchControls = useAnimationControls();
  const scanlineRef = React.useRef<HTMLDivElement>(null);

  // Random glitch effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        const shouldGlitch = Math.random() > 0.7;
        if (shouldGlitch) {
          glitchControls.start({
            x: [0, -2, 2, -2, 0],
            opacity: [1, 0.8, 0.9, 0.7, 1],
            transition: {
              duration: 0.2,
              times: [0, 0.25, 0.5, 0.75, 1],
            },
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, glitchControls]);

  return (
    <motion.div
      className={`relative group ${className}`}
      //   style={{ width, height }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Background effects container */}
      <div className="absolute inset-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 via-emerald-300/30 to-green-500/30 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(47, 255, 43, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(47, 255, 43, 0.2) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-green-500/50" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-green-500/50" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-green-500/50" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-green-500/50" />

      {/* Scanline effect */}
      <motion.div
        ref={scanlineRef}
        className="absolute top-0 left-0 w-full h-1 bg-green-500/20 z-20"
        animate={{
          y: [0, height, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Glitch layers */}
      <div className="relative w-full h-full">
        {/* Red channel */}
        <motion.img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-50"
          style={{ filter: "url(#redChannel)" }}
          animate={glitchControls}
        />

        {/* Green channel */}
        <motion.img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-50"
          style={{ filter: "url(#greenChannel)" }}
          animate={glitchControls}
        />

        {/* Blue channel */}
        <motion.img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-50"
          style={{ filter: "url(#blueChannel)" }}
          animate={glitchControls}
        />

        {/* Main image */}
        <motion.img
          src={src}
          alt={alt}
          className="relative z-10 w-full h-full object-contain"
          animate={
            isHovered
              ? {
                  filter: "drop-shadow(0 0 8px rgba(47, 255, 43, 0.7))",
                }
              : {}
          }
        />
      </div>

      {/* Hover effects */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0"
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 0.5 }}
      />

      {/* SVG Filters */}
      <svg className="hidden">
        <defs>
          <filter id="redChannel">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="greenChannel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="blueChannel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Static noise overlay */}
      <motion.div
        className="absolute inset-0 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
        }}
        animate={isHovered ? { opacity: 0.15 } : { opacity: 0.08 }}
      />
    </motion.div>
  );
};

export default CyberpunkLogo;
