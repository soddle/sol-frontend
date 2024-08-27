"use client";

import { ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createGameStore, GameStore } from "@/stores/gameStore";

export type GameStoreApi = ReturnType<typeof createGameStore>;

const GameStoreContext = createContext<GameStoreApi | null>(null);

export interface GameStoreProviderProps {
  children: ReactNode;
}

export const GameStoreProvider = ({ children }: GameStoreProviderProps) => {
  const storeRef = useRef<GameStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createGameStore();
  }

  return (
    <GameStoreContext.Provider value={storeRef.current}>
      {children}
    </GameStoreContext.Provider>
  );
};

export const useGameStore = <T,>(selector: (store: GameStore) => T): T => {
  const gameStoreContext = useContext(GameStoreContext);

  if (!gameStoreContext) {
    throw new Error(`useGameStore must be used within GameStoreProvider`);
  }

  return useStore(gameStoreContext, selector);
};
