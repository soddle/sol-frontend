"use client";

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
    <div className="bg-[#111411] border-[#03B500] border p-4 rounded-lg">
      <h2 className="text-white text-center text-xl mb-2">
        Competition Ends In
      </h2>
      <div className="flex justify-center items-center space-x-4">
        <TimeUnit label="Hours" value={timeLeft.hours} />
        <Separator />
        <TimeUnit label="Minutes" value={timeLeft.minutes} />
        <Separator />
        <TimeUnit label="Seconds" value={timeLeft.seconds} />
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
    drop-shadow-[0_0_25px_rgba(47,255,43,1)] 
    text-shadow-[0_0_20px_rgba(47,255,43,1),0_0_35px_rgba(47,255,43,0.8),0_0_50px_rgba(47,255,43,0.6)]
  `;

  const digitVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          className={`text-4xl font-bold ${glowingStyle}`}
          variants={digitVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="text-[#03B500] text-sm mt-1">{label}</span>
    </div>
  );
};

const Separator: React.FC = () => (
  <div className="text-[#03B500] text-4xl font-bold">:</div>
);

const LoadingCountdown: React.FC = () => {
  return (
    <div className="bg-[#111411] border-[#03B500] border p-4 rounded-lg">
      <h2 className="text-white text-center text-xl mb-2">
        Competition Ends In
      </h2>
      <div className="flex justify-center items-center space-x-4">
        <LoadingTimeUnit />
        <Separator />
        <LoadingTimeUnit />
        <Separator />
        <LoadingTimeUnit />
      </div>
    </div>
  );
};

const LoadingTimeUnit: React.FC = () => {
  const glowingStyle = `
    text-white 
    drop-shadow-[0_0_25px_rgba(47,255,43,1)] 
    text-shadow-[0_0_20px_rgba(47,255,43,1),0_0_35px_rgba(47,255,43,0.8),0_0_50px_rgba(47,255,43,0.6)]
  `;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`text-4xl font-bold ${glowingStyle} w-[2ch] h-[1.2em] overflow-hidden`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        88
      </motion.div>
      <span className="text-[#03B500] text-sm mt-1 opacity-50">...</span>
    </div>
  );
};

export default CompetitionCountdown;
