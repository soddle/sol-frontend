"use server";

import {
  DailyChallenge,
  DailyChallengeStrategy,
  PlayerStats,
  PointCalculator,
} from "@/lib/pointSystem";
import { prisma } from "@/lib/prisma";
import { LeaderboardEntry } from "@/types";

export async function fetchLeaderboard(
  gameType: number,
  leaderboardType: "today" | "yesterday" | "alltime",
  page: number = 1,
  entriesPerPage: number = 10
): Promise<{ entries: LeaderboardEntry[]; totalEntries: number }> {
  console.log("fetching leaderboard in actions", gameType, leaderboardType);
  const now = new Date();
  let startDate: Date;

  switch (leaderboardType) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "yesterday":
      startDate = new Date(now.setDate(now.getDate() - 1));
      startDate.setHours(0, 0, 0, 0);
      break;
    case "alltime":
      startDate = new Date(0); // Beginning of time
      break;
  }

  const totalEntries = await prisma.gameSession.groupBy({
    by: ["userAddress"],
    where: {
      gameType: gameType,
      startTime: {
        gte: startDate,
      },
      completed: true,
    },
    _count: true,
  });

  const leaderboard = await prisma.gameSession.groupBy({
    by: ["userAddress"],
    where: {
      gameType: gameType,
      startTime: {
        gte: startDate,
      },
      completed: true,
    },
    _sum: {
      score: true,
      playDuration: true,
      mistakes: true,
    },
    _avg: {
      difficulty: true,
    },
    _count: {
      _all: true,
    },
    orderBy: [
      {
        _sum: {
          score: "desc",
        },
      },
    ],
    skip: (page - 1) * entriesPerPage,
    take: entriesPerPage,
  });

  const dailyChallenge: DailyChallenge = {
    description: "Complete the game in under 2 minutes",
    condition: (stats: PlayerStats) => stats.time < 120,
  };

  const pointCalculator = new PointCalculator(
    new DailyChallengeStrategy(dailyChallenge)
  );

  const leaderboardWithRanks = leaderboard.map((entry, index) => {
    const stats: PlayerStats = {
      score: entry._sum.score || 0,
      time: entry._sum.playDuration || 0,
      mistakes: entry._sum.mistakes || 0,
      difficulty: entry._avg.difficulty || 1,
    };

    const totalPoints = pointCalculator.calculatePoints(
      stats,
      index + 1,
      leaderboard.length
    );

    return {
      rank: (page - 1) * entriesPerPage + index + 1,
      player: entry.userAddress,
      totalScore: totalPoints,
      bestTime: entry._sum.playDuration || 0,
      gamesPlayed: entry._count._all,
      averageDifficulty: entry._avg.difficulty || 1,
    };
  });

  return {
    entries: leaderboardWithRanks,
    totalEntries: totalEntries.length,
  };
}

export async function getUserRankAndScore(
  walletAddress: string,
  gameType: number,
  leaderboardType: "today" | "yesterday" | "alltime"
): Promise<{ rank: number | null; score: number; totalPlayers: number }> {
  const now = new Date();
  let startDate: Date;

  switch (leaderboardType) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "yesterday":
      startDate = new Date(now.setDate(now.getDate() - 1));
      startDate.setHours(0, 0, 0, 0);
      break;
    case "alltime":
      startDate = new Date(0); // Beginning of time
      break;
  }

  const userScore = await prisma.gameSession.aggregate({
    where: {
      userAddress: walletAddress,
      gameType: gameType,
      startTime: {
        gte: startDate,
      },
      completed: true,
    },
    _sum: {
      score: true,
    },
  });

  const totalPlayers = await prisma.gameSession.groupBy({
    by: ["userAddress"],
    where: {
      gameType: gameType,
      startTime: {
        gte: startDate,
      },
      completed: true,
    },
    _count: true,
  });

  const userRank = await prisma.gameSession.groupBy({
    by: ["userAddress"],
    where: {
      gameType: gameType,
      startTime: {
        gte: startDate,
      },
      completed: true,
    },
    _sum: {
      score: true,
    },
    having: {
      score: {
        _sum: {
          gt: userScore._sum.score || 0,
        },
      },
    },
    _count: true,
  });

  return {
    rank: userRank.length + 1,
    score: userScore._sum.score || 0,
    totalPlayers: totalPlayers.length,
  };
}
