"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeaderboardEntry } from "@/types";

import { Competition } from "@prisma/client";
import CompetitionTimer from "@/components/competitionTimer";

interface CyberpunkLeaderboardProps {
  entries: LeaderboardEntry[];
  type: "today" | "yesterday" | "alltime";
  competition: Competition | null;
}

const CyberpunkLeaderboard: React.FC<CyberpunkLeaderboardProps> = ({
  entries,
  type,
  competition,
}) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Animated border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-gradient-xy"></div>

      <div className="relative bg-[#111411] rounded-lg p-6 overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Leaderboard header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-400">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
              {type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard
            </span>
          </h2>
          <CompetitionTimer competition={competition} />
        </div>

        {/* Leaderboard table */}
        <motion.table
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <thead>
            <tr className="text-green-500 border-b border-green-500/30">
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-right">Top %</th>
              <th className="py-2 px-4 text-right">Points</th>
              <th className="py-2 px-4 text-right">Best Time</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {entries.map((entry, index) => (
                <motion.tr
                  key={index}
                  variants={rowVariants}
                  className="border-b border-green-500/10 hover:bg-green-500/5 transition-colors"
                  onHoverStart={() => setHoveredRow(index)}
                  onHoverEnd={() => setHoveredRow(null)}
                >
                  <td className="py-2 px-4">
                    <span className="flex items-center">
                      {entry.rank}
                      {index < 3 && (
                        <motion.img
                          src={`/icons/rank-${index + 1}.svg`}
                          alt={`Rank ${index + 1}`}
                          className="w-6 h-6 ml-2"
                          animate={{
                            rotate: hoveredRow === index ? [0, 360] : 0,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </span>
                  </td>
                  <td className="py-2 px-4">{entry.name}</td>
                  <td className="py-2 px-4 text-right">{entry.topPercent}%</td>
                  <td className="py-2 px-4 text-right">{entry.points}</td>
                  <td className="py-2 px-4 text-right">
                    {formatTime(entry.bestTime)}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </motion.table>

        {/* Scanning line effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
          animate={{
            y: ["0%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default CyberpunkLeaderboard;
