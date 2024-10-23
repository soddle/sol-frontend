import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ZapOff, Circle, Cpu } from "lucide-react";

const CyberpunkEmptyState = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group w-full max-w-2xl mx-auto"
    >
      {/* Animated background layers */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/30 via-emerald-400/30 to-cyan-500/30 opacity-75 blur-lg group-hover:opacity-100 transition duration-1000">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.3),transparent_50%)]" />
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-20 animate-scan" />

      {/* Main content container */}
      <div className="relative p-8 bg-black/90 border border-green-500/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSg3NCwgMjIyLCAxMjgsIDAuMikiLz48L3N2Zz4=')] opacity-20" />

        <div className="flex flex-col items-center gap-6 relative">
          {/* Animated icon group */}
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -inset-4 opacity-20"
            >
              <Circle className="w-24 h-24 text-green-500" />
            </motion.div>

            <div className={`relative ${glitchActive ? "animate-glitch" : ""}`}>
              <ZapOff className="w-16 h-16 text-green-500 animate-pulse" />
            </div>

            <motion.div
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -inset-8 opacity-10"
            >
              <Cpu className="w-32 h-32 text-cyan-500" />
            </motion.div>
          </div>

          {/* Text with glitch effect */}
          <div className="text-center">
            <p
              className={`text-green-500 text-lg font-mono tracking-wider ${
                glitchActive ? "animate-glitch" : ""
              }`}
            >
              NO GUESSES FOUND
            </p>
            <p className="text-green-400/60 text-sm mt-2 font-mono">
              MAKE SOME!
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-2 left-2 w-2 h-2 bg-green-500/50 animate-ping" />
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-cyan-500/50 animate-ping delay-300" />
          </div>
        </div>
      </div>

      {/* Edge highlights */}
      <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </motion.div>
  );
};

export default CyberpunkEmptyState;
