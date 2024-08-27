import { createStore } from "zustand/vanilla";
import * as anchor from "@coral-xyz/anchor";
import { GameSession, GameState } from "@/lib/types/idl-types";
import { GameType } from "@/lib/constants";

export type GameStore = {
  program: anchor.Program<anchor.Idl> | null;
  currentGameType: GameType | null;
  gameState: GameState | null;
  gameSession: GameSession | null;
  setProgram: (program: anchor.Program<anchor.Idl> | null) => void;
  setCurrentGameType: (gameType: GameType) => void;
  setGameSession: (session: GameSession | null) => void;
  setGameState: (state: GameState | null) => void;
  resetGame: () => void;
};

export const createGameStore = (initState: Partial<GameStore> = {}) => {
  return createStore<GameStore>()((set) => ({
    program: null,
    currentGameType: null,
    gameState: null,
    gameSession: null,
    ...initState,
    setProgram: (program) => set({ program }),
    setCurrentGameType: (gameType) => set({ currentGameType: gameType }),
    setGameSession: (session) => set({ gameSession: session }),
    setGameState: (state) => set({ gameState: state }),
    resetGame: () =>
      set({
        gameState: null,
        gameSession: null,
        program: null,
        currentGameType: null,
      }),
  }));
};
