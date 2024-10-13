import { useCallback } from "react";
import { useChainAdapter } from "./useChainAdapter";
import { KOL, GameSession, GameState } from "@/types";

export function useGame() {
  const adapter = useChainAdapter();

  const fetchGameState = useCallback(async (): Promise<GameState> => {
    return adapter.fetchGameState();
  }, [adapter]);

  const fetchGameSession = useCallback(
    async (playerAddress: string): Promise<GameSession> => {
      return adapter.fetchGameSession(playerAddress);
    },
    [adapter]
  );

  const startGameSession = useCallback(
    async (gameType: number, kol: KOL): Promise<GameSession> => {
      return adapter.startGameSession(gameType, kol);
    },
    [adapter]
  );

  const makeGuess = useCallback(
    async (gameType: number, guess: KOL): Promise<any> => {
      return adapter.makeGuess(gameType, guess);
    },
    [adapter]
  );

  return {
    fetchGameState,
    fetchGameSession,
    startGameSession,
    makeGuess,
  };
}
