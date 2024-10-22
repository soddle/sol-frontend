"use server";
import { calculateScore } from "@/lib/chains/svm/solanaAdapter";
import {
  GameSessionWithGuesses,
  GuessWithGuessedKol,
  OnchainGameSession,
} from "@/lib/chains/types";
import { compareKOLs } from "@/lib/cmp";
import { GameAlreadyCompletedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { Competition, GameSession, Guess } from "@prisma/client";

const onChainId = "COMP23201";

import { ObjectId } from "mongodb";

// Function to generate a new ObjectId
const generateObjectId = (): string => {
  return new ObjectId().toHexString();
};

export const upsertCurrentCompetition = async (onChainData: {
  onChainId: string;
  startTime: number;
  endTime: number;
  prize: number;
}): Promise<Competition> => {
  return prisma.$transaction(async (prisma) => {
    const competition = await prisma.competition.upsert({
      where: { onChainId: onChainData.onChainId },
      update: {
        startTime: new Date(onChainData.startTime * 1000),
        endTime: new Date(onChainData.endTime * 1000),
        prize: onChainData.prize,
        isActive: true,
      },
      create: {
        id: generateObjectId(),
        onChainId: onChainData.onChainId,
        startTime: new Date(onChainData.startTime * 1000),
        endTime: new Date(onChainData.endTime * 1000),
        prize: onChainData.prize,
        isActive: true,
      },
    });

    await prisma.competition.updateMany({
      where: {
        id: { not: competition.id },
        isActive: true,
      },
      data: { isActive: false },
    });

    return competition;
  });
};

export const fetchLatestCompetition = async (): Promise<Competition | null> => {
  try {
    const competition = await prisma.competition.findFirst({
      where: { isActive: true },
      orderBy: { startTime: "desc" },
    });

    if (!competition) {
      console.log("No active competition found");
      return null;
    }

    return competition;
  } catch (error) {
    console.error("Error fetching latest competition:", error);
    throw error;
  }
};

export const createCompetition = async (
  startTime: Date,
  endTime: Date,
  prize: number
): Promise<Competition> => {
  return prisma.$transaction(async (prisma) => {
    await prisma.competition.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    return prisma.competition.create({
      data: {
        id: generateObjectId(),
        startTime,
        endTime,
        prize,
        isActive: true,
        onChainId,
      },
    });
  });
};

export const fetchTodaySession = async (
  abbrWalletAddress: string
): Promise<GameSessionWithGuesses | null> => {
  if (!abbrWalletAddress) {
    throw new Error("Wallet address is required");
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    return await prisma.gameSession.findFirst({
      where: {
        userAddress: {
          startsWith: abbrWalletAddress,
        },
        startTime: { gte: today },
      },
      orderBy: { startTime: "desc" },
      include: {
        guesses: {
          include: { guessedKOL: true },
          orderBy: { createdAt: "desc" },
        },
        user: true,
        competition: true,
      },
    });
  } catch (error) {
    console.error("Error fetching today's session:", error);
    throw new Error("Failed to fetch today's session");
  }
};

export const fetchGameSessionsByAddress = async (
  walletAddress: string
): Promise<GameSession[]> => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  try {
    return await prisma.gameSession.findMany({
      where: { userAddress: { startsWith: walletAddress } },
      include: {
        guesses: true,
        user: true,
        competition: true,
      },
      orderBy: { startTime: "desc" },
    });
  } catch (error) {
    console.error("Error fetching game sessions:", error);
    throw new Error("Failed to fetch game sessions");
  }
};

export const fetchAllActiveSessions = async (
  walletAddress: string
): Promise<GameSession[]> => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  const sessions = await prisma.gameSession.findMany({
    where: {
      userAddress: walletAddress,
      completed: false,
    },
    include: {
      guesses: true,
      user: true,
    },
  });

  return sessions;
};

