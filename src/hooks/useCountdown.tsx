import { useState, useEffect, useRef } from "react";
import { TimeInput, TimeObject } from "@/lib/utils";

const calculateTimeLeft = (endTime: number): TimeObject => {
  const now = Date.now();
  const difference = endTime - now;

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

export const useCountdown = (endTime: TimeInput): TimeObject => {
  const [timeLeft, setTimeLeft] = useState<TimeObject>({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const endTimeRef = useRef<number>(0);

  useEffect(() => {
    if (endTime instanceof Date) {
      endTimeRef.current = endTime.getTime();
    } else if (typeof endTime === "number") {
      endTimeRef.current = endTime;
    } else {
      const now = new Date();
      now.setHours(
        parseInt(endTime.hours),
        parseInt(endTime.minutes),
        parseInt(endTime.seconds)
      );
      endTimeRef.current = now.getTime();
    }

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft(endTimeRef.current));
    };

    updateTimer(); // Initial call

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};
