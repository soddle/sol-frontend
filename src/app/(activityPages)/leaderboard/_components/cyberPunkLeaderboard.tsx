"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Competition } from "@prisma/client";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useTimeLeft } from "@/hooks/useTimeLeft";
import { LeaderboardEntry } from "@/types";
import { LeaderboardType } from "../leaderboardPageClient";
interface TimeUnit {
  label: string;
  value: number;
}

const CompetitionTimer = ({ endTime }: { endTime: number }) => {
  const timeleft = useTimeLeft(endTime.toString());
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>([
    { label: "HOURS", value: 0 },
    { label: "MINUTES", value: 0 },
    { label: "SECONDS", value: 0 },
  ]);

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = Math.max(0, endTime - now);

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeUnits([
        { label: "HOURS", value: hours },
        { label: "MINUTES", value: minutes },
        { label: "SECONDS", value: seconds },
      ]);
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-green-500/10 blur-xl" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          {/* Title */}
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-green-400 uppercase tracking-wider">
              Competition Ends In
            </h3>
          </div>

          {/* Timer display */}
          <div className="flex gap-4 items-center">
            {timeUnits.map((unit, index) => (
              <React.Fragment key={unit.label}>
                <div className="flex flex-col items-center">
                  {/* Time value */}
                  <div className="relative">
                    <motion.div
                      className="bg-[#111411] border-2 border-green-500/30 p-4 w-24 text-center"
                      style={{
                        clipPath:
                          "polygon(10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)",
                      }}
                      animate={{
                        borderColor: [
                          "rgba(34, 197, 94, 0.3)",
                          "rgba(34, 197, 94, 0.6)",
                          "rgba(34, 197, 94, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {/* Glitch effect on number change */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={unit.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="font-mono text-3xl font-bold text-green-400"
                        >
                          {unit.value.toString().padStart(2, "0")}
                        </motion.div>
                      </AnimatePresence>

                      {/* Scan line effect */}
                      <motion.div
                        className="absolute inset-0 bg-green-400/10"
                        animate={{
                          opacity: [0, 0.5, 0],
                          y: ["0%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-green-500" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-green-500" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500" />
                  </div>

                  {/* Label */}
                  <motion.div
                    className="mt-2 text-xs text-green-400/80 font-medium tracking-wider"
                    animate={{
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {unit.label}
                  </motion.div>
                </div>

                {/* Separator */}
                {index < timeUnits.length - 1 && (
                  <motion.div
                    className="text-green-500 text-2xl font-bold mb-8"
                    animate={{
                      opacity: [1, 0.3, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  >
                    :
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const CyberPunkLeaderboard = ({
  entries,
  competition,
  type,
  onSelectType,
}: {
  entries: LeaderboardEntry[];
  competition: Competition | null;
  type: LeaderboardType;
  onSelectType: (type: LeaderboardType) => void;
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative p-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500">
      <div className="absolute inset-0 animate-pulse opacity-50" />

      <section
        className="relative bg-[#111411] overflow-hidden"
        style={{
          clipPath:
            "polygon(3% 0, 97% 0, 100% 5%, 100% 95%, 97% 100%, 3% 100%, 0 95%, 0 5%)",
        }}
      >
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

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-green-500 animate-pulse" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-green-500 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-green-500 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-green-500 animate-pulse" />

        {/* Glowing lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse" />
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse" />
        </div>

        <div className="relative p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-center mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
                Crypto Legends Leaderboard
              </span>
            </h2>
            <CompetitionTimer endTime={competition?.endTime.getTime() || 0} />
          </div>

          {/* Type Selector */}
          <div className="flex justify-center gap-4 mb-8">
            {(["today", "yesterday", "alltime"] as string[]).map((t) => (
              <motion.button
                key={t}
                onClick={() => onSelectType(t as LeaderboardType)}
                className={`px-4 py-2 uppercase tracking-wider font-bold border-2 ${
                  type === t
                    ? "border-green-500 text-green-400"
                    : "border-green-500/30 text-green-500/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  clipPath:
                    "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                }}
              >
                {t}
              </motion.button>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-green-400 uppercase">
                    <th className="p-4 text-left">Rank</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-center">Top %</th>
                    <th className="p-4 text-center">Points</th>
                    <th className="p-4 text-right">Best Time</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {entries.map((entry, index) => (
                      <motion.tr
                        key={entry.rank}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-green-500/20 text-white/90 hover:bg-green-500/5"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {entry.rank <= 3 && (
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                                className={`text-xl ${
                                  entry.rank === 1
                                    ? "text-yellow-400"
                                    : entry.rank === 2
                                    ? "text-gray-400"
                                    : "text-orange-400"
                                }`}
                              >
                                👑
                              </motion.div>
                            )}
                            <span className="font-mono text-lg">
                              #{entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          {entry.name.slice(0, 10)}
                        </td>
                        <td className="p-4 text-center">
                          {entry.topPercent.toFixed(2)}%
                        </td>
                        <td className="p-4 text-center">
                          <motion.span
                            animate={{
                              opacity: [1, 0.5, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                            className="text-green-400 font-mono"
                          >
                            {entry.points}
                          </motion.span>
                        </td>
                        <td className="p-4 text-right font-mono">
                          {formatTime(entry.bestTime)}
                          {/* <span className="text-green-400">s</span> */}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>

            {/* Scanner line effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-green-500/20"
              animate={{
                y: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CyberPunkLeaderboard;
