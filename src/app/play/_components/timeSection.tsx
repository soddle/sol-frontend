"use client";
import { memo, useState, useEffect, useMemo } from "react";
import { useRootStore } from "@/stores/storeProvider";
import { useGameState } from "@/hooks/useGameState";
import { motion, AnimatePresence } from "framer-motion";

export default function TimeSection() {
  return (
    <section
      className="bg-[#111411] border-[#03B500] border p-4"
      style={{
        clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 18%)",
      }}
    >
      <p className="text-white text-center text-2xl mb-2">
        Enter daily tournaments by <br />
        guessing crypto personalities!
      </p>

      <DynamicGlowingTime />
    </section>
  );
}

interface TimeProps {
  time: { hours: string; minutes: string; seconds: string };
}

const GlowingTime: React.FC<TimeProps> = ({ time }) => {
  const { hours, minutes, seconds } = time;
  const glowingStyle = `
    text-white 
    drop-shadow-[0_0_25px_rgba(47,255,43,1)] 
    text-shadow-[0_0_20px_rgba(47,255,43,1),0_0_35px_rgba(47,255,43,0.8),0_0_50px_rgba(47,255,43,0.6)]
  `;
  const separatorStyle = `${glowingStyle} opacity-75`;

  const digitVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="flex justify-center items-center">
      <span className="text-5xl font-bold text-white flex gap-1">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={hours}
            className={glowingStyle}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {hours}
          </motion.span>
        </AnimatePresence>
        <span className={separatorStyle}>:</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={minutes}
            className={glowingStyle}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {minutes}
          </motion.span>
        </AnimatePresence>
        <span className={separatorStyle}>:</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={seconds}
            className={glowingStyle}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {seconds}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
};

GlowingTime.displayName = "GlowingTime";

const DynamicGlowingTime = () => {
  const { game } = useRootStore();
  const gameState = game((state) => state.gameState);
  const [isLoading, setIsLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const endTime = useMemo(() => {
    if (gameState) {
      const inMill = Number(gameState.currentCompetition.endTime);
      setIsLoading(false);
      return inMill * 1000;
    }
    return 0;
  }, [gameState]);

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

  if (isLoading || Number.isNaN(endTime)) {
    return <Loading />;
  }

  return <GlowingTime time={timeLeft} />;
};

function Loading() {
  const glowingStyle = `
    text-white 
    drop-shadow-[0_0_25px_rgba(47,255,43,1)] 
    text-shadow-[0_0_20px_rgba(47,255,43,1),0_0_35px_rgba(47,255,43,0.8),0_0_50px_rgba(47,255,43,0.6)]
  `;

  const digitVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  return (
    <div className="flex justify-center items-center">
      <motion.span
        className="text-5xl font-bold text-white flex gap-1"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {["88", ":", "88", ":", "88"].map((item, index) => (
          <motion.div
            key={index}
            className="relative w-[1.5ch] h-[1.5em] overflow-hidden"
            initial={{ rotateX: -90 }}
            animate={{ rotateX: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
                repeatDelay: 1,
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
                  duration: 2,
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
                    className={`${glowingStyle} opacity-30`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
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
      </motion.span>
    </div>
  );
}