export const createGameSession = async (
  onchainSession: Partial<OnchainGameSession>
): Promise<GameSession> => {
  if (
    !onchainSession.player ||
    !onchainSession.competitionId ||
    !onchainSession.gameType ||
    !onchainSession.startTime ||
    !onchainSession.kol
  ) {
    throw new Error("Missing required fields for game session creation");
  }

  const user = await prisma.user.upsert({
    where: { address: onchainSession.player.toString() },
    update: {},
    create: {
      id: generateObjectId(),
      address: onchainSession.player.toString(),
    },
  });

  const startTime = new Date(parseInt(onchainSession.startTime) * 1000);

  return prisma.gameSession.create({
    data: {
      id: generateObjectId(),
      competitionId: onchainSession.competitionId,
      targetKOLId: onchainSession.kol.id,
      gameType: onchainSession.gameType,
      startTime: startTime,
      completed: false,
      userAddress: user.address,
      score: 0,
      playDuration: 0,
      mistakes: 0,
      difficulty: 1,
    },
    include: {
      guesses: true,
      user: true,
      competition: true,
    },
  });
};

export const fetchUserGuesses = async (
  sessionId: string
): Promise<GuessWithGuessedKol[]> => {
  console.log("onchainSession id: ", sessionId);
  try {
    const guesses = await prisma.guess.findMany({
      where: { sessionId },
      include: { guessedKOL: true },
      orderBy: { createdAt: "asc" },
    });

    return guesses;
  } catch (error) {
    console.error("Error fetching user guesses:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user guesses: ${error.message}`);
    } else {
      throw new Error("Failed to fetch user guesses: Unknown error");
    }
  }
};

export const fetchUserGuessesByAddress = async (
  abbrWalletAddress: string
): Promise<GuessWithGuessedKol[]> => {
  console.log("abbrWalletAddress: ", abbrWalletAddress);
  try {
    const guesses = await prisma.guess.findMany({
      where: { session: { userAddress: abbrWalletAddress } },
      include: { guessedKOL: true },
      orderBy: { createdAt: "asc" },
    });

    return guesses;
  } catch (error) {
    console.error("Error fetching user guesses:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user guesses: ${error.message}`);
    } else {
      throw new Error("Failed to fetch user guesses: Unknown error");
    }
  }
};

export const makeGuess = async (
  sessionId: string,
  guessedKOLId: string
): Promise<Guess> => {
  try {
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { guesses: true, competition: true },
    });

    if (!gameSession) {
      throw new Error("Game session not found");
    }

    if (gameSession.completed) {
      throw new GameAlreadyCompletedError();
    }

    const guessedKOL = await prisma.kOL.findUnique({
      where: { id: guessedKOLId },
    });

    const targetKOL = await prisma.kOL.findUnique({
      where: { id: gameSession.targetKOLId },
    });

    if (!guessedKOL || !targetKOL) {
      throw new Error("KOL not found");
    }

    const comparisonResult = compareKOLs(guessedKOL, targetKOL);
    const isCorrect = Object.values(comparisonResult).every(
      (result) => result === "correct"
    );
    const score = calculateScore(gameSession.guesses.length + 1, isCorrect);

    const newGuess = await prisma.guess.create({
      data: {
        id: generateObjectId(),
        sessionId: sessionId,
        guessedKOLId: guessedKOLId,
        isCorrect,
        feedback: comparisonResult,
        score,
        attemptNumber: gameSession.guesses.length + 1,
      },
      include: { guessedKOL: true, session: true },
    });

    if (isCorrect) {
      const playDuration = Math.round(
        (newGuess.createdAt.getTime() - gameSession.startTime.getTime()) / 1000
      );
      await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
          completed: true,
          endTime: newGuess.createdAt,
          score: score,
          playDuration: playDuration,
          mistakes: gameSession.guesses.length,
        },
      });
    } else {
      await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
          mistakes: {
            increment: 1,
          },
        },
      });
    }

    return newGuess;
  } catch (error) {
    console.error("Error making guess:", error);
    throw new Error("Failed to make guess");
  }
};
