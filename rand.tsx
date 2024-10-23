import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const GuessCounter = ({ count }: { count: number }) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300"></div>

      <div className="relative flex items-center justify-center bg-[#1a1e1b] rounded-full p-2 border border-[#2FFF2B]">
        <motion.div
          className="text-[#2FFF2B] font-semibold"
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

        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            className="relative ml-2 text-xl font-bold text-[#2FFF2B]"
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              textShadow: [
                "0 0 10px rgba(47,255,43,0.5)",
                "0 0 20px rgba(47,255,43,0.8)",
                "0 0 10px rgba(47,255,43,0.5)",
              ],
            }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            transition={{
              duration: 0.3,
              textShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

const Container: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="relative p-4">
      {/* Scanning line effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <motion.div
          className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"
          animate={{ y: ["0%", "100%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
};

const EnhancedQuestionSection = ({
  remainingGuessKOLs,
}: {
  remainingGuessKOLs: any[];
}) => {
  return (
    <Container>
      <QuestionBox>
        <section className="text-white flex flex-col justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300"
            animate={{
              textShadow: [
                "0 0 10px rgba(47,255,43,0.5)",
                "0 0 20px rgba(47,255,43,0.8)",
                "0 0 10px rgba(47,255,43,0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Guess today's personality!
          </motion.h1>
          <GuessCounter count={remainingGuessKOLs.length} />
        </section>
      </QuestionBox>
    </Container>
  );
};

export default EnhancedQuestionSection;
