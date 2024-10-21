"use server";

import { prisma } from "@/lib/prisma";
import { LeaderboardEntry } from "@/types";

export async function fetchLeaderboard(
  gameType: number,
  leaderboardType: "today" | "yesterday" | "alltime",
  page: number = 1,
  entriesPerPage: number = 10
): Promise<{ entries: LeaderboardEntry[]; totalEntries: number }> {
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
    },
    _min: {
      playDuration: true,
    },
    orderBy: [
      {
        _sum: {
          score: "desc",
        },
      },
      {
        _min: {
          playDuration: "asc",
        },
      },
    ],
    skip: (page - 1) * entriesPerPage,
    take: entriesPerPage,
  });

  const leaderboardWithRanks = leaderboard.map((entry, index) => ({
    rank: (page - 1) * entriesPerPage + index + 1,
    player: entry.userAddress,
    totalScore: entry._sum.score || 0,
    bestTime: entry._min.playDuration || 0,
  }));

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
