import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const GuessCounter = ({ count }: { count: number }) => {
  const digitVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="relative group">
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 opacity-75 blur group-hover:opacity-100 transition duration-1000 animate-gradient-xy" />

      <div
        className="relative w-[280px] h-[60px] bg-[#111411] flex items-center justify-center"
        style={{
          clipPath:
            "polygon(3% 0, 97% 0, 100% 20%, 100% 80%, 97% 100%, 3% 100%, 0 80%, 0 20%)",
        }}
      >
        {/* Cyber grid background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-green-500 group-hover:animate-pulse" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-green-500 group-hover:animate-pulse" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-green-500 group-hover:animate-pulse" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-green-500 group-hover:animate-pulse" />

        {/* Scanning line */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div
            className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"
            animate={{ y: ["0%", "100%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Counter display */}
        <div className="relative flex items-center gap-3 px-6">
          <motion.div
            className="text-xl font-semibold text-green-500"
            animate={{
              textShadow: [
                "0 0 4px #2FFF2B",
                "0 0 8px #2FFF2B",
                "0 0 4px #2FFF2B",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Guesses left:
          </motion.div>

          <div className="relative w-[2ch] text-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                className="inline-block text-3xl font-bold text-white font-mono drop-shadow-[0_0_15px_rgba(47,255,43,0.8)] text-shadow-[0_0_10px_rgba(47,255,43,0.8),0_0_20px_rgba(47,255,43,0.6)]"
                variants={digitVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
            <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
          </div>
        </div>

        {/* Glowing edges */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-green-500/50 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-green-500/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default GuessCounter;
