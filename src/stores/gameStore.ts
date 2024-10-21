import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { GameType } from "@/lib/constants";
import { GuessWithGuessedKol } from "@/lib/chains/types";
import { KOL, GameSession, Competition } from "@prisma/client";

interface GameState {
  currentGameType: GameType | null;
  currentCompetition: Competition | null;
  currentPlaySession: GameSession | null;
  playerGuesses: GuessWithGuessedKol[];
  remainingGuessKOLs: KOL[];
  isLoading: boolean;
}
interface GameActions {
  setCurrentGameType: (gameType: GameType) => void;
  setPlaySession: (session: GameSession | null) => void;
  setPlaySessionGuesses: (guesses: GuessWithGuessedKol[]) => void;
  updatePlaySessionGuesses: (guesses: GuessWithGuessedKol[]) => void;
  setRemainingGuessKOLs: (guesses: KOL[]) => void;
  updateRemainingGuessKOLs: (kolId: string) => void;
  setCurrentCompetition: (state: Competition | null) => void;
  resetGame: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

const initialState: GameState = {
  currentGameType: null,
  currentCompetition: null,
  currentPlaySession: null,
  playerGuesses: [],
  remainingGuessKOLs: [],
  isLoading: true,
};

export type GameStore = GameState & GameActions;

export const useGameStore = create(
  immer<GameStore>((set) => ({
    ...initialState,
    setIsLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading;
      }),
    setPlaySessionGuesses: (guesses) =>
      set((state) => {
        state.playerGuesses = [...guesses.reverse()];
      }),
    updatePlaySessionGuesses: (guesses) =>
      set((state) => {
        state.playerGuesses = [
          ...guesses.reverse(),
          ...(state.playerGuesses || []),
        ];
      }),
    setRemainingGuessKOLs: (guesses) =>
      set((state) => {
        state.remainingGuessKOLs = guesses;
      }),
    updateRemainingGuessKOLs: (kolId) =>
      set((state) => {
        state.remainingGuessKOLs =
          state.remainingGuessKOLs?.filter((kol) => kol.id !== kolId) || [];
      }),
    setCurrentGameType: (gameType) =>
      set((state) => {
        state.currentGameType = gameType;
      }),
    setPlaySession: (session) =>
      set((state) => {
        state.currentPlaySession = session;
      }),
    setCurrentCompetition: (newCompetition: Competition | null) =>
      set((state) => {
        state.currentCompetition = newCompetition;
      }),
    resetGame: () =>
      set((state) => {
        state.currentCompetition = null;
        state.currentPlaySession = null;
        state.currentGameType = null;
      }),
  }))
);
