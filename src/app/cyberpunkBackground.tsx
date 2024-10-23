"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CyberpunkBackground = () => {
  const [particles, setParticles] = useState<any[]>([]);
  const [scanLine, setScanLine] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Generate random particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles as any);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scanline effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(true);
      setTimeout(() => setScanLine(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() > 0.7) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 200);
      }
    };

    const interval = setInterval(triggerGlitch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#181716] via-[#1c1b1a] to-[#181716] opacity-90" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #03B500 1px, transparent 1px),
            linear-gradient(to bottom, #03B500 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial overlay */}
      <div className="absolute inset-0 bg-radial-gradient opacity-20" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-green-500 rounded-full"
            initial={{
              opacity: 0,
              x: `${particle.x}vw`,
              y: "100vh",
            }}
            animate={{
              opacity: [0, 0.5, 0],
              x: `${particle.x}vw`,
              y: "-20vh",
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>

      {/* Scan line effect */}
      <AnimatePresence>
        {scanLine && (
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-green-500/20"
            initial={{ y: "-100%" }}
            animate={{ y: "100vh" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-vignette opacity-50" />

      {/* Glitch effect */}
      <AnimatePresence>
        {glitchEffect && (
          <>
            <motion.div
              className="absolute inset-0 bg-green-500/5"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute inset-0 bg-red-500/5"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.015]" />
    </div>
  );
};

export default CyberpunkBackground;
