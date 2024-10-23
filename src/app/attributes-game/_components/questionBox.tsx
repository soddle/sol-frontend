import { motion } from "framer-motion";
import { ReactNode } from "react";

interface QuestionBoxProps {
  children: ReactNode;
  className?: string;
}
const QuestionBox: React.FC<QuestionBoxProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`relative w-full h-full min-h-[70px] group ${className}`}>
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 opacity-30 group-hover:opacity-50 blur transition duration-1000 animate-gradient-xy"></div>

      <div className="absolute inset-0 flex flex-col">
        {/* Enhanced background with scanning effect */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-500/20 to-transparent"
            animate={{
              y: ["0%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Cyber grid background */}
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

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 437 219"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Glowing stroke effect */}
          <motion.path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 219V19.4535L18.5889 0H437V199.087L417.917 219H0Z"
            fill="#111411"
            stroke="url(#glow-gradient)"
            strokeWidth="1.5"
            animate={{
              filter: [
                "drop-shadow(0 0 2px #03B500)",
                "drop-shadow(0 0 4px #03B500)",
                "drop-shadow(0 0 2px #03B500)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="glow-gradient" x1="0" y1="0" x2="437" y2="219">
              <stop offset="0" stopColor="#03B500" />
              <stop offset="0.5" stopColor="#2FFF2B" />
              <stop offset="1" stopColor="#03B500" />
            </linearGradient>
          </defs>
        </svg>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-green-500 group-hover:animate-pulse" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-green-500 group-hover:animate-pulse" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-green-500 group-hover:animate-pulse" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-green-500 group-hover:animate-pulse" />

        <div className="relative flex-grow p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
};
