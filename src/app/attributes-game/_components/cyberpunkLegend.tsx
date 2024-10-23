import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { useUiStore } from "@/stores/uiStore";

const CyberPunkLegendItem = ({
  type,
  color,
  icon,
  description,
}: {
  type: string;
  color: string;
  icon?: string;
  description: string;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="flex gap-3 items-center relative group p-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div className="relative min-w-[60px]">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 via-emerald-300/30 to-green-500/30 opacity-0 group-hover:opacity-100 blur transition duration-500" />

        <motion.div
          className="relative border border-green-500/20 p-2 m-px overflow-hidden"
          style={{ backgroundColor: color }}
          animate={
            isHovered
              ? {
                  boxShadow: "0 0 10px rgba(47, 255, 43, 0.3)",
                }
              : {}
          }
        >
          {/* Grid overlay matching table */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
              backgroundSize: "4px 4px",
            }}
          />

          {/* Scanline effect */}
          <motion.div
            className="absolute top-0 left-0 w-full h-0.5 bg-green-500/20"
            animate={{
              y: [0, 24, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {icon && (
            <div className="flex justify-center items-center h-6">
              {icon === "up" ? (
                <ChevronUp className="w-4 h-4 text-red-500" />
              ) : icon === "down" ? (
                <ChevronDown className="w-4 h-4 text-red-500" />
              ) : null}
            </div>
          )}
        </motion.div>
      </motion.div>

      <div className="flex-1">
        <motion.div
          className="text-green-400 text-sm font-medium mb-1"
          animate={
            isHovered
              ? {
                  color: "#4ade80",
                  textShadow: "0 0 8px rgba(74, 222, 128, 0.5)",
                }
              : {}
          }
        >
          {type}
        </motion.div>
        <motion.div
          className="text-white/70 text-xs"
          animate={isHovered ? { color: "rgba(255, 255, 255, 0.9)" } : {}}
        >
          {description}
        </motion.div>
      </div>
    </motion.div>
  );
};

const CyberPunkLegend = () => {
  const isLegendOpen = useUiStore((state) => state.isLegendOpen);
  const setIsLegendOpen = useUiStore((state) => state.setIsLegendOpen);
  const [scanLine, setScanLine] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(true);
      setTimeout(() => setScanLine(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      type: "Correct Match",
      color: "rgba(34, 197, 94, 0.2)",
      description: "The guessed value exactly matches the target",
    },
    {
      type: "Partial Match",
      color: "rgba(234, 179, 8, 0.2)",
      description: "The guess is partially correct or in the right category",
    },
    {
      type: "Incorrect",
      color: "rgba(239, 68, 68, 0.2)",
      description: "The guessed value does not match the target",
    },
    {
      type: "Higher",
      color: "rgba(239, 68, 68, 0.2)",
      icon: "up",
      description: "The target value is higher than your guess",
    },
    {
      type: "Lower",
      color: "rgba(239, 68, 68, 0.2)",
      icon: "down",
      description: "The target value is lower than your guess",
    },
  ];

  return (
    <AnimatePresence>
      {isLegendOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative group max-w-[600px] mx-auto"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 via-emerald-300/30 to-green-500/30 opacity-75 blur group-hover:opacity-100 transition duration-1000" />

          <div className="relative bg-[#111411] p-4 overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            {/* Scanning line effect */}
            <AnimatePresence>
              {scanLine && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "linear" }}
                  className="absolute top-0 left-0 w-1 h-full bg-green-500/50 z-20 mix-blend-overlay"
                />
              )}
            </AnimatePresence>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-green-500/50" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-green-500/50" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-green-500/50" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-green-500/50" />

            {/* Title */}
            <div className="text-green-400 text-lg font-bold mb-4 relative">
              Legend
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            </div>

            {/* Close button */}
            <motion.button
              onClick={() => setIsLegendOpen(false)}
              className="absolute -top-2 -right-2 text-green-500 hover:text-green-400 border border-green-500/50 bg-[#111411] rounded-full p-1 z-30"
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 10px rgba(47, 255, 43, 0.5)",
              }}
            >
              <X className="h-4 w-4" />
            </motion.button>

            {/* Legend items */}
            <div className="space-y-2 relative z-10">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CyberPunkLegendItem {...item} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CyberPunkLegend;
