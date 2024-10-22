import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Competition } from "@prisma/client";
import { useTimeLeft } from "@/hooks/useTimeLeft";

interface CompetitionCountdownProps {
  competition: Competition | null;
}

const CompetitionCountdown: React.FC<CompetitionCountdownProps> = ({
  competition,
}) => {
  const timeLeft = useTimeLeft(competition?.endTime?.toString());

  if (!competition || !timeLeft) {
    return <LoadingCountdown />;
  }

  return (
    <div className="relative group">
      {/* Animated border container */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>

      <div className="relative bg-[#111411] border-[#03B500] border p-6 rounded-lg">
        {/* Background grid effect */}
        <div className="absolute inset-0 rounded-lg opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-green-500 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-green-500 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-green-500 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-green-500 rounded-br-lg" />

        <h2 className="relative text-white text-center text-xl mb-4 font-bold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
            Competition Ends In
          </span>
        </h2>

        <div className="relative flex justify-center items-center space-x-6">
          <TimeUnit label="Hours" value={timeLeft.hours} />
          <EnhancedSeparator />
          <TimeUnit label="Minutes" value={timeLeft.minutes} />
          <EnhancedSeparator />
          <TimeUnit label="Seconds" value={timeLeft.seconds} />
        </div>
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const glowingStyle = `
    text-white 
    drop-shadow-[0_0_25px_rgba(47,255,43,0.7)] 
    text-shadow-[0_0_20px_rgba(47,255,43,0.8),0_0_35px_rgba(47,255,43,0.6),0_0_50px_rgba(47,255,43,0.4)]
  `;

  const digitVariants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.8 },
  };

  return (
    <div className="flex flex-col items-center relative group">
      <div className="relative">
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>

        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            className={`text-5xl font-bold ${glowingStyle} relative`}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.5,
            }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.span
        className="text-[#03B500] text-sm mt-2 font-medium tracking-wider"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {label}
      </motion.span>
    </div>
  );
};

const EnhancedSeparator: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <motion.div
      className="text-[#03B500] text-4xl font-bold"
      animate={{
        opacity: [1, 0.3, 1],
        scale: [1, 0.95, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      :
    </motion.div>
  </div>
);

const LoadingTimeUnit: React.FC = () => {
  const glowingStyle = `
    text-white 
    drop-shadow-[0_0_25px_rgba(47,255,43,0.7)] 
    text-shadow-[0_0_20px_rgba(47,255,43,0.8),0_0_35px_rgba(47,255,43,0.6),0_0_50px_rgba(47,255,43,0.4)]
  `;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`text-5xl font-bold ${glowingStyle} w-[2ch] h-[1.2em] overflow-hidden relative`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [0.98, 1, 0.98],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 bg-green-500/10 blur-lg"></div>
        88
      </motion.div>
      <motion.span
        className="text-[#03B500] text-sm mt-2 opacity-50"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ...
      </motion.span>
    </div>
  );
};

const LoadingCountdown: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 rounded-lg blur opacity-50 animate-pulse"></div>
      <div className="relative bg-[#111411] border-[#03B500] border p-6 rounded-lg">
        <h2 className="text-white text-center text-xl mb-4 font-bold opacity-50">
          Competition Ends In
        </h2>
        <div className="flex justify-center items-center space-x-6">
          <LoadingTimeUnit />
          <EnhancedSeparator />
          <LoadingTimeUnit />
          <EnhancedSeparator />
          <LoadingTimeUnit />
        </div>
      </div>
    </div>
  );
};

export default CompetitionCountdown;
