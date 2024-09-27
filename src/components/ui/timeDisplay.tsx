"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRootStore } from "@/stores/storeProvider";
import { motion, AnimatePresence } from "framer-motion";

const TimerDisplay: React.FC = () => {
  const { game } = useRootStore();
  const gameState = game((state) => state.gameState);

  const endTime = useMemo(() => {
    if (gameState) {
      const inMill = Number(gameState.currentCompetition.endTime);
      return inMill * 1000;
    }
    return 0;
  }, [gameState]);

  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - Date.now();

      if (difference <= 0) {
        return { hours: "00", minutes: "00", seconds: "00" };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      };
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTimer(); // Initial call

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

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

  if (!gameState || Number.isNaN(endTime)) {
    return <LoadingTime />;
  }

  return (
    <div className="w-[226px] h-[36px] bg-[#111411] border border-[#2A342A] flex items-center justify-center self-center py-3">
      <div className="text-2xl font-bold flex items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={timeLeft.hours}
            className={glowingStyle}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {timeLeft.hours}
          </motion.span>
        </AnimatePresence>
        <span className={`${glowingStyle} opacity-75 mx-1`}>:</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={timeLeft.minutes}
            className={glowingStyle}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {timeLeft.minutes}
          </motion.span>
        </AnimatePresence>
        <span className={`${glowingStyle} opacity-75 mx-1`}>:</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={timeLeft.seconds}
            className={glowingStyle}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {timeLeft.seconds}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimerDisplay;

function LoadingTime() {
  const glowingStyle = `
    text-white 
    drop-shadow-[0_0_15px_rgba(47,255,43,0.8)] 
    text-shadow-[0_0_10px_rgba(47,255,43,0.8),0_0_20px_rgba(47,255,43,0.6)]
  `;

  const digitVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  return (
    <div className="w-[226px] h-[36px] bg-[#111411] border border-[#2A342A] flex items-center justify-center self-center py-3">
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
              variants={digitVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 0.5,
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
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
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
    </div>
  );
}
