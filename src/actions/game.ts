"use server";
import { OnchainGameSession } from "@/lib/chains/types";
import { prisma } from "@/lib/prisma";
import { GameSession } from "@prisma/client";

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
): Promise<GameSession | null> {
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
  session: OnchainGameSession
): Promise<GameSession> {
  // create a new user (address) if it doesn't already exist;
  const user = await prisma.user.upsert({
    where: { address: session.player.toString() },
    update: {},
    create: { address: session.player.toString() },
  });

  const newSession = await prisma.gameSession.create({
    data: {
      gameType: session.gameType,
      startTime: session.startTime,
      completed: false,
      userAddress: user.address,
      score: 100,
    },
    include: {
      guesses: true,
      user: true,
    },
  });

  return newSession;
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
