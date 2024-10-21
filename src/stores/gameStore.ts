import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import * as anchor from "@coral-xyz/anchor";

import { GameType } from "@/lib/constants";
import { GuessWithGuessedKol, OnchainGameState } from "@/lib/chains/types";
import { KOL, GameSession, Competition } from "@prisma/client";

interface GameState {
  currentGameType: GameType | null;
  currentCompetition: Competition | null;
  currentSession: GameSession | null;
  playerGuesses: GuessWithGuessedKol[] | null;
  remainingGuesses: KOL[] | null;
  isLoading: boolean;
}
interface GameActions {
  setCurrentGameType: (gameType: GameType) => void;
  setGameSession: (session: GameSession | null) => void;
  setGameSessionGuesses: (guesses: GuessWithGuessedKol[]) => void;
  setRemainingGuesses: (guesses: KOL[]) => void;
  setCurrentCompetition: (state: Competition | null) => void;
  resetGame: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

const initialState: GameState = {
  currentGameType: null,
  currentCompetition: null,
  currentSession: null,
  playerGuesses: null,
  remainingGuesses: null,
  isLoading: true,
};

export type GameStore = GameState & GameActions;

export const useGameStore = () =>
  create(
    immer<GameState & GameActions>((set) => ({
      ...initialState,
      setIsLoading: (isLoading) =>
        set((state) => {
          state.isLoading = isLoading;
        }),
      setGameSessionGuesses: (guesses) =>
        set((state) => {
          state.playerGuesses = guesses;
        }),
      setRemainingGuesses: (guesses) =>
        set((state) => {
          state.remainingGuesses = guesses;
        }),
      setCurrentGameType: (gameType) =>
        set((state) => {
          state.currentGameType = gameType;
        }),
      setGameSession: (session) =>
        set((state) => {
          state.currentSession = session;
        }),
      setCurrentCompetition: (newCompetition: Competition | null) =>
        set((state) => {
          state.currentCompetition = newCompetition;
        }),
      resetGame: () =>
        set((state) => {
          state.currentCompetition = null;
          state.currentSession = null;

          state.currentGameType = null;
        }),
    }))
  );
