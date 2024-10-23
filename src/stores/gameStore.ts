import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import * as anchor from "@coral-xyz/anchor";

import { GameType } from "@/lib/constants";
import { OnchainGameState } from "@/lib/chains/types";
import { GameSession, Competition } from "@prisma/client";

interface GameStoreState {
  program: anchor.Program<anchor.Idl> | null;
  currentGameType: GameType | null;
  currentCompetition: Competition | null;
  gameSession: GameSession | null;
}

interface GameStoreActions {
  setProgram: (program: anchor.Program<anchor.Idl> | null) => void;
  setCurrentGameType: (gameType: GameType) => void;
  setGameSession: (session: GameSession | null) => void;
  setCurrentCompetition: (state: Competition | null) => void;
  resetGame: () => void;
}

export const createGameStore = () =>
  create(
    immer<GameStoreState & GameStoreActions>((set) => ({
      program: null,
      currentGameType: null,
      currentCompetition: null,
      gameSession: null,
      setProgram: (program) =>
        set((state) => {
          state.program = program;
        }),
      setCurrentGameType: (gameType) =>
        set((state) => {
          state.currentGameType = gameType;
        }),
      setGameSession: (session) =>
        set((state) => {
          state.gameSession = session;
        }),
      setCurrentCompetition: (newCompetition: Competition | null) =>
        set((state) => {
          state.currentCompetition = newCompetition;
        }),
      resetGame: () =>
        set((state) => {
          state.currentCompetition = null;
          state.gameSession = null;
          state.program = null;
          state.currentGameType = null;
        }),
    }))
  );
