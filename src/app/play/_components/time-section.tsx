"use client";
import { memo, useState, useEffect, useMemo } from "react";
import { useRootStore } from "@/stores/storeProvider";
import { useGameState } from "@/hooks/useGameState";

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

  return (
    <div className="flex justify-center items-center">
      <span className="text-5xl font-bold text-white flex gap-1">
        <span className={glowingStyle}>{hours}</span>
        <span className={separatorStyle}>:</span>
        <span className={glowingStyle}>{minutes}</span>
        <span className={separatorStyle}>:</span>
        <span className={glowingStyle}>{seconds}</span>
      </span>
    </div>
  );
};

GlowingTime.displayName = "GlowingTime";

const DynamicGlowingTime = () => {
  const { game } = useRootStore();
  const gameState = game((state) => state.gameState);
  const { fetchGameState } = useGameState();

  const endTime = useMemo(() => {
    return Date.now() + 1000 * 60 * 60 * 24;
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

  return <GlowingTime time={timeLeft} />;
};
