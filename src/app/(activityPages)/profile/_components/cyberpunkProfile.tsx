"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Clock,
  Target,
  Brain,
  Twitter,
  Medal,
  Flame,
  Crown,
  ChevronRight,
  ChevronDown,
  Zap,
} from "lucide-react";

interface GameStats {
  personalityGame: {
    played: number;
    bestTime: number;
    avgGuesses: number;
    winRate: number;
  };
  tweetGame: {
    played: number;
    bestTime: number;
    avgGuesses: number;
    winRate: number;
  };
  emojiGame: {
    played: number;
    bestTime: number;
    avgGuesses: number;
    winRate: number;
  };
}

interface Achievements {
  dayStreak: number;
  topRanks: number;
  perfectGames: number;
  fastestSolve: number;
}

interface ProfileProps {
  username: string;
  level: number;
  xp: number;
  xpToNext: number;
  totalPoints: number;
  rank: number;
  totalPlayers: number;
  gameStats: GameStats;
  achievements: Achievements;
}

const CyberpunkProfile = ({
  username = "CryptoMaster",
  level = 42,
  xp = 8750,
  xpToNext = 10000,
  totalPoints = 156750,
  rank = 13,
  totalPlayers = 10000,
  gameStats = {
    personalityGame: {
      played: 145,
      bestTime: 12.5,
      avgGuesses: 2.3,
      winRate: 92,
    },
    tweetGame: { played: 130, bestTime: 15.2, avgGuesses: 2.1, winRate: 88 },
    emojiGame: { played: 125, bestTime: 18.7, avgGuesses: 2.8, winRate: 85 },
  },
  achievements = {
    dayStreak: 15,
    topRanks: 12,
    perfectGames: 25,
    fastestSolve: 8.2,
  },
}: ProfileProps) => {
  const [activeTab, setActiveTab] = useState("stats");

  const CyberPanel = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`relative p-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 ${className}`}
    >
      <div
        className="relative bg-[#111411] overflow-hidden"
        style={{
          clipPath:
            "polygon(0.5rem 0, calc(100% - 0.5rem) 0, 100% 0.5rem, 100% calc(100% - 0.5rem), calc(100% - 0.5rem) 100%, 0.5rem 100%, 0 calc(100% - 0.5rem), 0 0.5rem)",
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
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      {/* Profile Header */}
      <CyberPanel>
        <div className="p-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <motion.div
                className="w-24 h-24 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  clipPath:
                    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                }}
              >
                <div
                  className="absolute inset-0.5 bg-[#111411]"
                  style={{
                    clipPath:
                      "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Crown className="w-12 h-12 text-green-500" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* User Info */}
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-white mb-2">
                {username}
                <span className="ml-2 text-sm text-green-500">
                  Level {level}
                </span>
              </h1>

              {/* XP Progress */}
              <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp / xpToNext) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="text-sm text-green-500/70">
                {xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
              </div>
            </div>

            {/* Rank Info */}
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">#{rank}</div>
              <div className="text-sm text-green-500/70">
                of {totalPlayers.toLocaleString()} players
              </div>
            </div>
          </div>
        </div>
      </CyberPanel>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: "Day Streak", value: achievements.dayStreak },
          { icon: Trophy, label: "Top Ranks", value: achievements.topRanks },
          {
            icon: Target,
            label: "Perfect Games",
            value: achievements.perfectGames,
          },
          {
            icon: Clock,
            label: "Fastest Solve",
            value: `${achievements.fastestSolve}s`,
          },
        ].map((stat, index) => (
          <CyberPanel key={index}>
            <motion.div
              className="p-4 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-green-500/70">{stat.label}</div>
            </motion.div>
          </CyberPanel>
        ))}
      </div>

      {/* Detailed Stats */}
      <CyberPanel>
        <div className="border-b border-green-500/20">
          <div className="flex">
            {["stats", "achievements"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 px-6 py-4 text-sm font-medium uppercase tracking-wider
                  transition-colors duration-300 relative
                  ${
                    activeTab === tab
                      ? "text-green-400 bg-green-500/10"
                      : "text-green-500/50 hover:text-green-400/80 hover:bg-green-500/5"
                  }
                `}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
                    layoutId="activeTab"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "stats" ? (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 space-y-6"
            >
              {Object.entries(gameStats).map(([game, stats], index) => (
                <div key={game} className="space-y-4">
                  <h3 className="text-lg font-medium text-white capitalize">
                    {game.replace("Game", " Game")}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats).map(([stat, value]) => (
                      <div
                        key={stat}
                        className="bg-[#1A1A1A] p-4 rounded-lg border border-green-500/20"
                      >
                        <div className="text-sm text-green-500/70 capitalize mb-1">
                          {stat.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-xl font-bold text-green-400">
                          {typeof value === "number"
                            ? stat.includes("Time")
                              ? `${value}s`
                              : stat.includes("Rate")
                              ? `${value}%`
                              : value.toFixed(1)
                            : (value as React.ReactNode)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <div className="grid gap-4">
                {[
                  {
                    title: "Speed Demon",
                    desc: "Complete a game in under 10 seconds",
                    progress:
                      achievements.fastestSolve < 10
                        ? 100
                        : (achievements.fastestSolve / 10) * 100,
                    icon: Zap,
                  },
                  {
                    title: "Consistency King",
                    desc: "Maintain a 15-day streak",
                    progress: (achievements.dayStreak / 15) * 100,
                    icon: Crown,
                  },
                  {
                    title: "Perfect Score",
                    desc: "Complete 25 games without any wrong guesses",
                    progress: (achievements.perfectGames / 25) * 100,
                    icon: Target,
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-[#1A1A1A] p-4 rounded-lg border border-green-500/20"
                  >
                    <div className="flex items-center gap-4">
                      <achievement.icon className="w-8 h-8 text-green-500" />
                      <div className="flex-grow">
                        <div className="text-white font-medium mb-1">
                          {achievement.title}
                        </div>
                        <div className="text-sm text-green-500/70 mb-2">
                          {achievement.desc}
                        </div>
                        <div className="w-full bg-[#111411] h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${achievement.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      <div className="text-green-400 font-medium">
                        {Math.round(achievement.progress)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CyberPanel>
    </div>
  );
};

export default CyberpunkProfile;
