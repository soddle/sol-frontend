"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Clock, Users, History } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  topPercent: number;
  points: number;
  bestTime: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  competitionTimer?: React.ReactNode;
  type?: "today" | "yesterday" | "alltime";
}

const CyberpunkLeaderboard = ({
  entries,
  competitionTimer,
  type = "today",
}: LeaderboardProps) => {
  const [selectedType, setSelectedType] = useState(type);

  const tabs = [
    { id: "today", label: "Today", icon: <Trophy size={16} /> },
    { id: "yesterday", label: "Yesterday", icon: <History size={16} /> },
    { id: "alltime", label: "All Time", icon: <Users size={16} /> },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto p-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500">
      <motion.div
        className="absolute inset-0 opacity-75"
        animate={{
          background: [
            "linear-gradient(90deg, rgba(34,197,94,0.5), rgba(16,185,129,0.5))",
            "linear-gradient(180deg, rgba(34,197,94,0.5), rgba(16,185,129,0.5))",
            "linear-gradient(270deg, rgba(34,197,94,0.5), rgba(16,185,129,0.5))",
            "linear-gradient(0deg, rgba(34,197,94,0.5), rgba(16,185,129,0.5))",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="relative bg-[#111411] overflow-hidden"
        style={{
          clipPath:
            "polygon(2% 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0 98%, 0 2%)",
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

        {/* Timer section */}
        {competitionTimer && (
          <div className="relative p-4 border-b border-green-500/30">
            <div className="flex items-center justify-center gap-2">
              <Clock className="text-green-500" size={20} />
              {competitionTimer}
            </div>
          </div>
        )}

        {/* Tab navigation */}
        <div className="relative flex border-b border-green-500/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setSelectedType(tab.id as "today" | "yesterday" | "alltime")
              }
              className={`
                flex-1 px-4 py-3 flex items-center justify-center gap-2
                text-sm font-medium transition-colors duration-300
                ${
                  selectedType === tab.id
                    ? "text-green-400 bg-green-500/10"
                    : "text-green-500/50 hover:text-green-400/80 hover:bg-green-500/5"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard entries */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {entries.map((entry, index) => (
              <motion.div
                key={`${entry.rank}-${entry.name}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative flex items-center gap-4 p-4
                  border-b border-green-500/10
                  hover:bg-green-500/5 transition-colors duration-300
                `}
              >
                {/* Rank indicator */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${entry.rank <= 3 ? "bg-green-500/20" : "bg-green-500/10"}
                    `}
                  >
                    <span
                      className={`
                      font-bold text-lg
                      ${entry.rank === 1 ? "text-yellow-400" : ""}
                      ${entry.rank === 2 ? "text-gray-400" : ""}
                      ${entry.rank === 3 ? "text-amber-600" : ""}
                      ${entry.rank > 3 ? "text-green-500" : ""}
                    `}
                    >
                      #{entry.rank}
                    </span>
                  </div>
                </div>

                {/* User info */}
                <div className="flex-grow">
                  <div className="font-medium text-white">{entry.name}</div>
                  <div className="text-sm text-green-500/50">
                    Top {entry.topPercent}%
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-green-400 font-medium">
                    {entry.points.toLocaleString()} pts
                  </div>
                  <div className="text-sm text-green-500/50">
                    {(entry.bestTime / 1000).toFixed(2)}s
                  </div>
                </div>

                {/* Hover effect line */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"
                  initial={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-green-500/30" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-green-500/30" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-green-500/30" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-green-500/30" />

        {/* Animated border lines */}
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

export default CyberpunkLeaderboard;
