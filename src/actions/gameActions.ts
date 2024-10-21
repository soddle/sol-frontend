"use server";
import { calculateScore } from "@/lib/chains/svm/solanaAdapter";
import {
  GameSessionWithGuesses,
  GuessWithSessionAndGuessedKol,
  OnchainGameSession,
} from "@/lib/chains/types";
import { compareKOLs } from "@/lib/cmp";
import { prisma } from "@/lib/prisma";
import { rawKOL } from "@/types/kol";
import { Competition, GameSession, Guess, Prisma } from "@prisma/client";

const onChainId = "COMP23201";

import { ObjectId } from "mongodb";

// Function to generate a new ObjectId
function generateObjectId(): string {
  return new ObjectId().toHexString();
}

export async function upsertCurrentCompetition(onChainData: {
  onChainId: string;
  startTime: number;
  endTime: number;
  prize: number;
}): Promise<Competition> {
  // Check if the competition already exists in the database
  let competition = await prisma.competition.findUnique({
    where: { onChainId: onChainData.onChainId },
  });

  if (!competition) {
    // If the competition doesn't exist, create a new one
    competition = await prisma.competition.create({
      data: {
        id: generateObjectId(),
        onChainId: onChainData.onChainId,
        startTime: new Date(onChainData.startTime * 1000),
        endTime: new Date(onChainData.endTime * 1000),
        prize: onChainData.prize,
        isActive: true,
      },
    });

    console.log("New competition created:", competition);
  } else {
    // If the competition exists, update it
    competition = await prisma.competition.update({
      where: { id: competition.id },
      data: {
        startTime: new Date(onChainData.startTime * 1000),
        endTime: new Date(onChainData.endTime * 1000),
        prize: onChainData.prize,
        isActive: true,
      },
    });

    console.log("Existing competition updated:", competition);
  }

  // Mark all other competitions as inactive
  await prisma.competition.updateMany({
    where: {
      id: { not: competition.id },
      isActive: true,
    },
    data: { isActive: false },
  });

  return competition;
}

export async function fetchLatestCompetition(): Promise<Competition | null> {
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
}

export async function createCompetition(
  startTime: Date,
  endTime: Date,
  prize: number
): Promise<Competition> {
  try {
    // Set all existing competitions to inactive
    await prisma.competition.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create a new active competition
    const newCompetition = await prisma.competition.create({
      data: {
        id: generateObjectId(),
        startTime,
        endTime,
        prize,
        isActive: true,
        onChainId,
      },
    });

    return newCompetition;
  } catch (error) {
    console.error("Error creating competition:", error);
    throw error;
  }
}

export async function fetchGameSessionsByAddress(
  walletAddress: string
): Promise<GameSession[]> {
  const sessions = await prisma.gameSession.findMany({
    where: { userAddress: walletAddress },
    include: {
      guesses: true,
      user: true,
    },
  });

  return sessions;
}

export async function fetchCurrentActiveSession(
  walletAddress: string
): Promise<GameSessionWithGuesses | null> {
  // const createdKOLs = await prisma.kOL.createMany({
  //   data: rawKOL,
  //   // skipDuplicates: true,
  // });

  // Fetch the user by wallet address

  const user = await prisma.user.findUnique({
    where: { address: walletAddress },
  });

  // If the user does not exist, return null
  if (!user) {
    return null;
  }

  // Fetch the most recent active game session for the user
  const existingSession = await prisma.gameSession.findFirst({
    where: {
      userAddress: walletAddress,
      completed: false, // Only fetch active sessions
    },
    orderBy: {
      startTime: "desc", // Get the most recent existingSession
    },
    include: {
      guesses: true, // Include guesses if needed
      user: true,
    },
  });

  // Return the existingSession or null if not found
  return existingSession;
}

export async function fetchAllActiveSessions(
  walletAddress: string
): Promise<GameSession[]> {
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
}

export async function fetchUserGuesses(sessionId: string): Promise<Guess[]> {
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
}

export async function makeGuess(
  sessionId: string,
  guessedKOLId: string
): Promise<Guess> {
  try {
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { guesses: true, competition: true },
    });

    if (!gameSession) {
      throw new Error("Game session not found");
    }

    if (gameSession.completed) {
      throw new Error("Game session is already completed");
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
      await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
          completed: true,
          endTime: new Date(),
          score: score,
        },
      });
    }

    return newGuess;
  } catch (error) {
    console.error("Error making guess:", error);
    throw new Error("Failed to make guess");
  }
}

export async function createGameSession(
  onchainSession: Partial<OnchainGameSession>
): Promise<GameSession> {
  if (
    !onchainSession.player ||
    !onchainSession.competitionId ||
    !onchainSession.gameType ||
    !onchainSession.startTime ||
    !onchainSession.kol
  ) {
    throw new Error("Missing required fields for game session creation");
  }

  try {
    const user = await prisma.user.upsert({
      where: { address: onchainSession.player.toString() },
      update: {},
      create: {
        id: generateObjectId(),
        address: onchainSession.player.toString(),
      },
    });

    // Check if the user has already played today
    const lastSession = await prisma.gameSession.findFirst({
      where: {
        userAddress: user.address,
        startTime: {
          gte: new Date(new Date().setUTCHours(0, 0, 0, 0)), // Start of today (UTC)
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    // If the user has already played today, throw an error
    if (!lastSession) {
      throw new Error("You can only play once per day");
    }

    const startTime = new Date(
      parseInt(onchainSession.startTime.toString(), 16) * 1000
    );

    const newSession = await prisma.gameSession.create({
      data: {
        id: generateObjectId(),
        competitionId: onchainSession.competitionId,
        targetKOLId: onchainSession.kol.id,
        gameType: onchainSession.gameType,
        startTime: startTime,
        completed: false,
        userAddress: user.address,
        score: onchainSession.score || 1000,
      },
      include: {
        guesses: true,
        user: true,
        competition: true,
      },
    });

    console.log("Game session created successfully:", newSession.id);
    return newSession;
  } catch (error) {
    console.error("Error creating game session:", error);
    throw error; // Throw the original error to preserve the message
  }
}
