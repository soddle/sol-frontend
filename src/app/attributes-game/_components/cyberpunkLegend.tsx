import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LEGEND_BOX_COLORS, LEGEND_BOX_TYPES } from "@/lib/constants";
import { useUiStore } from "@/stores/uiStore";

interface CyberPunkLegendProps {
  type: LEGEND_BOX_TYPES;
  color: string;
  icon?: string;
}

const CyberPunkLegendItem: React.FC<CyberPunkLegendProps> = ({
  type,
  color,
  icon,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="flex flex-col items-center relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.span
        className="text-green-400 text-sm font-medium mb-2 relative"
        animate={
          isHovered
            ? {
                textShadow: "0 0 8px rgba(47, 255, 43, 0.7)",
                color: "#2FFF2B",
              }
            : {}
        }
      >
        {type}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.span>

      <motion.div
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 via-emerald-300/30 to-green-500/30 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />

        <motion.div
          className="relative w-20 h-20 shadow-lg flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: color }}
          animate={
            isHovered
              ? {
                  boxShadow: "0 0 20px rgba(47, 255, 43, 0.3)",
                }
              : {}
          }
        >
          {/* Scanline effect */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-green-500/20"
            animate={{
              y: [0, 80, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(47, 255, 43, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(47, 255, 43, 0.5) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          />

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-green-500/50" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-green-500/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-green-500/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-green-500/50" />

          {icon ? (
            <motion.img
              src={icon}
              alt={type}
              className="max-w-[80%] max-h-[80%] object-contain relative z-10"
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div
              className="w-full h-full"
              animate={
                isHovered
                  ? {
                      backgroundColor: `${color}cc`,
                    }
                  : {}
              }
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const CyberPunkLegend: React.FC = () => {
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

  const items: CyberPunkLegendProps[] = [
    { type: LEGEND_BOX_TYPES.correct, color: LEGEND_BOX_COLORS.correct },
    {
      type: LEGEND_BOX_TYPES.partially_correct,
      color: LEGEND_BOX_COLORS.partially_correct,
    },
    { type: LEGEND_BOX_TYPES.incorrect, color: LEGEND_BOX_COLORS.incorrect },
    {
      type: LEGEND_BOX_TYPES.higher,
      color: LEGEND_BOX_COLORS.higher,
      icon: "/images/legend-up.png",
    },
    {
      type: LEGEND_BOX_TYPES.lower,
      color: LEGEND_BOX_COLORS.lower,
      icon: "/images/legend-down.png",
    },
  ];

  return (
    <AnimatePresence>
      {isLegendOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 via-emerald-300/30 to-green-500/30 opacity-75 blur group-hover:opacity-100 transition duration-1000" />

          <div className="relative border border-[#2FFF2B] bg-[#111411] p-8 overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(#2FFF2B 1px, transparent 1px), linear-gradient(90deg, #2FFF2B 1px, transparent 1px)",
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

            {/* Close button */}
            <motion.button
              onClick={() => setIsLegendOpen(false)}
              className="absolute -top-2 -right-2 text-green-500 hover:text-green-400 border border-[#2FFF2B] bg-[#111411] rounded-full p-1 z-30"
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 10px rgba(47, 255, 43, 0.5)",
              }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-4 w-4" />
            </motion.button>

            {/* CyberPunkLegend items */}
            <div className="flex justify-between relative z-10">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
