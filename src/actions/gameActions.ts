"use server";
import { calculateScore } from "@/lib/chains/svm/solanaAdapter";
import { GameSessionWithGuesses, OnchainGameSession } from "@/lib/chains/types";
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

export async function fetchLatestCompetition(): Promise<Competition | null> {
  // createDummyCompetition();
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
    throw new Error("Missing required fields for game onchainSession creation");
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

    console.log("Game onchainSession created successfully:", newSession.id);
    return newSession;
  } catch (error) {
    console.error("Error creating game onchainSession:", error);
    throw new Error("Failed to create game onchainSession");
  }
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
        attributes: guessedKOL,
        feedback: comparisonResult,
        score,
        attemptNumber: gameSession.guesses.length + 1,
      },
      include: { guessedKOL: true },
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

/**
 * mkdir -p ~/data/rs0-0 ~/data/rs0-1 ~/data/rs0-2
 * mongod --replSet rs0 --port 27017 --dbpath ~/data/rs0-0 --oplogSize 128
mongod --replSet rs0 --port 27018 --dbpath ~/data/rs0-1 --oplogSize 128
mongod --replSet rs0 --port 27019 --dbpath ~/data/rs0-2 --oplogSize 128
 */

export async function createDummyCompetition(): Promise<Competition> {
  try {
    // Set all existing competitions to inactive
    await prisma.competition.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create a dummy competition
    const dummyCompetition = await prisma.competition.create({
      data: {
        id: generateObjectId(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        prize: 1000000, // 1 million (adjust as needed)
        isActive: true,
        onChainId,
      },
    });

    return dummyCompetition;
  } catch (error) {
    console.error("Error creating dummy competition:", error);
    throw error;
  }
}
