import { useCallback } from "react";
import { useChainAdapter } from "./useChainAdapter";
import { Competition, GameSession, Guess, KOL } from "@prisma/client";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { GameSessionWithGuesses } from "@/lib/chains/types";

export function useGame() {
  const adapter = useChainAdapter();

  const fetchCurrentCompetition =
    useCallback(async (): Promise<Competition | null> => {
      return adapter.fetchCurrentCompetition();
    }, [adapter]);

  const fetchGameSession = useCallback(
    async (playerAddress: string): Promise<GameSessionWithGuesses | null> => {
      return adapter.fetchGameSession(playerAddress);
    },
    [adapter]
  );

  const startGameSession = useCallback(
    async (gameType: number, wallet: AnchorWallet): Promise<GameSession> => {
      return adapter.startGameSession(gameType, wallet);
    },
    [adapter]
  );

  const fetchUserGuesses = useCallback(
    async (sessionId: string): Promise<Guess[]> => {
      return adapter.fetchUserGuesses(sessionId);
    },
    [adapter]
  );

  const makeGuess = useCallback(
    async (sessionId: string, guessedKOLId: string): Promise<Guess> => {
      return adapter.makeGuess(sessionId, guessedKOLId);
    },
    [adapter]
  );

  return {
    fetchUserGuesses,
    fetchCurrentCompetition,
    fetchGameSession,
    startGameSession,
    makeGuess,
  };
}
