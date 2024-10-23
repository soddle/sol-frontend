import React from "react";
import { useTimeLeft } from "@/hooks/useTimeLeft";
import { AnimatePresence, motion } from "framer-motion";
import { Competition } from "@prisma/client";

interface CompetitionTimerProps {
  competition: Competition | null;
}

const CompetitionTimer: React.FC<CompetitionTimerProps> = ({ competition }) => {
  const timeLeft = useTimeLeft(competition?.endTime?.toString());

  if (!competition || !timeLeft) {
    return <LoadingTime />;
  }

  return (
    <div className="relative group">
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 opacity-75 blur group-hover:opacity-100 transition duration-1000 animate-gradient-xy"></div>

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
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-scan" />
        </div>

        {/* Timer display */}
        <div className="relative text-3xl font-bold flex items-center gap-2 px-6">
          <TimeUnit value={timeLeft.hours} />
          <Separator />
          <TimeUnit value={timeLeft.minutes} />
          <Separator />
          <TimeUnit value={timeLeft.seconds} />
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

const TimeUnit: React.FC<{ value: string }> = ({ value }) => {
  const digitVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="relative w-[2ch] text-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          className="inline-block text-white font-mono drop-shadow-[0_0_15px_rgba(47,255,43,0.8)] text-shadow-[0_0_10px_rgba(47,255,43,0.8),0_0_20px_rgba(47,255,43,0.6)]"
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
          {value}
        </motion.span>
      </AnimatePresence>
      <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
    </div>
  );
};

const Separator: React.FC = () => (
  <div className="relative w-2 h-full flex items-center justify-center">
    <motion.span
      className="text-green-500/75"
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      :
    </motion.span>
  </div>
);

export function LoadingTime() {
  const glowingStyle = `
    text-white 
    drop-shadow-[0_0_15px_rgba(47,255,43,0.8)] 
    text-shadow-[0_0_10px_rgba(47,255,43,0.8),0_0_20px_rgba(47,255,43,0.6)]
  `;

  const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  return (
    <div className="relative group">
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 opacity-75 blur animate-pulse"></div>

      <div
        className="relative w-[280px] h-[60px] bg-[#111411] flex items-center justify-center"
        style={{
          clipPath:
            "polygon(3% 0, 97% 0, 100% 20%, 100% 80%, 97% 100%, 3% 100%, 0 80%, 0 20%)",
        }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #03B500 1px, transparent 1px), linear-gradient(-45deg, #03B500 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          />
        </div>

        {/* Glitch effect overlay */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="w-full h-full bg-green-500"
            animate={{
              opacity: [0, 0.1, 0, 0.05, 0],
              x: [-2, 0, 2, -1, 1, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <motion.div
          className="text-2xl font-bold flex items-center gap-1"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {["88", ":", "88", ":", "88"].map((item, index) => (
            <motion.div
              key={index}
              className="relative w-[1ch] h-[1em] overflow-hidden"
              initial={{ rotateX: -90 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <motion.span
                className={`absolute inset-0 flex items-center justify-center ${glowingStyle}`}
                animate={{
                  opacity: [1, 0.7, 1],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {item}
              </motion.span>
              {item !== ":" && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  initial={{ y: "100%" }}
                  animate={{ y: "-100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {shuffleArray([
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                  ]).map((digit, i) => (
                    <motion.span
                      key={i}
                      className={`${glowingStyle} opacity-20`}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0.1, 0.3, 0.1],
                        y: [0, -1, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.08,
                        repeat: Infinity,
                      }}
                    >
                      {digit}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-green-500 animate-pulse" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-green-500 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-green-500 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-green-500 animate-pulse" />
      </div>
    </div>
  );
}

export default CompetitionTimer;
