import { useCallback, useMemo } from "react";
import { useChainAdapter } from "./useChainAdapter";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { LeaderboardType } from "@/app/(activityPages)/leaderboard/leaderboardPageClient";

export function useGame() {
  const adapter = useChainAdapter();

  const gameActions = useMemo(
    () => ({
      fetchCurrentCompetition: async () => adapter.fetchCurrentCompetition(),
      fetchTodaySession: async (playerAddress: string) =>
        adapter.fetchTodaySession(playerAddress),
      startGameSession: async (gameType: number, wallet: AnchorWallet) =>
        adapter.startGameSession(gameType, wallet),
      fetchUserGuesses: async (sessionId: string) =>
        adapter.fetchUserGuesses(sessionId),
      makeGuess: async (sessionId: string, guessedKOLId: string) =>
        adapter.makeGuess(sessionId, guessedKOLId),
      fetchLeaderboard: async (
        gameType: 1 | 2 | 3,
        leaderboardType: LeaderboardType
      ) => adapter.fetchLeaderboard(gameType, leaderboardType),
    }),
    [adapter]
  );

  return gameActions;
}
